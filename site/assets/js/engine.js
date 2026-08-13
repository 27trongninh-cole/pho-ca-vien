
'use strict';
/* ============================ AOV core parser ============================ */
const AOV = (() => {
  function ru32(bytes, pos){ return (bytes[pos] | (bytes[pos+1]<<8) | (bytes[pos+2]<<16) | (bytes[pos+3]<<24)) >>> 0; }
  function wu32(bytes, pos, val){ bytes[pos]=val&0xff; bytes[pos+1]=(val>>>8)&0xff; bytes[pos+2]=(val>>>16)&0xff; bytes[pos+3]=(val>>>24)&0xff; }
  function findBytes(bytes, needle, start, end){
    end = Math.min(end, bytes.length - needle.length + 1);
    outer: for(let i=start;i<end;i++){ for(let j=0;j<needle.length;j++){ if(bytes[i+j]!==needle[j]) continue outer; } return i; }
    return -1;
  }
  function findAscii(bytes, str, start=0, end=bytes.length){ return findBytes(bytes, new TextEncoder().encode(str), start, end); }
  function rstrip0(u8){ let e=u8.length; while(e>0 && u8[e-1]===0) e--; return u8.subarray(0,e); }
  function bytesToStr(u8){ return new TextDecoder('utf-8',{fatal:false}).decode(u8); }
  function strToBytes(s){ return new TextEncoder().encode(s); }

  function walkRecords(bytes, start, end){
    let pos=start; const out=[];
    while(pos<end){
      const recOff=pos; const recordLen=ru32(bytes,pos); let p=pos+4;
      const nameLen=ru32(bytes,p); p+=4;
      const nameRaw=bytes.subarray(p,p+nameLen);
      const name=bytesToStr(rstrip0(nameRaw));
      const contentStart=p+nameLen; const nextOff=recOff+recordLen;
      out.push({recOff,recordLen,nameLen,name,contentStart,contentEnd:nextOff});
      pos=nextOff;
    }
    if(pos!==end) throw new Error('walk mismatch pos='+pos+' end='+end);
    return out;
  }
  function findTopLevelStart(bytes){ const i=findAscii(bytes,'ActorName'); if(i===-1) throw new Error('Không tìm thấy field ActorName — file không đúng định dạng ActorInfo đã giải nén'); return i-8; }
  function parseTopLevel(bytes){
    const totalLen=ru32(bytes,0);
    if(totalLen!==bytes.length) throw new Error('Sai định dạng: total_len='+totalLen+' nhưng file dài '+bytes.length+'. File có thể còn bị nén zstd, cần giải nén trước.');
    return walkRecords(bytes, findTopLevelStart(bytes), bytes.length);
  }
  function getContainerRecords(bytes, trioStart, trioEnd){
    for(let p=trioStart+4;p<trioEnd-4;p++){
      const val=ru32(bytes,p);
      if(val>8 && p+val===trioEnd){
        const innerCount=ru32(bytes,p+4);
        const records=walkRecords(bytes,p+8,trioEnd);
        return {outerLenPos:p, outerLen:val, count:innerCount, records};
      }
    }
    return null;
  }
  function getRootContainer(bytes){
    const nameLen=ru32(bytes,4); const trioStart=8+nameLen; const trioEnd=bytes.length;
    return getContainerRecords(bytes, trioStart, trioEnd);
  }
  function splice(bytes, spliceStart, spliceEnd, newBytes, ancestorPositions, countBump){
    const delta=newBytes.length-(spliceEnd-spliceStart);
    const out=new Uint8Array(bytes.length+delta);
    out.set(bytes.subarray(0,spliceStart),0);
    out.set(newBytes, spliceStart);
    out.set(bytes.subarray(spliceEnd), spliceStart+newBytes.length);
    for(const pos of ancestorPositions){ const cur=ru32(out,pos); wu32(out,pos,cur+delta); }
    if(countBump){ const cur=ru32(out,countBump.pos); wu32(out,countBump.pos, cur+countBump.delta); }
    return {bytes: out, delta};
  }
  function buildNameBlock(name){
    const nameBytes=strToBytes(name);
    const payload=new Uint8Array(nameBytes.length+3);
    payload.set(nameBytes,0);
    const out=new Uint8Array(4+payload.length);
    wu32(out,0,payload.length); out.set(payload,4);
    return out;
  }
  function buildRecord(name, trioBytes){
    const nameBlock=buildNameBlock(name);
    const recLenVal=4+nameBlock.length+trioBytes.length;
    const head=new Uint8Array(4); wu32(head,0,recLenVal);
    return concatBytes(head, nameBlock, trioBytes);
  }
  function concatBytes(...arrs){ let t=0; for(const a of arrs) t+=a.length; const out=new Uint8Array(t); let o=0; for(const a of arrs){ out.set(a,o); o+=a.length; } return out; }

  return {ru32,wu32,findBytes,findAscii,rstrip0,bytesToStr,strToBytes,walkRecords,
    findTopLevelStart,parseTopLevel,getContainerRecords,getRootContainer,
    splice,buildNameBlock,buildRecord,concatBytes};
})();

