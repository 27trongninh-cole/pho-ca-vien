'use strict';
// gen_sources_manifest.js — quét site/index/*.json (trừ Prefab_Soldier.pkg.json và sources.json),
// sinh lại index/sources.json — manifest để frontend biết có bao nhiêu nguồn mà KHÔNG cần fetch tất cả.
// Chạy: node scripts/gen_sources_manifest.js
const fs = require('fs');
const path = require('path');
const P = require('./node_pkgio.js');

const INDEX_DIR = path.join(P.SITE_DIR, 'index');
const OUT_PATH = path.join(INDEX_DIR, 'sources.json');
const EXCLUDE = new Set(['Prefab_Soldier.pkg.json', 'sources.json']);

const files = fs.readdirSync(INDEX_DIR)
  .filter(f => f.endsWith('.json') && !EXCLUDE.has(f))
  .sort();

const sources = [];
const warnings = [];
for(const f of files){
  const baseName = f.replace(/\.json$/, '');
  const full = path.join(INDEX_DIR, f);
  try{
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));
    if(!data.role){
      warnings.push(baseName + ' — thiếu "role" (sẽ hiện "Chưa phân loại" trên web)');
    }
    sources.push(baseName);
  }catch(err){
    warnings.push(baseName + ' — LỖI đọc/parse: ' + err.message + ' (BỎ QUA, không đưa vào manifest)');
  }
}

fs.writeFileSync(OUT_PATH, JSON.stringify({sources}, null, 2));
console.log('Đã ghi', OUT_PATH, '— tổng', sources.length, 'nguồn.');
if(warnings.length){
  console.log('\nCảnh báo:');
  warnings.forEach(w => console.log('  - ' + w));
}
