'use strict';
/* ============================================================================
   PkgIO — đọc/ghi file .pkg.bytes trong trình duyệt.
   Phụ thuộc: JSZip (assets/js/jszip.min.js), ZstdCodec (assets/js/zstd-codec.bundle.js)
   Cả 2 phải được <script> load TRƯỚC file này.
   ============================================================================
   Định dạng đã reverse-engineer (xem HANDOFF/ghi chú phiên trước):
   - pkg.bytes = file ZIP (store, không nén ở lớp zip)
   - Mỗi entry actorinfo bên trong = [8-byte header][zstd frame nén bằng dictionary]
   - 8-byte header: 4 byte đầu cố định "22 4a 00 ef", 4 byte sau thực chất là
     total_len (u32, little-endian) của dữ liệu ĐÃ GIẢI NÉN — xem PkgIO._buildHeader.
   ========================================================================= */
const PkgIO = (() => {

  let _zstdModule = null; // cache ZstdCodec module đã init (Promise)
  function getZstd(){
    if(_zstdModule) return _zstdModule;
    _zstdModule = new Promise((resolve, reject)=>{
      if(typeof ZstdCodec === 'undefined'){ reject(new Error('ZstdCodec chưa được load (thiếu <script> zstd-codec.bundle.js)')); return; }
      ZstdCodec.run(zstd => resolve(zstd));
    });
    return _zstdModule;
  }

  // Cache dictionary bytes theo URL (tránh fetch lại nhiều lần trong 1 phiên làm việc)
  const _dictCache = new Map();
  async function fetchDict(dictUrl){
    if(_dictCache.has(dictUrl)) return _dictCache.get(dictUrl);
    const resp = await fetch(dictUrl);
    if(!resp.ok) throw new Error('Không tải được dictionary: '+dictUrl+' ('+resp.status+')');
    const buf = new Uint8Array(await resp.arrayBuffer());
    _dictCache.set(dictUrl, buf);
    return buf;
  }

  /* ---- Header 8 byte ----
     4 byte đầu: magic cố định "22 4a 00 ef" (giữ nguyên như file gốc luôn dùng).
     4 byte sau: total_len (u32 LE) của actorinfo ĐÃ GIẢI NÉN — cùng giá trị với
     4 byte đầu tiên bên trong bản thân file actorinfo (đã tự có total_len ở offset 0),
     nên có thể lấy lại từ chính data thay vì phải nhớ riêng. */
  const MAGIC = new Uint8Array([0x22,0x4a,0x00,0xef]);
  function buildHeader(decompressedLen){
    const head = new Uint8Array(8);
    head.set(MAGIC,0);
    head[4] = decompressedLen & 0xff;
    head[5] = (decompressedLen>>>8) & 0xff;
    head[6] = (decompressedLen>>>16) & 0xff;
    head[7] = (decompressedLen>>>24) & 0xff;
    return head;
  }

  /* Giải mã 1 entry (bytes lấy thẳng từ zip, còn nguyên 8-byte header + zstd frame)
     -> trả về Uint8Array actorinfo "trần" (đã giải nén, sẵn sàng cho AOV/Transplant). */
  async function decodeEntry(entryBytes, dictBytes){
    const zstd = await getZstd();
    const simple = new zstd.Simple();
    const ddict = new zstd.Dict.Decompression(dictBytes);
    const compressed = entryBytes.subarray(8); // bỏ 8-byte header
    const decompressed = simple.decompressUsingDict(compressed, ddict);
    if(!decompressed) throw new Error('Giải nén zstd thất bại (entry hỏng hoặc sai dictionary)');
    return decompressed;
  }

  /* Mã hoá lại 1 actorinfo "trần" -> bytes entry hoàn chỉnh (8-byte header + zstd frame)
     sẵn sàng ghi đè vào zip. Không cần khớp byte-for-byte với bản nén gốc — chỉ cần
     giải nén lại đúng dữ liệu là đạt. */
  async function encodeEntry(plainBytes, dictBytes, compressionLevel){
    const zstd = await getZstd();
    const simple = new zstd.Simple();
    const cdict = new zstd.Dict.Compression(dictBytes, compressionLevel || 19);
    const compressed = simple.compressUsingDict(plainBytes, cdict);
    const header = buildHeader(plainBytes.length);
    const out = new Uint8Array(header.length + compressed.length);
    out.set(header, 0);
    out.set(compressed, header.length);
    return out;
  }

  /* Tải + giải nén zip 1 pkg.bytes từ URL, trả về JSZip instance (chưa đụng tới zstd entry nào). */
  async function loadPkgZip(pkgUrl){
    if(typeof JSZip === 'undefined') throw new Error('JSZip chưa được load (thiếu <script> jszip.min.js)');
    const resp = await fetch(pkgUrl);
    if(!resp.ok) throw new Error('Không tải được pkg: '+pkgUrl+' ('+resp.status+')');
    const buf = await resp.arrayBuffer();
    return JSZip.loadAsync(buf);
  }

  /* Lấy 1 entry actorinfo đã giải mã sẵn sàng dùng, từ 1 pkg đã fetch (URL) + đường dẫn entry trong zip. */
  async function readEntryPlain(pkgUrl, entryPath, dictUrl){
    const [zip, dictBytes] = await Promise.all([loadPkgZip(pkgUrl), fetchDict(dictUrl)]);
    const fileObj = zip.file(entryPath);
    if(!fileObj) throw new Error('Không tìm thấy entry "'+entryPath+'" trong '+pkgUrl);
    const entryBytes = new Uint8Array(await fileObj.async('uint8array'));
    return decodeEntry(entryBytes, dictBytes);
  }

  /* Ghi đè 1 entry trong pkg (đã là JSZip instance) bằng dữ liệu actorinfo "trần" mới,
     mã hoá lại rồi cập nhật vào zip. Trả về zip đã sửa (cùng instance, mutate tại chỗ). */
  async function writeEntryPlain(zip, entryPath, newPlainBytes, dictBytes, compressionLevel){
    const encoded = await encodeEntry(newPlainBytes, dictBytes, compressionLevel);
    zip.file(entryPath, encoded, {binary:true, compression:'STORE'});
    return zip;
  }

  /* Xuất zip hiện tại thành Blob (để tải về / gán vào <a download>). */
  async function exportPkgBlob(zip){
    return zip.generateAsync({type:'blob', compression:'STORE'});
  }

  return { getZstd, fetchDict, buildHeader, decodeEntry, encodeEntry,
    loadPkgZip, readEntryPlain, writeEntryPlain, exportPkgBlob };
})();
