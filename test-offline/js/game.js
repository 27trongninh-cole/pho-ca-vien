// Logic xiên + chiên + vẽ
PVC.imgs={};
PVC.load=()=>Promise.all([...PVC.IMG.map(n=>'assets/'+n+'.png'),...PVC.FOODS.map(f=>f.src)].map(s=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(PVC.imgs[s]=i);i.onerror=()=>no(s);i.src=s})));
PVC.newSkewer=()=>({items:[],p:0,o:0}); // p: sống->chín (0..1), o: chín->cháy (0..1)
PVC.complete=s=>s.items.length>=PVC.SKEWER.max;
PVC.state=s=>s.o>=1?'burnt':s.p>=1?'cooked':'frying';
PVC.tick=(slots,heat,dt)=>{const h=PVC.HEAT[heat];slots.forEach(s=>{if(!s)return;if(s.p<1)s.p=Math.min(1,s.p+dt/h.cook);else s.o=Math.min(1,s.o+dt/h.burn)})};
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
