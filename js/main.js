const $=h=>{const d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild};
const toast=m=>{const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1500)};
const cv=(w,h,c='')=>{const e=document.createElement('canvas');e.width=w;e.height=h;e.className=c;return e};
PVC.load().then(init).catch(s=>document.getElementById('app').textContent='Thiếu asset: '+s);
function init(){
 const G={cur:PVC.newSkewer(),slots:[null,null,null,null],tray:[],main:[],wait:[],seq:0,qopen:false,};
 const app=document.getElementById('app'),$i=id=>document.getElementById(id);
 app.innerHTML=`<div class=orders id=orders></div>
 <div class=qbar><button id=qt class="btn sec"></button><button id=qa class="btn sec">+ Khách</button><button id=rs class="btn sec" aria-label="Chơi lại">↻</button></div>
 <div class=mid><div class=stwrap><div class=stove id=stove></div><div id=strip></div></div><div id=tray class=sl></div></div>
 <div class=row><div class=counter id=counter></div></div><div id=md hidden><div class=card id=mc></div></div>`;
 const ct=$i('counter'),P=PVC.PREP;
 PVC.FOODS.forEach((f,i)=>{const b=$(`<button class=tray aria-label="${f.name}" style="left:${P.trayX[i%5]}px;top:${P.trayY[i/5|0]}px"><img src="assets/prep/ingredient_tray_empty.png"><img class=f src="${f.src}"></button>`);
  b.onclick=()=>{if(PVC.complete(G.cur))return toast('Xiên đã đủ 4 viên');G.cur.items.push(f.id);ui()};ct.append(b)});
 const prepCv=cv(32,136);prepCv.id='cs';ct.append(prepCv);
 const nx=$('<div id=nx></div>');ct.append(nx);
 const sz=$('<div id=sz></div>');ct.append(sz);
 ct.append($('<div class=ctl style="left:16px;top:150px;width:76px;text-align:center"><button id=clr class="btn sec trash" aria-label="Bỏ xiên"><img src="assets/ui/icon_trash.png" width=32 height=32></button><div>Bỏ xiên</div></div>'),$('<div class=ctl style="left:160px;top:132px;width:84px;text-align:center"><div id=cnt></div></div>'));
 $i('clr').onclick=()=>{G.cur=PVC.newSkewer();ui()};
 const st=$i('stove'),im=n=>{const i=new Image();i.src='assets/'+n+'.png';return i};
 st.append(im('cooking/stove/gas_stove'),im('cooking/pan/pan_base'));
 const under=[],over=[],zones=[],bars=[],fills=[];
 PVC.SLOTS.forEach(([x,y])=>{const c=cv(32,136,'sk');c.style.cssText=`left:${x}px;top:${y}px`;under.push(c);st.append(c)});
 st.append(im('cooking/pan/pan_front_rim'));
 PVC.SLOTS.forEach(([x,y])=>{const c=cv(32,136,'sk');c.style.cssText=`left:${x}px;top:${y}px;clip-path:inset(96px 0 0 0)`;over.push(c);st.append(c)});
 const bub=['oil_bubbles','oil_bubbles_v2','oil_bubbles_v3'].map(n=>{const i=im('cooking/effects/'+n);i.style.visibility='hidden';st.append(i);return i});
 PVC.SLOTS.forEach(([x],i)=>{const b=$(`<div class=pbar style="left:${x-2}px;display:none"><div class=pt></div><div class=pf></div><u></u></div>`);bars.push(b);fills.push(b.querySelector('.pf'));$i('strip').append(b);
  const z=$(`<div class=zone style="left:${x-4}px"></div>`);zones.push(z);st.append(z);bindDrag(z,()=>G.slots[i],i)});
 bindDrag(sz,()=>G.cur,'prep');
 const addCust=()=>{const o=PVC.randOrder(++G.seq);(G.main.length<2?G.main:G.wait).push(o)};
 const reset=()=>{G.cur=PVC.newSkewer();G.slots=[null,null,null,null];G.tray=[];G.main=[];G.wait=[];G.seq=0;G.modal=null;for(let i=0;i<PVC.TEST.queue;i++)addCust();ui()};
 $i('rs').onclick=reset;$i('qa').onclick=()=>{addCust();ui()};$i('qt').onclick=()=>{G.modal={t:'queue'};ui()};
 const give=o=>{const i=G.main.indexOf(o),g=PVC.alloc(G.tray,G.main);
  if(i<0)return;if(i>0)return toast(`Chờ giao xong khách #${G.main[0].num} trước`);
  if(g[0]<o.qty)return toast(`Khay còn thiếu ${o.qty-g[0]} xiên`);
  PVC.take(G.tray,o);G.main.shift();if(G.wait.length)G.main.push(G.wait.shift());G.modal=null;toast(`Giao xong khách #${o.num}`);ui()};
 const icons=r=>r.items.map(id=>`<img src="assets/food/${id}.png" width=32 height=32>`).join('');
 const close=()=>{G.modal=null;ui()};
 function modal(title,els){const m=$i('mc');m.innerHTML='';const h=$(`<div class=mh><b>${title}</b></div>`),x=$('<button class="btn sec">✕</button>');x.onclick=close;h.append(x);
  const b=$('<div class=mb></div>');els.forEach(e=>b.append(e));m.append(h,b);$i('md').hidden=false}
 function renderModal(){const M=G.modal;if(!M){$i('md').hidden=true;return}
  if(M.t=='queue')return modal(`Hàng chờ (${G.wait.length})`,G.wait.length?G.wait.map(o=>$(`<div class=qr><b class=nm>#${o.num} · ${o.customerName}</b><div class=rn>${o.r.name} ×${o.qty}</div><div class=ic>${icons(o.r)}</div></div>`)):[$('<div class=qr>Không có khách chờ</div>')]);
  if(M.t=='order'){const o=M.o,i=G.main.indexOf(o);if(i<0){G.modal=null;return renderModal()}
   const g=PVC.alloc(G.tray,G.main)[i],ok=i==0&&g>=o.qty,btn=$(`<button class="btn pri ${ok?'':'off'}" style="width:100%;margin-top:8px">Giao</button>`);btn.onclick=()=>give(o);
   return modal(`Khách #${o.num}`,[$(`<div class=dt><b>${o.customerName}</b><div>Món: ${o.r.name}</div><div>Số lượng: ×${o.qty}</div><div class=ic>${icons(o.r)}</div><div>Trong khay: ${g}/${o.qty} · ${g>=o.qty?'Đủ':'Thiếu'}</div><div>${i==0?'Đến lượt giao':'Chờ giao xong khách #'+G.main[0].num}</div></div>`),btn])}
  const grp={};G.tray.forEach(s=>{const r=PVC.recipe(s.items),st=PVC.state(s),k=r.id+st;(grp[k]=grp[k]||{r,st,s,list:[]}).list.push(s)});
  modal(`Khay thành phẩm (${G.tray.length})`,G.tray.length?Object.values(grp).map(x=>{const c=cv(128,32);PVC.draw(c,x.s,'h');
   const r=$(`<div class=gr></div>`);r.append(c,$(`<div class=gi><b class=nm>${x.r.name}</b>×${x.list.length} · ${x.st=='cooked'?'Chín':'Cháy'}</div>`));
   if(x.st=='burnt'){const b=$('<button class="btn sec"><img src="assets/ui/icon_trash.png" width=32 height=32></button>');b.onclick=()=>{G.tray=G.tray.filter(s=>!x.list.includes(s));ui()};r.append(b)}return r}):[$('<div class=qr>Khay trống</div>')])}
 function ui(){
  const g=PVC.alloc(G.tray,G.main),od=$i('orders');od.innerHTML='';
  for(let i=0;i<2;i++){const o=G.main[i];if(!o){od.append($('<div class="card oc empty">Chưa có khách</div>'));continue}
   const ok=i==0&&g[i]>=o.qty,c=$(`<div class="card oc"><b class=nm>#${o.num} · ${o.customerName}</b><div class=ic>${icons(o.r)}</div><div class=ft><span class=st><i>${g[i]>=o.qty?'Đủ':'Thiếu'} ${g[i]}/${o.qty}</i><i>${i?'Chờ lượt':'Đến lượt'}</i></span><button class="btn pri gv ${ok?'':'off'}">Giao</button></div></div>`);
   c.querySelector('button').onclick=e=>{e.stopPropagation();give(o)};c.onclick=()=>{G.modal={t:'order',o};ui()};od.append(c)}
  $i('qt').textContent=`Hàng chờ (${G.wait.length})`;
  $i('cnt').textContent=`Đang xỏ: ${G.cur.items.length}/4`;
  PVC.draw(prepCv,G.cur);
  const n=G.cur.items.length;nx.style.display=n<4?'block':'none';nx.style.top=120+PVC.SKEWER.ys[Math.min(n,3)]+'px';sz.classList.toggle('full',n==4);
  const t=$i('tray');t.innerHTML='<div class=tt>KHAY</div><div class=ts></div>';
  G.tray.slice(-6).forEach((s,i)=>{const c=cv(32,136);c.style.cssText=`position:absolute;left:${i*6}px;top:${(i%2)*3}px`;PVC.draw(c,s);t.lastChild.append(c)});
  t.append($(`<div class=tt>×${G.tray.length}</div>`));
  renderModal();
 }
 $i('tray').onclick=()=>{G.modal={t:'tray'};ui()};
 $i('md').onclick=e=>{if(e.target.id=='md')close()};
 const ghost=cv(32,136);ghost.id='ghost';ghost.style.display='none';document.body.append(ghost);
 const slotAt=(x,y)=>{const r=st.getBoundingClientRect();if(x<r.left-10||x>r.right+10||y<r.top-30||y>r.bottom+10)return -1;
  return Math.max(0,Math.min(3,Math.round((x-r.left-PVC.SLOTS[0][0]-16)/40)))};
 const overTray=(x,y)=>{const r=$i('tray').getBoundingClientRect();return x>r.left-8&&x<r.right+8&&y>r.top-8&&y<r.bottom+8};
 function bindDrag(el,get,src){
  el.addEventListener('pointerdown',e=>{const s=get();if(!s)return;e.preventDefault();el.setPointerCapture(e.pointerId);
   const d={x:e.clientX,y:e.clientY,drag:false};
   const mv=e=>{if(!d.drag&&Math.hypot(e.clientX-d.x,e.clientY-d.y)>8&&!(src=='prep'&&!PVC.complete(s))){d.drag=true;PVC.draw(ghost,s);ghost.style.display='block'}
    if(d.drag){ghost.style.left=e.clientX-16+'px';ghost.style.top=e.clientY-100+'px';
     const tr=overTray(e.clientX,e.clientY);$i('tray').classList.toggle('hov',tr&&src!='prep');const h=tr?-1:slotAt(e.clientX,e.clientY);zones.forEach((z,i)=>z.classList.toggle('hov',i==h));
     if(e.clientY>innerHeight-70)scrollBy(0,12);else if(e.clientY<70)scrollBy(0,-12)}};
   const up=e=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);
    ghost.style.display='none';zones.forEach(z=>z.classList.remove('hov'));
    $i('tray').classList.remove('hov');
    if(d.drag&&e.type=='pointerup'){const t=slotAt(e.clientX,e.clientY);
     if(overTray(e.clientX,e.clientY)){if(src=='prep')toast('Xiên chưa chiên');else tap(src,s)}
     else if(t<0)toast('Thả vào một ô trên chảo');
     else if(src=='prep'){if(G.slots[t])toast('Ô này đã có xiên');else{G.slots[t]=G.cur;G.cur=PVC.newSkewer()}}
     else if(t!=src)PVC.fry.move(G.slots,src,t)}
    else if(!d.drag&&e.type=='pointerup')tap(src,s);ui()};
   el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)})}
 function tap(src,s){
  if(src=='prep'){if(!PVC.complete(s))return toast(`Cần đủ 4 viên (${s.items.length}/4)`);
   const i=PVC.fry.first(G.slots);if(i<0)return toast('Chảo đầy! Lấy bớt xiên ra');G.slots[i]=G.cur;G.cur=PVC.newSkewer();return}
  const stt=PVC.state(s);
  if(stt=='frying')return toast('Chưa chín! Đợi thêm chút');
  G.tray.push(s);G.slots[src]=null;
 }
 let last=performance.now(),acc=0,fr=0;const prev=[];
 (function loop(t){const dt=Math.min(.1,(t-last)/1000);last=t;
  PVC.tick(G.slots,dt);
  acc+=dt*1000;const iv=PVC.FRY.bub;if(acc>=iv){acc%=iv;fr=(fr+1)%3}
  bub.forEach((b,i)=>b.style.visibility=i==fr?'visible':'hidden');
  G.slots.forEach((s,i)=>{const b=bars[i],z=zones[i];
   under[i].style.display=over[i].style.display=b.style.display=s?'block':'none';
   z.classList.remove('cooked','burnt');
   if(!s){prev[i]=null;return}
   const stt=PVC.state(s);PVC.draw(under[i],s);PVC.draw(over[i],s);
   b.className='pbar '+stt;fills[i].style.clipPath=`inset(0 ${36-(2+32*(s.p*.6+s.o*.4))}px 0 0)`;
   if(stt!='frying')z.classList.add(stt);
   prev[i]=stt});
  requestAnimationFrame(loop)})(last);
 reset();
}
