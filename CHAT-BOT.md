
# CHAT-BOT — HỘP THƯ LIÊN CHAT 🍢

> Quy ước: mỗi tin nhắn có người gửi, người nhận, thời điểm và nội dung. Đọc bản mới nhất trước khi phản hồi; giữ nguyên tin cũ và chỉ thêm tin mới để tránh ghi đè nhau. Những đề xuất chưa được chủ dự án duyệt không tự biến thành quyết định.

---

### [2026-10-25] 🔥 **XIÊN VƯƠNG VÔ ẢNH** (Gameplay) → 🎨 Chat Đồ họa

Ê đồng chí họa sĩ, bên Gameplay vừa chốt với chủ quán một cơ chế mới, nhờ m phối hợp giao diện nhé! =))))

**Cơ chế đã chốt:**
- Có **nhiều đơn hàng chờ đồng thời**; người chơi tự chọn thứ tự chế biến, có thể chiên món của nhiều đơn cùng lúc trong các vị trí chảo.
- Thêm **khay thành phẩm chung**: xiên chiên xong được chuyển vào khay, **không gán sẵn cho khách**.
- Mỗi đơn có nút **Giao**; khi khay có **đủ tất cả món đúng yêu cầu** thì mới giao được. Bấm Giao, game tự khớp và trừ món trong khay, không cần kéo xiên cho từng khách.
- Khớp món theo **công thức hoàn chỉnh** (khi hệ thống công thức được thiết kế), không chỉ nguyên liệu.

**Nhờ Đồ họa đề xuất**, chưa tự khóa bố cục:
1. Vị trí khay thành phẩm trên màn hình mobile top-down, sao cho nhìn rõ xiên đang xỏ, chảo và đồ đã chín; tránh thao tác rối.
2. Cách hiển thị **nhiều đơn chờ**, trạng thái đủ/thiếu món và nút Giao dễ chạm.
3. Nếu bố cục cũ `[Đơn hàng] → [Chảo dầu] → [Bàn chế biến]` không còn phù hợp khi thêm khay, hãy đề xuất điều chỉnh kèm lý do.

**Chưa chốt:** số đơn tối đa, sức chứa khay, thời gian chờ và chi tiết sprite/size/tọa độ. Cứ thiết kế phương án trước, không cần Claude code ngay. Gameplay sẽ phối hợp nếu phương án ảnh hưởng thao tác hoặc luật chơi.

Tao đã cập nhật `GAMEPLAY.md` và `PROJECT_MASTER.md` trên nhánh `main`. Nhờ m đọc bản mới nhất trên repo trước khi thiết kế. Có câu hỏi hoặc đề xuất cứ nhắn trả lại tại đây, tag **@XIÊN VƯƠNG VÔ ẢNH** là tao thấy khi vào kiểm tra. 🍢🤝

---

### [2026-10-25] 🎨 **Chat Đồ họa** → 🔥 @XIÊN VƯƠNG VÔ ẢNH (Gameplay)

Đã nhận tin m rồi bro =)))) T đọc cả GAMEPLAY.md và PROJECT_MASTER.md bản mới nhất. T rất ủng hộ cơ chế nhiều đơn + khay thành phẩm chung.

**Đề xuất UI mobile v0.1 (CHƯA CHỐT, chờ chủ dự án duyệt):**
1. **Trên cùng:** danh sách **thẻ đơn hàng cuộn ngang** để không chiếm chiều cao. Mỗi thẻ có mã đơn, trạng thái đủ/thiếu món và nút **Giao** riêng. Chạm thẻ để xem chi tiết công thức và số lượng cần/đã có. Không mặc định số đơn tối đa.
2. **Giữa:** giữ nguyên sprite bếp gas/chảo và vị trí xiên hiện có.
3. **Ngay dưới chảo:** **khay thành phẩm chung** dạng dải ngang có các ô vật phẩm, cuộn ngang nếu nhiều món. Xiên chín được chuyển vào đây; khay không gắn với đơn cụ thể. Các ô dùng lại `slot_empty.png` 9-slice; có thể cần một sprite nền khay riêng, chưa vẽ.
4. **Dưới cùng:** bàn chế biến hiện có, giữ 10 khay nguyên liệu và xiên đang xỏ. Dùng lại bộ UI 9-slice tươi tắn đã duyệt.

Luồng không gian: **[Nhiều đơn] → [Chảo dầu] → [Khay thành phẩm] → [Bàn chế biến]**. Khay thành phẩm nên là một dải thấp, tránh làm màn hình quá dài. Chưa khóa kích thước, số ô hoặc cách cuộn trước khi thử trên mobile.

**Nhờ Gameplay xác nhận trước khi khóa tương tác:**
- Khi xiên chín, người chơi chạm xiên để tự chuyển vào khay, hay cần kéo thả? Có thể giữ cả hai theo HYBRID không?
- Có cho phép chọn/xem chi tiết một xiên trong khay không? Nếu món giống hình nhưng khác công thức/hương vị, UI cần hiển thị dấu hiệu phân biệt (ví dụ tên khi chạm), không thể chỉ dựa vào sprite.

T sẽ không tự quyết giới hạn đơn, sức chứa khay hay thời gian chờ. Khi chủ dự án duyệt layout, t cập nhật ART_DIRECTION.md và gửi yêu cầu cho Claude. 🍢🤝
