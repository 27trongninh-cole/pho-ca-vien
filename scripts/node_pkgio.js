'use strict';
// node_pkgio.js — helper CHỈ dùng cho script Node (sinh index, kiểm tra dữ liệu...).
// Tái sử dụng ĐÚNG cùng 1 file zstd-codec.bundle.js và jszip.min.js mà frontend dùng,
// để đảm bảo hành vi giải nén/nén giống hệt giữa lúc build index và lúc chạy trên web.
const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..', 'docs');

// Mock tối thiểu để 2 bundle browser chạy được trong Node (không có DOM thật)
global.window = global;
global.document = { currentScript: { src: '' } };
const JSZipLib = require(path.join(SITE_DIR, 'assets/js/jszip.min.js'));
global.JSZip = JSZipLib;
require(path.join(SITE_DIR, 'assets/js/zstd-codec.bundle.js'));
const ZstdCodecLib = global.ZstdCodec;

// Load engine.js (AOV + Transplant) — không dùng require vì file viết dạng "const AOV = (()=>{...})()"
// không có module.exports; eval trong 1 Function riêng rồi lấy ra 2 biến cần dùng.
const engineCode = fs.readFileSync(path.join(SITE_DIR, 'assets/js/engine.js'), 'utf8');
const { AOV, Transplant } = new Function(engineCode + '\nreturn {AOV, Transplant};')();

let _zstdReady = null;
function getZstd(){
  if(_zstdReady) return _zstdReady;
  _zstdReady = new Promise((resolve, reject)=>{
    ZstdCodecLib.run(z => resolve(z));
  });
  return _zstdReady;
}

const MAGIC = Buffer.from([0x22,0x4a,0x00,0xef]);
function buildHeader(decompressedLen){
  const head = Buffer.alloc(8);
  MAGIC.copy(head,0);
  head.writeUInt32LE(decompressedLen, 4);
  return head;
}

async function decodeEntryBuf(entryBuf, dictBytes){
  const zstd = await getZstd();
  const simple = new zstd.Simple();
  const ddict = new zstd.Dict.Decompression(dictBytes);
  try {
    const compressed = new Uint8Array(entryBuf.subarray(8));
    const out = simple.decompressUsingDict(compressed, ddict);
    if(!out) throw new Error('Giải nén zstd thất bại');
    return Buffer.from(out);
  } finally {
    ddict.delete();
  }
}

async function encodeEntryBuf(plainBuf, dictBytes, level){
  const zstd = await getZstd();
  const simple = new zstd.Simple();
  const cdict = new zstd.Dict.Compression(dictBytes, level || 19);
  try {
    const compressed = simple.compressUsingDict(new Uint8Array(plainBuf), cdict);
    const header = buildHeader(plainBuf.length);
    return Buffer.concat([header, Buffer.from(compressed)]);
  } finally {
    cdict.delete();
  }
}

async function loadZip(pkgPath){
  const buf = fs.readFileSync(pkgPath);
  return JSZipLib.loadAsync(buf);
}

async function listEntries(pkgPath){
  const zip = await loadZip(pkgPath);
  const out = [];
  zip.forEach((relPath, file) => { if(!file.dir) out.push(relPath); });
  return out;
}

async function readEntryPlain(pkgPath, entryPath, dictPath){
  const zip = await loadZip(pkgPath);
  const fileObj = zip.file(entryPath);
  if(!fileObj) throw new Error('Không tìm thấy entry "'+entryPath+'" trong '+pkgPath);
  const entryBuf = await fileObj.async('nodebuffer');
  const dictBytes = new Uint8Array(fs.readFileSync(dictPath));
  return decodeEntryBuf(entryBuf, dictBytes);
}

module.exports = { AOV, Transplant, SITE_DIR, loadZip, listEntries, readEntryPlain, decodeEntryBuf, encodeEntryBuf, buildHeader };
