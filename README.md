# ArumPrefab

Web tool ghép skin cho các file `*_ActorInfo.bytes` bên trong `Prefab_Soldier.pkg.bytes` (Liên Quân Mobile / AOV). Toàn bộ xử lý (giải nén zip, giải mã zstd+dictionary, cắt-ghép nhị phân, nén lại) chạy **hoàn toàn trong trình duyệt** — không có backend, không upload file đi đâu cả.

Demo: `https://<username>.github.io/<ten-repo>/`

---

## 1. Cấu trúc thư mục

```
.
├── site/                        ← toàn bộ nội dung sẽ được GitHub Pages phục vụ
│   ├── index.html               ← trang chính
│   ├── pkg/                     ← file .pkg.bytes gốc (đích + nguồn) và dictionary dùng chung
│   │   ├── Prefab_Soldier.pkg.bytes
│   │   ├── zstd_dict.bin
│   │   └── Actor_105_Infos_pkg.bytes      (ví dụ 1 file nguồn)
│   ├── index/                   ← file JSON mô tả nội dung từng pkg (để web hiển thị nhanh, không cần tải file .bytes nặng)
│   │   ├── Prefab_Soldier.pkg.json        (14 file đích, 8 thư mục, chia phe Xanh/Đỏ)
│   │   ├── Actor_105_Infos_pkg.json       (danh sách skin của 1 nguồn)
│   │   └── sources.json                   (manifest: liệt kê tất cả nguồn hiện có)
│   └── assets/js/
│       ├── jszip.min.js                   (đọc/ghi file zip)
│       ├── zstd-codec.bundle.js           (giải nén/nén zstd có dictionary, WASM nhúng sẵn)
│       ├── engine.js                      (AOV + Transplant — logic parse & ghép field nhị phân)
│       └── pkgio.js                       (lớp glue: pkg.bytes ⇄ actorinfo "trần")
└── scripts/                     ← script Node chạy TAY (không chạy trên web), dùng để sinh file trong site/index/
    ├── node_pkgio.js            (helper dùng chung, tái sử dụng đúng engine.js + 2 lib trên)
    ├── gen_target_index.js      (sinh Prefab_Soldier.pkg.json, tự verify entryPath tồn tại thật)
    ├── gen_source_index.js      (sinh index cho 1 file nguồn, tự tìm entry chính + liệt kê skin)
    └── gen_sources_manifest.js  (quét site/index/*.json, sinh lại sources.json)
```

---

## 2. Deploy lên GitHub Pages (hướng dẫn từ đầu)

### Bước 1 — Tạo repo trên GitHub
1. Đăng nhập GitHub → góc phải trên → **New repository**.
2. Đặt tên repo (ví dụ `arumprefab`), để **Public** (Pages free chỉ hoạt động với repo public, trừ khi bạn có GitHub Pro/Team).
3. **Không** tích "Add a README file" (mình đã có sẵn README này) — bấm **Create repository**.

### Bước 2 — Đẩy code lên
Trên máy bạn, ở thư mục gốc chứa `site/`, `scripts/`, `README.md` này:

```bash
git init
git add .
git commit -m "Init ArumPrefab"
git branch -M main
git remote add origin https://github.com/<username>/<ten-repo>.git
git push -u origin main
```

> Nếu Git hỏi đăng nhập, dùng **Personal Access Token** (GitHub không cho login bằng mật khẩu qua git nữa) — tạo tại: GitHub → Settings → Developer settings → Personal access tokens → Generate new token (chọn quyền `repo`).

### Bước 3 — Bật GitHub Pages
1. Vào repo trên GitHub → tab **Settings** → mục **Pages** (menu bên trái).
2. Ở **Build and deployment** → **Source**: chọn **Deploy from a branch**.
3. **Branch**: chọn `main`, thư mục chọn **`/site`** (không phải `/root`, vì code web nằm trong thư mục con `site/`).
4. Bấm **Save**.
5. Đợi khoảng 1–2 phút, refresh lại trang Settings → Pages sẽ hiện link dạng:
   `https://<username>.github.io/<ten-repo>/`

Mở link đó — nếu thấy màn hình chọn "Phe Xanh / Phe Đỏ" là đã deploy thành công.

### Bước 4 — Cập nhật sau này
Mỗi khi sửa file (thêm nguồn mới, sửa UI...) chỉ cần:
```bash
git add .
git commit -m "Mô tả thay đổi"
git push
```
GitHub Pages tự động build lại sau vài chục giây tới ~2 phút, không cần thao tác gì thêm.

---

## 3. Quy trình thêm 1 file nguồn mới

```bash
# 1. Copy file pkg nguồn vào đúng chỗ
cp TenFile_Infos_pkg.bytes site/pkg/

# 2. Sinh index tự động (giải mã thật, verify cấu trúc, liệt kê skin)
node scripts/gen_source_index.js TenFile_Infos_pkg.bytes

# 3. Mở file site/index/TenFile_Infos_pkg.json vừa sinh ra, điền tay field "role"
#    (1 trong 6 giá trị: "Đấu sĩ","Đỡ đòn","Pháp sư","Sát thủ","Trợ thủ","Xạ thủ")

# 4. Cập nhật lại manifest tổng
node scripts/gen_sources_manifest.js

# 5. Commit & push
git add site/pkg/TenFile_Infos_pkg.bytes site/index/TenFile_Infos_pkg.json site/index/sources.json
git commit -m "Thêm nguồn TenFile"
git push
```
Web sẽ **tự động nhận nguồn mới** ở lần tải trang kế tiếp — không cần sửa code, vì `index.html` luôn fetch `sources.json` để biết danh sách nguồn hiện có.

---

## 4. Chạy thử ở máy cá nhân trước khi deploy

Trang dùng `fetch()` để tải JSON/pkg, nên **không thể mở trực tiếp bằng file://** (trình duyệt chặn). Cần chạy qua local server:

```bash
cd site
python3 -m http.server 8000
```
Rồi mở `http://localhost:8000` trên trình duyệt.

---

## 5. Ghi chú kỹ thuật (cho lần sau cần sửa/mở rộng)

- **Định dạng pkg.bytes**: file ZIP (store), mỗi entry actorinfo bên trong = `[8-byte header][zstd frame nén bằng dictionary dùng chung]`. Chi tiết đầy đủ về cấu trúc nhị phân actorinfo (record/container/sentinel rỗng...) nằm trong comment ở đầu `site/assets/js/engine.js`.
- **Nén lại không cần khớp byte gốc** — chỉ cần giải nén lại đúng dữ liệu là đạt (đã thống nhất, không cố match level nén của tool gốc).
- **14 file đích đã chốt** (8 thư mục `Prefab_Soldier/New_*`, đã bỏ `New_SoldierDuke` và `New_Truck_3v3_Red`) — xem `scripts/gen_target_index.js` để biết danh sách chính xác.
- **Rule đổi tên field khi ghép skin** (bỏ chữ "Skin", trừ 2 ngoại lệ `ArtSkinLobbyShowMovie`/`ArtSkinLobbyShowCamera`) — xem `RENAME_MAP`/`KEEP_SKIN_EXCEPTIONS` trong `engine.js`.
- **Field `Scale` (TransConfigsK/Element[1])** luôn được mang kèm khi ghép 1 skin cụ thể (không áp dụng khi chọn "Mặc định", vì lúc đó đã copy nguyên `TransConfigsK`).
