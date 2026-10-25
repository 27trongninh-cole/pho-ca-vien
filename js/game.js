// Logic xiên + chiên + vẽ
PVC.imgs={};
PVC.load=()=>Promise.all([...PVC.IMG.map(n=>'assets/'+n+'.png'),...PVC.FOODS.map(f=>f.src)].map(s=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(PVC.imgs[s]=i);i.onerror=()=>no(s);i.src=s})));
PVC.newSkewer=()=>({items:[],p:0,o:0}); // p: sống->chín (0..1), o: chín->cháy (0..1)
PVC.complete=s=>s.items.length>=PVC.SKEWER.max;
PVC.state=s=>s.o>=1?'burnt':s.p>=1?'cooked':'frying';
PVC.tick=(slots,dt)=>{const h=PVC.FRY;slots.forEach(s=>{if(!s)return;if(s.p<1)s.p=Math.min(1,s.p+dt/h.cook);else s.o=Math.min(1,s.o+dt/h.burn)})};
PVC.fry={move(slots,a,b){[slots[a],slots[b]]=[slots[b],slots[a]]},first:slots=>slots.findIndex(x=>!x)};
const tmp=document.createElement('canvas');tmp.width=128;tmp.height=136;
// 'v': ghép tọa độ pixel trên xiên 32x136; 'h': dải ngang cho khu thành phẩm. Không scale sprite.
PVC.draw=(cv,s,mode='v')=>{
 const c=cv.getContext('2d'),t=tmp.getContext('2d');c.imageSmoothingEnabled=t.imageSmoothingEnabled=false;
 c.clearRect(0,0,cv.width,cv.height);t.globalCompositeOperation='source-over';t.clearRect(0,0,128,136);
 if(mode=='v')c.drawImage(PVC.imgs['assets/skewer/skewer_empty.png'],0,0);
 s.items.forEach((id,i)=>t.drawImage(PVC.imgs[PVC.FOODS.find(f=>f.id==id).src],mode=='v'?0:i*32,mode=='v'?PVC.SKEWER.ys[i]:0));
 t.globalCompositeOperation='source-atop';
 if(s.o>0){t.fillStyle='rgba(255,170,40,.3)';t.fillRect(0,0,128,136);t.fillStyle=`rgba(25,12,6,${.7*s.o})`;t.fillRect(0,0,128,136)}
 else if(s.p>0){t.fillStyle=`rgba(255,170,40,${.3*s.p})`;t.fillRect(0,0,128,136)}
 c.drawImage(tmp,0,0);
};

// Công thức (GIẢ LẬP): định danh = tập nguyên liệu đã sắp xếp; tên sinh tự động. Khi Gameplay chốt hệ công thức sẽ thay.
PVC.fname=id=>PVC.FOODS.find(f=>f.id==id).name;
PVC.recipe=items=>{const k=[...items].sort(),u=[...new Set(k)];return{id:k.join(),name:'Xiên '+u.slice(0,2).map(PVC.fname).join(' · ')+(u.length>2?'…':''),items:k}};
PVC.NPC=['Cô Hoa','Chú Tư','Bé Mít','Anh Long','Bà Sáu','Chị Lan','Cậu Bin','Dì Năm']; // GIẢ LẬP: tên mẫu, chưa phải hệ NPC thật
PVC.randOrder=n=>({num:n,customerId:'npc-'+n,customerName:PVC.NPC[(n-1)%PVC.NPC.length],r:PVC.recipe(Array.from({length:4},()=>PVC.FOODS[Math.random()*10|0].id)),qty:1+(Math.random()*PVC.TEST.qtyMax|0)});
// Đối chiếu khay -> đơn chính theo thứ tự FIFO (chỉ để hiển thị đủ/thiếu); chỉ xiên chín (không cháy) được tính
PVC.alloc=(tray,main)=>{const av={};tray.forEach(s=>{if(PVC.state(s)=='cooked'){const k=PVC.recipe(s.items).id;av[k]=(av[k]||0)+1}});return main.map(o=>{const g=Math.min(o.qty,av[o.r.id]||0);av[o.r.id]=(av[o.r.id]||0)-g;return g})};
PVC.take=(tray,o)=>{let n=o.qty;for(let i=0;i<tray.length&&n;)if(PVC.state(tray[i])=='cooked'&&PVC.recipe(tray[i].items).id==o.r.id){tray.splice(i,1);n--}else i++};
