const $=h=>{const d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild};
const toast=m=>{const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1500)};
const cv=(w,h,c='')=>{const e=document.createElement('canvas');e.width=w;e.height=h;e.className=c;return e};
PVC.load().then(init).catch(s=>document.getElementById('app').textContent='Thiếu asset: '+s);
function init(){
 const G={cur:PVC.newSkewer(),slots:[null,null,null,null],done:[],sel:0,heat:'mid',order:null,over:false,oid:0};
 const app=document.getElementById('app'),$i=id=>document.getElementById(id);
 app.innerHTML=`<div class=card><div class=hd><b id=oid></b><span id=status></span><button id=nw>Đơn mới</button></div>
 <div class=row style="margin:6px 0 0"><div class=need id=need></div><button id=give>GIAO</button></div><div id=dn></div></div>
 <div class=row><div class=counter><div class=trays id=trays></div><div class=ctl><div id=cnt></div><div class=b><button id=undo>↶ Lùi</button><button id=clr>Hủy</button></div><div style="font-weight:400;font-size:11px">Đủ 4 viên: chạm xiên (bên phải) hoặc kéo vào chảo.</div></div></div>
 <div class=side id=side></div></div>
 <div class=row><div class=stove id=stove></div><div class=heat id=heat></div></div>`;
 PVC.FOODS.forEach(f=>{const b=$(`<button class=tray><img class=t src="assets/prep/ingredient_tray_empty.png"><img class=f src="${f.src}"><span>${f.name}</span></button>`);
  b.onclick=()=>{if(PVC.complete(G.cur))return toast('Xiên đã đủ 4 viên');G.cur.items.push(f.id);ui()};$i('trays').append(b)});
 $i('undo').onclick=()=>{G.cur.items.pop();ui()};
 $i('clr').onclick=()=>{G.cur=PVC.newSkewer();ui()};
 const side=$i('side');for(let i=0;i<4;i++)side.append($(`<div class=ph style="top:${PVC.SKEWER.ys[i]*2}px"></div>`));
 const prepCv=cv(32,136);prepCv.style.cssText='width:64px;height:272px';side.append(prepCv);
 // bếp: gas -> pan -> xiên -> rim -> cán đè lên rim -> bong bóng
 const st=$i('stove'),im=n=>{const i=new Image();i.src='assets/'+n+'.png';return i};
 st.append(im('cooking/stove/gas_stove'),im('cooking/pan/pan_base'));
 const under=[],over=[],zones=[],bars=[];
 PVC.SLOTS.forEach(([x,y])=>{const c=cv(32,136,'sk');c.style.cssText=`left:${x}px;top:${y}px`;under.push(c);st.append(c)});
 st.append(im('cooking/pan/pan_front_rim'));
 PVC.SLOTS.forEach(([x,y])=>{const c=cv(32,136,'sk');c.style.cssText=`left:${x}px;top:${y}px;clip-path:inset(96px 0 0 0)`;over.push(c);st.append(c)});
 const bub=['oil_bubbles','oil_bubbles_v2','oil_bubbles_v3'].map(n=>{const i=im('cooking/effects/'+n);i.style.visibility='hidden';st.append(i);return i});
 PVC.SLOTS.forEach(([x],i)=>{const b=$(`<div class=bar style="left:${x}px;display:none"><i></i></div>`);bars.push(b);st.append(b);
  const z=$(`<div class=zone style="left:${x-4}px"></div>`);zones.push(z);st.append(z);bindDrag(z,()=>G.slots[i],i)});
 bindDrag(side,()=>G.cur,'prep');
 const hb=$i('heat');hb.append($('<div style="text-align:center;font-weight:700">LỬA</div>'));
 Object.entries(PVC.HEAT).forEach(([k,h])=>{const b=$(`<button>${h.label}</button>`);b.onclick=()=>{G.heat=k;ui()};b.k=k;hb.append(b)});
 const setS=(t,c)=>{$i('status').textContent=t;$i('status').className=c};
 function newOrder(){G.order=Array.from({length:4},()=>PVC.FOODS[Math.random()*10|0].id).sort();G.over=false;G.oid++;setS('Chờ giao','');ui()}
 $i('nw').onclick=()=>{G.cur=PVC.newSkewer();G.slots=[null,null,null,null];G.done=[];G.sel=0;newOrder()};
 $i('give').onclick=()=>{
  const d=G.done[G.sel]||G.done[0];if(G.over)return;if(!d)return toast('Chưa có xiên thành phẩm');
  const burnt=PVC.state(d)=='burnt',ok=[...d.items].sort().join()==G.order.join();
  G.done.splice(G.done.indexOf(d),1);G.sel=0;
  if(burnt){setS('Món cháy! Khách chê 😡','bad');toast('Giao món cháy!')}
  else if(!ok){setS('Giao sai món ❌','bad');toast('Sai đơn hàng!')}
  else{setS('Giao thành công! ✔','ok');toast('Khách hài lòng!');G.over=true}
  ui()};
 const name=id=>PVC.FOODS.find(f=>f.id==id).name;
 function ui(){
  $i('oid').textContent='Đơn #'+G.oid;
  const nd=$i('need');nd.innerHTML='';G.order.forEach(id=>nd.append($(`<div><img src="assets/food/${id}.png" width=32 height=32>${name(id)}</div>`)));
  $i('give').disabled=G.over;$i('cnt').textContent=`Đang xỏ: ${G.cur.items.length}/4`;
  PVC.draw(prepCv,G.cur);
  [...hb.children].forEach(b=>b.k&&b.classList.toggle('on',b.k==G.heat));
  const dn=$i('dn');dn.innerHTML='<div style="font-size:11px;margin-top:4px">Thành phẩm (chạm để chọn, tối đa 2):</div>';
  G.done.forEach((d,i)=>{const r=$(`<div class="done ${i==G.sel?'sel':''}"></div>`),c=cv(128,32);PVC.draw(c,d,'h');r.append(c);
   const x=$('<button>✕</button>');x.onclick=e=>{e.stopPropagation();G.done.splice(i,1);G.sel=0;ui()};r.append(x);r.onclick=()=>{G.sel=i;ui()};dn.append(r)});
 }
 const ghost=cv(32,136);ghost.id='ghost';ghost.style.display='none';document.body.append(ghost);
 const slotAt=(x,y)=>{const r=st.getBoundingClientRect();if(x<r.left-10||x>r.right+10||y<r.top-30||y>r.bottom+10)return -1;
  return Math.max(0,Math.min(3,Math.round((x-r.left-PVC.SLOTS[0][0]-16)/40)))};
 function bindDrag(el,get,src){
  el.addEventListener('pointerdown',e=>{const s=get();if(!s)return;e.preventDefault();el.setPointerCapture(e.pointerId);
   const d={x:e.clientX,y:e.clientY,drag:false};
   const mv=e=>{if(!d.drag&&Math.hypot(e.clientX-d.x,e.clientY-d.y)>8&&!(src=='prep'&&!PVC.complete(s))){d.drag=true;PVC.draw(ghost,s);ghost.style.display='block'}
    if(d.drag){ghost.style.left=e.clientX-16+'px';ghost.style.top=e.clientY-100+'px';
     const h=slotAt(e.clientX,e.clientY);zones.forEach((z,i)=>z.classList.toggle('hov',i==h));
     if(e.clientY>innerHeight-70)scrollBy(0,12);else if(e.clientY<70)scrollBy(0,-12)}};
   const up=e=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);
    ghost.style.display='none';zones.forEach(z=>z.classList.remove('hov'));
    if(d.drag&&e.type=='pointerup'){const t=slotAt(e.clientX,e.clientY);
     if(t<0)toast('Thả vào một ô trên chảo');
     else if(src=='prep'){if(G.slots[t])toast('Ô này đã có xiên');else{G.slots[t]=G.cur;G.cur=PVC.newSkewer()}}
     else if(t!=src)PVC.fry.move(G.slots,src,t)}
    else if(!d.drag&&e.type=='pointerup')tap(src,s);ui()};
   el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)})}
 function tap(src,s){
  if(src=='prep'){if(!PVC.complete(s))return toast(`Cần đủ 4 viên (${s.items.length}/4)`);
   const i=PVC.fry.first(G.slots);if(i<0)return toast('Chảo đầy! Lấy bớt xiên ra');G.slots[i]=G.cur;G.cur=PVC.newSkewer();return}
  const stt=PVC.state(s);
  if(stt=='frying')return toast('Chưa chín! Đợi thêm chút');
  if(G.done.length>=2)return toast('Khay thành phẩm đầy (tối đa 2)');
  G.done.push(s);G.slots[src]=null;toast(stt=='burnt'?'Xiên cháy rồi!':'Đã lấy xiên chín');
 }
 let last=performance.now(),acc=0,fr=0;const prev=[];
 (function loop(t){const dt=Math.min(.1,(t-last)/1000);last=t;
  PVC.tick(G.slots,G.heat,dt);
  acc+=dt*1000;const iv=PVC.HEAT[G.heat].bub;if(acc>=iv){acc%=iv;fr=(fr+1)%3}
  bub.forEach((b,i)=>b.style.visibility=i==fr?'visible':'hidden');
  G.slots.forEach((s,i)=>{const b=bars[i],z=zones[i];
   under[i].style.display=over[i].style.display=b.style.display=s?'block':'none';
   z.classList.remove('cooked','burnt');
   if(!s){prev[i]=null;return}
   const stt=PVC.state(s);PVC.draw(under[i],s);PVC.draw(over[i],s);
   b.className='bar '+stt;b.firstChild.style.width=(s.p*60+s.o*40)+'%';
   if(stt!='frying')z.classList.add(stt);
   if(prev[i]&&prev[i]!=stt)toast(stt=='cooked'?`Xiên ô ${i+1} đã chín!`:`Xiên ô ${i+1} bị cháy!`);prev[i]=stt});
  requestAnimationFrame(loop)})(last);
 newOrder();
}
