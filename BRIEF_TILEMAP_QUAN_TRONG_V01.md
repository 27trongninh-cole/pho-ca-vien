# PHỐ VIÊN CHIÊN — BRIEF XƯỞNG VẼ
## Mặt bằng quán trống — Isometric Tilemap v0.1

**Trạng thái:** Bản thử để duyệt cấu trúc, **chưa khóa kích thước/tọa độ sản xuất**.  
**Mục tiêu:** Tạo một **bộ nền lắp ghép** cho quán xiên chiên nhà phố nhỏ, có vỉa hè trước cửa; không vẽ một bức tranh toàn cảnh rồi cắt thành sprite.

## 1. Ý tưởng hình ảnh
- Quán cấp 1 là **một mặt bằng nhà phố nhỏ có không gian bên trong**, không phải xe bán hàng đơn lẻ.
- Góc nhìn **isometric 3/4**, dạng cutaway: bỏ/ẩn tường trước để thấy sàn và khu vực hoạt động.
- Có phần **vỉa hè phía trước**; đường phố, nhà hàng xóm, cây cối chỉ là bối cảnh phụ và **chưa cần vẽ**.
- Chất Việt Nam bình dân, gam kem/vàng ấm, gạch lát, tường cũ vừa phải; pixel art sắc nét, vui nhộn, gợi Kairosoft nhưng không sao chép asset.
- Phần quán là trọng tâm, ưu tiên khả năng nhìn rõ trên màn hình điện thoại dọc.

## 2. Phạm vi bản v0.1 — CHỈ mặt bằng trống
**Cần có:**
1. **Sàn trong nhà:** tile gạch có thể lặp, tối thiểu một tile cơ bản và tile viền/chuyển tiếp nếu cần.
2. **Tường sau và tường bên:** module đoạn thẳng, góc nối, mép kết thúc; nhìn được không gian bên trong.
3. **Khoảng mở mặt tiền / cửa ra vào:** chừa lối thông ra vỉa hè, không bị che bởi tường trước.
4. **Vỉa hè:** tile lát lặp, mép bó vỉa, điểm nối với mặt bằng quán.
5. **Mái hiên / mái bạt trước cửa:** thử dưới dạng **lớp riêng có thể bật/tắt**, không che sàn trong quán. Nếu che tầm nhìn, tạm bỏ khỏi preview chính.

**Chưa vẽ:** quầy chiên, tủ kính, bàn ghế, nhân vật, xe máy, cây, đèn, biển hiệu, chai lọ, đồ trang trí, bóng đổ cố định của vật chưa tồn tại.

## 3. Quy chuẩn kỹ thuật đề xuất để THỬ
- Dùng **một hệ lưới isometric nhất quán**. Có thể thử footprint mỗi ô sàn **64 × 32 px** (hình thoi tỷ lệ 2:1); đây là **đề xuất thử**, không phải quy chuẩn đã duyệt.
- Mọi tile sàn phải ghép liên tục, không có đường nối sáng/tối bất thường.
- Tường là lớp riêng; độ cao tường nhất quán và không vẽ liền vào tile sàn.
- Giữ nét pixel nguyên, không anti-alias, không dùng gradient/blur hoặc phối cảnh lệch lưới.
- Mỗi PNG **nền trong suốt**, xuất ở độ phân giải gốc; **không phóng to 2×/4× ngay trong file**.
- **Chọn một hướng camera duy nhất** cho tất cả module. Đánh dấu trục lưới trong ảnh hướng dẫn, không vẽ trục vào asset.
- Ưu tiên mô hình tile/layer ít loại, có thể lặp; không tạo sprite riêng cho từng vị trí trên bản đồ.

## 4. Đề xuất mặt bằng mẫu (để đánh giá, không khóa)
- Quán nhỏ hình chữ nhật, khoảng **6 × 5 ô sàn**; vỉa hè là dải 1–2 ô phía trước.
- Có hai tường phía sau/bên và một mặt trước mở để quan sát.
- Chừa các vùng trống tương lai cho **quầy chế biến, chỗ khách ngồi, lối đi** nhưng **không kẻ vùng chức năng lên sprite**.
- Có thể thay đổi số ô sau khi xem preview trên tỷ lệ điện thoại.

## 5. Bàn giao theo 2 bước
### A. Duyệt hệ hình học trước
Gửi **một ảnh preview lắp ghép** của mặt bằng trống, kèm một ảnh **wireframe có lưới và số ô**. Hai ảnh này chỉ để kiểm tra, không dùng làm background cố định.

### B. Chỉ sau khi preview được duyệt
Xuất bộ PNG tách lớp, đặt tên rõ ràng, ví dụ:
```text
assets/world/shop_base/
├── floor_tile.png
├── floor_edge.png            # nếu cần
├── wall_back_segment.png
├── wall_side_segment.png
├── wall_corner.png
├── wall_end.png               # nếu cần
├── entrance_transition.png
├── sidewalk_tile.png
├── sidewalk_curb.png
└── awning_front.png           # lớp riêng, nếu có
```
Đây là **danh sách gợi ý**, không bắt buộc phải có tất cả; xưởng vẽ cần ghi kích thước thật, anchor/điểm đặt, thứ tự layer và kích thước ô lưới trong `README.md` bàn giao.

## 6. Tiêu chí nghiệm thu
- Nhìn rõ **một quán có mặt bằng**, không phải một xe hàng vỉa hè.
- Ghép các tile thành mặt bằng khác kích thước vẫn hợp lý.
- Không có đồ vật trang trí hay bóng đổ làm cản trở việc thay đổi nội thất sau này.
- Sàn, tường, cửa, vỉa hè **tách lớp rõ**; mái hiên không che khuất hoạt động.
- Preview vẫn dễ nhìn khi thu nhỏ vào khung màn hình điện thoại dọc.

## 7. Điều không được tự quyết
- Không chốt diện tích tối đa, cơ chế mở rộng đất hoặc luật nâng cấp quán.
- Không thay đổi gameplay, không tự vẽ UI hoặc thanh điều hướng.
- Không xuất một ảnh nền duy nhất để Claude dùng thay cho tilemap.
- Không vẽ nội thất trước khi mặt bằng và hệ lưới được duyệt.

**Yêu cầu gửi xưởng:** *Hãy làm preview mặt bằng trống + wireframe lưới trước. Mục tiêu là kiểm tra tính lắp ghép và góc nhìn, không phải độ hoành tráng của concept.*