/* ============================ Transplant engine: ghép skin từ file khác vào vùng mặc định ============================ */
const Transplant = (() => {
  function findField(records, name){ return records.find(r=>r.name===name) || null; }

  const RENAME_MAP = {
    'ArtSkinPrefabLOD0': 'ArtPrefabLOD0',
    'ArtSkinPrefabLODEx0': 'ArtPrefabLODEx0',
    'ArtSkinLobbyShowLOD0': 'ArtLobbyShowLOD0',
    'ArtSkinLobbyIdleShowLOD0': 'ArtLobbyIdleShowLOD0',
    'ArtEnemySkinPrefabLOD0': 'ArtEnemyPrefabLOD0',
    'ArtEnemySkinPrefabLODEx0': 'ArtEnemyPrefabLODEx0',
  };
  const KEEP_SKIN_EXCEPTIONS = ['ArtSkinLobbyShowMovie','ArtSkinLobbyShowCamera'];

  function targetNameFor(rawName){
    for(const exc of KEEP_SKIN_EXCEPTIONS){ if(rawName.startsWith(exc)) return rawName; }
    for(const src in RENAME_MAP){ if(rawName.startsWith(src)) return RENAME_MAP[src]+rawName.slice(src.length); }
    return rawName;
  }

  // Sentinel cố định 8 byte biểu diễn 1 JTCom rỗng (0 field) — ví dụ TransConfigsK/Element[n] chưa set gì.
  const EMPTY_COM_SENTINEL = [4,0,0,0, 4,0,0,0];
  function isEmptyComSentinel(bytes, contentStart, contentEnd){
    if(contentEnd-contentStart < 8) return false;
    const tail = bytes.subarray(contentEnd-8, contentEnd);
    for(let i=0;i<8;i++) if(tail[i]!==EMPTY_COM_SENTINEL[i]) return false;
    return AOV.ru32(bytes, contentStart)===2; // phải là kind JTCom
  }

  function resolveContainerAtAncestors(bytes, ancestors){
    const outerLenPos = ancestors[ancestors.length-1];
    const outerLen = AOV.ru32(bytes, outerLenPos);
    const trioEnd = outerLenPos + outerLen;
    const innerCount = AOV.ru32(bytes, outerLenPos+4);
    const records = AOV.walkRecords(bytes, outerLenPos+8, trioEnd);
    return {outerLenPos, outerLen, count: innerCount, records};
  }

  function walk(bytes, path, templates){
    let container = AOV.getRootContainer(bytes);
    let ancestors = [0, container.outerLenPos];
    let curBytes = bytes;
    for(const step of path){
      if(step.type==='field'){
        let field = findField(container.records, step.name);
        if(!field){
          const tmpl = templates.fieldTemplates && templates.fieldTemplates[step.name];
          if(!tmpl) throw new Error('Thiếu template để auto-create field container "'+step.name+'"');
          const insertPos = container.records.length ? container.records[container.records.length-1].contentEnd : container.outerLenPos+8;
          const countBump = {pos: container.outerLenPos+4, delta:1};
          curBytes = AOV.splice(curBytes, insertPos, insertPos, tmpl, ancestors, countBump).bytes;
          container = resolveContainerAtAncestors(curBytes, ancestors);
          field = findField(container.records, step.name);
        }
        ancestors = ancestors.concat([field.recOff]);
        const inner = AOV.getContainerRecords(curBytes, field.contentStart, field.contentEnd);
        if(!inner) throw new Error('Field "'+step.name+'" không phải container (JTArr/JTCom)');
        ancestors = ancestors.concat([inner.outerLenPos]);
        container = inner;
      } else {
        while(container.records.length <= step.index){
          const tmpl = templates.elementTemplates && templates.elementTemplates[step.index];
          if(!tmpl) throw new Error('Thiếu template để auto-create phần tử index '+step.index);
          const insertPos = container.records.length ? container.records[container.records.length-1].contentEnd : container.outerLenPos+8;
          const countBump = {pos: container.outerLenPos+4, delta:1};
          curBytes = AOV.splice(curBytes, insertPos, insertPos, tmpl, ancestors, countBump).bytes;
          container = resolveContainerAtAncestors(curBytes, ancestors);
        }
        const el = container.records[step.index];
        ancestors = ancestors.concat([el.recOff]);
        const inner = AOV.getContainerRecords(curBytes, el.contentStart, el.contentEnd);
        ancestors = ancestors.concat([inner.outerLenPos]);
        container = inner;
      }
    }
    return {bytes: curBytes, container, ancestors};
  }

  function resolveToField(bytes, path, templates){
    if(path.length===0) throw new Error('path rỗng');
    const headPath = path.slice(0,-1);
    const lastStep = path[path.length-1];
    const {bytes:b2, container, ancestors} = walk(bytes, headPath, templates||{});
    if(lastStep.type==='field'){
      let field = findField(container.records, lastStep.name);
      let curBytes=b2, curContainer=container, curAncestors=ancestors;
      if(!field){
        const tmpl = templates.fieldTemplates && templates.fieldTemplates[lastStep.name];
        if(!tmpl) throw new Error('Thiếu template để auto-create field container "'+lastStep.name+'"');
        const insertPos = curContainer.records.length ? curContainer.records[curContainer.records.length-1].contentEnd : curContainer.outerLenPos+8;
        const countBump = {pos: curContainer.outerLenPos+4, delta:1};
        curBytes = AOV.splice(curBytes, insertPos, insertPos, tmpl, curAncestors, countBump).bytes;
        curContainer = resolveContainerAtAncestors(curBytes, curAncestors);
        field = findField(curContainer.records, lastStep.name);
      }
      return {bytes:curBytes, field, ancestors:curAncestors};
    } else {
      let curBytes=b2, curContainer=container, curAncestors=ancestors;
      while(curContainer.records.length <= lastStep.index){
        const tmpl = templates.elementTemplates && templates.elementTemplates[lastStep.index];
        if(!tmpl) throw new Error('Thiếu template để auto-create phần tử index '+lastStep.index);
        const insertPos = curContainer.records.length ? curContainer.records[curContainer.records.length-1].contentEnd : curContainer.outerLenPos+8;
        const countBump = {pos: curContainer.outerLenPos+4, delta:1};
        curBytes = AOV.splice(curBytes, insertPos, insertPos, tmpl, curAncestors, countBump).bytes;
        curContainer = resolveContainerAtAncestors(curBytes, curAncestors);
      }
      const field = curContainer.records[lastStep.index];
      return {bytes:curBytes, field, ancestors:curAncestors};
    }
  }

  function applyLeaf(bytes, container, ancestors, leafName, leafTrio){
    const existing = findField(container.records, leafName);
    if(existing){
      const anc = ancestors.concat([existing.recOff]);
      return AOV.splice(bytes, existing.contentStart, existing.contentEnd, leafTrio, anc, null).bytes;
    } else {
      const newRecord = AOV.buildRecord(leafName, leafTrio);
      const insertPos = container.records.length ? container.records[container.records.length-1].contentEnd : container.outerLenPos+8;
      const countBump = {pos: container.outerLenPos+4, delta:1};
      return AOV.splice(bytes, insertPos, insertPos, newRecord, ancestors, countBump).bytes;
    }
  }

  function applyLeafMaybeEmpty(bytes, parentField, ancestorsToField, leafName, leafTrio){
    const inner = AOV.getContainerRecords(bytes, parentField.contentStart, parentField.contentEnd);
    if(inner){
      const ancestors = ancestorsToField.concat([inner.outerLenPos]);
      return applyLeaf(bytes, inner, ancestors, leafName, leafTrio);
    }
    if(isEmptyComSentinel(bytes, parentField.contentStart, parentField.contentEnd)){
      const newRecord = AOV.buildRecord(leafName, leafTrio);
      const outerLen = 8 + newRecord.length;
      const head = new Uint8Array(8);
      AOV.wu32(head,0,outerLen); AOV.wu32(head,4,1);
      const replacement = AOV.concatBytes(head, newRecord);
      const sentinelStart = parentField.contentEnd - 8;
      return AOV.splice(bytes, sentinelStart, parentField.contentEnd, replacement, ancestorsToField, null).bytes;
    }
    throw new Error('Không nhận diện được container tại field "'+parentField.name+'"');
  }

  function transplantField(bytes, parentPath, leafName, leafTrio, templates){
    if(parentPath.length===0){
      const root = AOV.getRootContainer(bytes);
      const ancestors = [0, root.outerLenPos];
      return applyLeaf(bytes, root, ancestors, leafName, leafTrio);
    }
    const {bytes:b2, field, ancestors} = resolveToField(bytes, parentPath, templates||{});
    const anc2 = ancestors.concat([field.recOff]);
    return applyLeafMaybeEmpty(b2, field, anc2, leafName, leafTrio);
  }

  function extractSkinId(bytes, field){
    const text = AOV.bytesToStr(bytes.slice(field.contentStart, field.contentEnd));
    const m = text.match(/(\d+)_([A-Za-z0-9]+)_LOD\d/);
    return m ? {id:m[1], label:m[1]+'_'+m[2]} : null;
  }

  function getSkinElements(bytes){
    let root;
    try{ root = AOV.getRootContainer(bytes); }catch(e){ return []; }
    if(!root) return [];
    const skinField = root.records.find(r=>r.name.startsWith('SkinPrefab'));
    if(!skinField) return [];
    const inner = AOV.getContainerRecords(bytes, skinField.contentStart, skinField.contentEnd);
    if(!inner) return [];
    const out = [];
    inner.records.forEach((el, idx)=>{
      const elInner = AOV.getContainerRecords(bytes, el.contentStart, el.contentEnd);
      if(!elInner) return;
      const f = elInner.records.find(r=>r.name.startsWith('ArtSkinPrefabLOD0'));
      const idInfo = f ? extractSkinId(bytes, f) : null;
      out.push({index:idx, id: idInfo?idInfo.id:null, label: idInfo?idInfo.label:('Skin #'+idx), fieldCount: elInner.records.length, fields: elInner.records});
    });
    return out;
  }

  function getCompanionScaleTrio(bytes){
    let root;
    try{ root = AOV.getRootContainer(bytes); }catch(e){ return null; }
    if(!root) return null;
    const trans = root.records.find(r=>r.name==='TransConfigsK');
    if(!trans) return null;
    const inner = AOV.getContainerRecords(bytes, trans.contentStart, trans.contentEnd);
    if(!inner || inner.records.length<2) return null;
    const el1 = inner.records[1];
    const el1Inner = AOV.getContainerRecords(bytes, el1.contentStart, el1.contentEnd);
    if(!el1Inner) return null;
    const scale = el1Inner.records.find(r=>r.name.startsWith('Scale'));
    if(!scale) return null;
    return bytes.slice(scale.contentStart, scale.contentEnd);
  }

  function applySkinToTarget(targetBytes, sourceBytes, skinChoice){
    let bytes = targetBytes;
    const ops = [];

    let fieldsToApply = [];
    if(skinChoice.type==='skin'){
      const skins = getSkinElements(sourceBytes);
      const chosen = skins.find(s=>s.index===skinChoice.index);
      if(!chosen) throw new Error('Không tìm thấy skin đã chọn trong file nguồn');
      fieldsToApply = chosen.fields.map(f=>({rawName:f.name, targetName: targetNameFor(f.name), trio: sourceBytes.slice(f.contentStart, f.contentEnd)}));
    } else {
      const root = AOV.getRootContainer(sourceBytes);
      fieldsToApply = root.records
        .filter(r=> !r.name.startsWith('SkinPrefab') && !r.name.startsWith('ActorName'))
        .map(f=>({rawName:f.name, targetName: f.name, trio: sourceBytes.slice(f.contentStart, f.contentEnd)}));
    }

    for(const op of fieldsToApply){
      const root = AOV.getRootContainer(bytes);
      const existed = !!findField(root.records, op.targetName);
      bytes = transplantField(bytes, [], op.targetName, op.trio, {});
      ops.push({action: existed?'overwrite':'insert', name: op.targetName});
    }

    // companion Scale: chỉ khi chọn 1 skin cụ thể (nhánh "default" đã bulk-copy nguyên TransConfigsK rồi, tránh trùng)
    const scaleTrio = skinChoice.type==='skin' ? getCompanionScaleTrio(sourceBytes) : null;
    if(scaleTrio){
      try{
        const parentPath = [{type:'field', name:'TransConfigsK'}, {type:'index', index:1}];
        const root0 = AOV.getRootContainer(bytes);
        const trans0 = root0.records.find(r=>r.name==='TransConfigsK');
        let existed = false;
        if(trans0){
          const inner0 = AOV.getContainerRecords(bytes, trans0.contentStart, trans0.contentEnd);
          if(inner0 && inner0.records.length>1){
            const el1inner0 = AOV.getContainerRecords(bytes, inner0.records[1].contentStart, inner0.records[1].contentEnd);
            existed = !!(el1inner0 && el1inner0.records.find(r=>r.name==='Scale'));
          }
        }
        bytes = transplantField(bytes, parentPath, 'Scale', scaleTrio, {});
        ops.push({action: existed?'overwrite':'insert', name:'Scale (TransConfigsK/Element[1])'});
      }catch(err){
        ops.push({action:'skip', name:'Scale (TransConfigsK/Element[1]) — '+err.message});
      }
    }

    return {bytes, ops};
  }

  return {findField, targetNameFor, transplantField, getSkinElements, getCompanionScaleTrio, applySkinToTarget, RENAME_MAP, KEEP_SKIN_EXCEPTIONS};
})();


