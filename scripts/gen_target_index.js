'use strict';
// gen_target_index.js — sinh index/Prefab_Soldier.pkg.json (14 file đích, 8 thư mục, đã chốt).
// Chạy: node scripts/gen_target_index.js
const fs = require('fs');
const path = require('path');
const P = require('./node_pkgio.js');

const PKG_PATH = path.join(P.SITE_DIR, 'pkg/Prefab_Soldier.pkg.bytes');
const OUT_PATH = path.join(P.SITE_DIR, 'index/Prefab_Soldier.pkg.json');

// Danh sách 14 file đích đã chốt (xem thảo luận trước) — 8 thư mục, bỏ New_SoldierDuke và New_Truck_3v3_Red.
const TARGETS = [
  {team:'blue', folder:'New_MeleeSoldier',          entryPath:'Prefab_Soldier/New_MeleeSoldier/New_MeleeSoldier_ActorInfo.bytes',                     label:'Melee Soldier'},
  {team:'red',  folder:'New_MeleeSoldier',          entryPath:'Prefab_Soldier/New_MeleeSoldier/New_MeleeSoldier_Red_ActorInfo.bytes',                 label:'Melee Soldier (Đỏ)'},
  {team:'blue', folder:'New_MeleeSoldier_Gold',     entryPath:'Prefab_Soldier/New_MeleeSoldier_Gold/New_MeleeSoldier_Gold_ActorInfo.bytes',           label:'Melee Soldier Gold'},
  {team:'red',  folder:'New_MeleeSoldier_Gold',     entryPath:'Prefab_Soldier/New_MeleeSoldier_Gold/New_MeleeSoldier_Gold_Red_ActorInfo.bytes',       label:'Melee Soldier Gold (Đỏ)'},
  {team:'blue', folder:'New_RangeSoldier',          entryPath:'Prefab_Soldier/New_RangeSoldier/New_RangeSoldier_ActorInfo.bytes',                     label:'Range Soldier'},
  {team:'red',  folder:'New_RangeSoldier',          entryPath:'Prefab_Soldier/New_RangeSoldier/New_RangeSoldier_Red_ActorInfo.bytes',                 label:'Range Soldier (Đỏ)'},
  {team:'blue', folder:'New_GoldRangeSoldier',      entryPath:'Prefab_Soldier/New_GoldRangeSoldier/New_GoldRangeSoldier_ActorInfo.bytes',              label:'Gold Range Soldier'},
  {team:'red',  folder:'New_GoldRangeSoldier_Red',  entryPath:'Prefab_Soldier/New_GoldRangeSoldier_Red/New_GoldRangeSoldier_Red_ActorInfo.bytes',      label:'Gold Range Soldier (Đỏ)'},
  {team:'blue', folder:'New_SuperSoldier',          entryPath:'Prefab_Soldier/New_SuperSoldier/New_SuperSoldier_ActorInfo.bytes',                     label:'Super Soldier'},
  {team:'red',  folder:'New_SuperSoldier',          entryPath:'Prefab_Soldier/New_SuperSoldier/New_SuperSoldier_Red_ActorInfo.bytes',                 label:'Super Soldier (Đỏ)'},
  {team:'blue', folder:'New_Enhanced_SuperSoldier', entryPath:'Prefab_Soldier/New_Enhanced_SuperSoldier/New_Enhanced_SuperSoldier_ActorInfo.bytes',    label:'Enhanced Super Soldier'},
  {team:'red',  folder:'New_Enhanced_SuperSoldier', entryPath:'Prefab_Soldier/New_Enhanced_SuperSoldier/New_Enhanced_SuperSoldier_Red_ActorInfo.bytes',label:'Enhanced Super Soldier (Đỏ)'},
  {team:'blue', folder:'New_Truck',                 entryPath:'Prefab_Soldier/New_Truck/New_Truck_ActorInfo.bytes',                                   label:'Truck'},
  {team:'red',  folder:'New_Truck',                 entryPath:'Prefab_Soldier/New_Truck/New_Truck_Red_ActorInfo.bytes',                               label:'Truck (Đỏ)'},
];

(async () => {
  console.log('Đang mở', PKG_PATH, '...');
  const allEntries = new Set(await P.listEntries(PKG_PATH));
  console.log('Tổng số entry trong pkg:', allEntries.size);

  const missing = TARGETS.filter(t => !allEntries.has(t.entryPath));
  if(missing.length){
    console.error('LỖI: các entryPath sau KHÔNG tồn tại trong pkg thật:');
    missing.forEach(m => console.error('  -', m.entryPath));
    process.exit(1);
  }
  console.log('Đã xác nhận đủ', TARGETS.length, 'entry đích tồn tại trong pkg.');

  const blueCount = TARGETS.filter(t=>t.team==='blue').length;
  const redCount = TARGETS.filter(t=>t.team==='red').length;
  console.log('Phe Xanh:', blueCount, '| Phe Đỏ:', redCount);
  if(blueCount !== 7 || redCount !== 7){
    console.warn('CẢNH BÁO: số lượng mỗi phe không phải 7/7 như đã chốt, kiểm tra lại danh sách TARGETS.');
  }

  const indexData = {
    pkgFile: 'pkg/Prefab_Soldier.pkg.bytes',
    dictFile: 'pkg/zstd_dict.bin',
    targets: TARGETS,
  };

  fs.mkdirSync(path.dirname(OUT_PATH), {recursive:true});
  fs.writeFileSync(OUT_PATH, JSON.stringify(indexData, null, 2));
  console.log('Đã ghi', OUT_PATH);
})().catch(err => { console.error('LỖI:', err); process.exit(1); });
