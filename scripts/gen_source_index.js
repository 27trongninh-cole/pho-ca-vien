'use strict';
// gen_source_index.js — sinh index/<TenPkg>.json cho 1 file nguồn (Actor_XXX_Infos_pkg.bytes).
// Chạy: node scripts/gen_source_index.js Actor_105_Infos_pkg.bytes
// (tên file, không cần đường dẫn đầy đủ — script tự tìm trong site/pkg/)
const fs = require('fs');
const path = require('path');
const P = require('./node_pkgio.js');

const fileName = process.argv[2];
if(!fileName){
  console.error('Cách dùng: node scripts/gen_source_index.js <TenFile.pkg.bytes>');
  process.exit(1);
}

const PKG_PATH = path.join(P.SITE_DIR, 'pkg', fileName);
const DICT_PATH = path.join(P.SITE_DIR, 'pkg/zstd_dict.bin');
const baseName = fileName.replace(/\.bytes$/i, ''); // vd "Actor_105_Infos_pkg"
const OUT_PATH = path.join(P.SITE_DIR, 'index', baseName + '.json');

// Nhận diện "entry chính": tên dạng ID_TenTuong_actorinfo.bytes (không hoa/thường bắt buộc),
// nếu 1 thư mục có NHIỀU entry cùng ID (vd biến thể XinShou/phụ), chọn entry có TÊN NGẮN NHẤT
// (biến thể phụ luôn có hậu tố dài hơn, vd "105_lianpo" ngắn hơn "105_lianpoXinShou").
const MAIN_ENTRY_RE = /^(\d+)_([A-Za-z0-9]+)_actorinfo\.bytes$/i;

function pickMainEntries(allEntries){
  // group theo thư mục cha (basename folder), trong mỗi group chọn entry khớp regex có tên ngắn nhất
  const byFolder = new Map();
  for(const entryPath of allEntries){
    const base = path.basename(entryPath);
    const m = base.match(MAIN_ENTRY_RE);
    if(!m) continue;
    const folder = path.dirname(entryPath);
    const cur = byFolder.get(folder);
    if(!cur || base.length < cur.base.length){
      byFolder.set(folder, {entryPath, base, id:m[1], name:m[2]});
    }
  }
  return Array.from(byFolder.values());
}

(async () => {
  console.log('Đang mở', PKG_PATH, '...');
  const allEntries = await P.listEntries(PKG_PATH);
  console.log('Tổng số entry trong pkg:', allEntries.length);

  const mains = pickMainEntries(allEntries);
  if(mains.length === 0){
    console.error('LỖI: không tìm thấy entry chính nào khớp pattern ID_Ten_actorinfo.bytes');
    process.exit(1);
  }
  if(mains.length > 1){
    console.warn('CẢNH BÁO: pkg này có', mains.length, 'entry chính (nhiều tướng trong 1 pkg?) — sẽ chỉ lấy entry ĐẦU TIÊN theo quy ước "1 pkg nguồn = 1 tướng".');
  }
  const main = mains[0];
  console.log('Entry chính:', main.entryPath, '(id='+main.id+', name='+main.name+')');

  const plainBuf = await P.readEntryPlain(PKG_PATH, main.entryPath, DICT_PATH);
  console.log('Giải mã xong, kích thước:', plainBuf.length, 'byte');

  const bytes = new Uint8Array(plainBuf.buffer, plainBuf.byteOffset, plainBuf.length);
  P.AOV.parseTopLevel(bytes); // validate định dạng, ném lỗi nếu hỏng

  const skinsRaw = P.Transplant.getSkinElements(bytes);
  const skins = [{type:'default', label:'Mặc định'}]
    .concat(skinsRaw.map(s => ({index:s.index, id:s.id, label: s.id ? (s.id+'_'+main.name) : ('Skin #'+s.index)})));

  console.log('Tìm thấy', skinsRaw.length, 'skin (+ 1 mục Mặc định).');

  const indexData = {
    pkgFile: 'pkg/' + fileName,
    entryPath: main.entryPath,
    label: main.name,
    role: null, // TODO: điền thủ công 1 trong 6 giá trị: "Đấu sĩ","Đỡ đòn","Pháp sư","Sát thủ","Trợ thủ","Xạ thủ"
    skins,
  };

  fs.mkdirSync(path.dirname(OUT_PATH), {recursive:true});
  fs.writeFileSync(OUT_PATH, JSON.stringify(indexData, null, 2));
  console.log('Đã ghi', OUT_PATH);
  console.log('⚠ Nhớ điền field "role" thủ công trong file vừa sinh (đang để null).');
})().catch(err => { console.error('LỖI:', err); process.exit(1); });
