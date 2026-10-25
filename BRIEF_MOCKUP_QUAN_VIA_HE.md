# PHỐ VIÊN CHIÊN — BRIEF XƯỞNG VẼ
## Concept 01: Quán xiên chiên vỉa hè có mái che

**Ngày:** 25/10/2026  
**Trạng thái:** Concept thử nghiệm — chưa phải sprite game chính thức.

## 1. Mục tiêu
Vẽ **một mockup tổng thể** cho màn **Quán**: người chơi nhìn thấy toàn bộ quán xiên chiên vỉa hè Việt Nam dưới góc **isometric 3/4**, như một mô hình thu nhỏ trong game quản lý kiểu Kairosoft. Mục đích là duyệt bố cục, tỷ lệ, chất liệu và không khí trước khi tách sprite.

## 2. Bối cảnh và bố cục
- Quán nhỏ bình dân trên vỉa hè đô thị Việt Nam hiện đại; **mái bạt che** là đặc điểm nhận diện chính.
- Nhìn rõ **toàn bộ mặt bằng quán** trong một khung hình, không cắt mất các thành phần chính.
- Quầy bán/chiên là điểm nhấn; phía trước có lối tiếp cận cho khách, bên cạnh là một vài bộ **bàn ghế nhựa thấp**.
- Có thể thêm thùng đá, giỏ nguyên liệu, bảng hiệu thủ công, đèn nhỏ và chi tiết vỉa hè vừa đủ tạo cảm giác Việt Nam.
- Bố cục thoáng, dễ xác định khu vực khách đứng gọi món, khách ngồi và chủ quán làm việc. Không lấp kín mọi khoảng trống.
- Quán ban đầu nên giản dị, có tiềm năng nâng cấp sau này; **không** vẽ thành nhà hàng lớn, sang trọng.

## 3. Phong cách
- **Pixel art 2D sắc nét**, chibi dễ thương, cảm hứng game Kairosoft nhưng có bản sắc Việt Nam.
- **Góc isometric 3/4 nhất quán**, không phối lẫn góc nhìn top-down 90° của màn Chế biến.
- Màu sắc ấm, vui, hơi bụi đời phố xá; hạn chế bão hòa quá mức, gradient, hiệu ứng AI bóng bẩy, 3D giả lập và chi tiết nhiễu.
- Các vật thể cần có đường nét và tỷ lệ đủ rõ để sau này tách thành sprite độc lập.
- Đây là **màn Quán**, không phải màn Chế biến: không cần mô phỏng UI xỏ xiên/chảo chiên top-down bên trong mockup.

## 4. Những đối tượng cần xuất hiện trong concept
1. Mặt bằng vỉa hè và một phần đường phố.
2. Mái che bạt, cột chống.
3. Quầy/xe bán xiên chiên và khu vực chế biến nhìn từ ngoài.
4. Một bảng hiệu quán đơn giản.
5. Hai hoặc ba bộ bàn ghế nhựa thấp (số lượng chỉ để thử bố cục).
6. Một nhân vật chủ quán chibi và một vài khách NPC minh họa tỷ lệ.
7. Vật dụng phụ vừa đủ: thùng đá, sọt đồ, thùng rác hoặc kệ nhỏ.

**Lưu ý:** Số lượng bàn, khách và vật dụng chỉ là **minh họa art**, không đặt giới hạn gameplay hay sức chứa quán.

## 5. Quy tắc thiết kế để triển khai bằng code sau này
- **Không** biến toàn bộ quán thành một ảnh nền cố định để dùng trực tiếp trong game.
- Concept cần cho thấy những thành phần có thể tách riêng: nền, mái che, quầy, bàn, ghế, bảng hiệu, vật dụng, nhân vật.
- Chừa không gian hợp lý cho nhân vật di chuyển, hiệu ứng và tương tác; chưa khóa đường đi hoặc hệ thống xây dựng.
- Chưa cần vẽ nút UI, thanh điều hướng hay các popup vào concept.
- Không tự thêm luật nâng cấp, diện tích quán, số khách tối đa hoặc hệ thống trang trí.

## 6. Bàn giao vòng 1
- **01 ảnh mockup tổng thể**, ưu tiên khung ngang để xem rõ toàn bộ quán; độ phân giải đủ lớn để đánh giá pixel và bố cục.
- Nếu có thể, **01 bản chú thích phân lớp** (nền / mái / quầy / bàn ghế / NPC), không bắt buộc.
- **Chưa cần** xuất từng sprite riêng hoặc làm animation ở vòng này.

## 7. Tiêu chí duyệt
- Nhìn vào nhận ra ngay **quán xiên chiên vỉa hè Việt Nam**.
- Góc isometric 3/4 và tỷ lệ đồ vật/nhân vật thống nhất.
- Quán nhỏ nhưng có cảm giác sống động, thân thiện và có chỗ để phát triển.
- Phong cách pixel art hòa hợp với bộ UI kem–cam–xanh đã có.
- Có thể hình dung cách tách asset và lắp lại bằng HTML/CSS/JS sau này.

---

**Lệnh ngắn cho xưởng vẽ:** Hãy vẽ concept tổng thể màn Quán theo brief này. Ưu tiên một quán xiên bẩn vỉa hè có mái bạt, nhìn toàn cảnh isometric 3/4, pixel art tươi tắn kiểu Kairosoft nhưng đậm chất Việt. Chỉ làm mockup để duyệt; chưa tách sprite, chưa thiết kế UI và không thêm gameplay.
