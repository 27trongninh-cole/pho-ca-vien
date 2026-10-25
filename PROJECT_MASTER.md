# PHỐ VIÊN CHIÊN — PROJECT MASTER
Version: 0.1 | 2026-10-25

## Mục đích
Tài liệu điều phối giữa chat Gameplay, chat Đồ họa và Claude Code. Khi có xung đột, hỏi người dùng để chốt; không tự suy đoán. Các mục 'thử nghiệm' chưa phải quyết định gameplay cuối cùng.

## Tầm nhìn đã thống nhất
- Game web mobile-first bằng HTML/CSS/JavaScript, đồ họa pixel art chibi lấy cảm hứng từ Kairosoft, không dùng Unity.
- Mỗi người chơi sở hữu một quán trên màn hình riêng; qua lại giữa các quán qua cộng đồng/bạn bè/bảng xếp hạng. Không hiển thị tất cả quán trên một bản đồ chung.
- Khách NPC là nguồn đơn hàng chính. Ban đầu chủ quán trực tiếp chế biến; về sau có thể thuê nhân viên để tự động hóa và dành thời gian giao lưu.
- Người chơi **tự sáng tạo công thức**: chọn/phối nguyên liệu, có thể tùy chỉnh hương vị và tự đặt tên món. Không cố định công thức từ bộ sprite mẫu.
- Yếu tố cộng đồng, đánh giá, tin đồn/drama và cạnh tranh quán là trọng tâm dài hạn; chưa triển khai trong prototype chế biến.

## Ranh giới công việc
- Chat Gameplay: quy tắc công thức, đơn hàng, nhu cầu NPC, kinh tế, tiến trình, nhân viên, cộng đồng.
- Chat Đồ họa: thiết kế sprite, animation, layout, quy chuẩn ghép/layer, hiển thị trên điện thoại.
- Claude Code: lập trình theo đặc tả đã duyệt; không tự biến giả định prototype thành luật game.

## Trạng thái giao diện chế biến
- Góc nhìn top-down 90 độ, không có nhân vật trong màn hình thao tác nấu.
- Thứ tự layout mobile đã chốt: **[Đơn hàng] → [Chảo dầu] → [Bàn chế biến]**.
- Bếp gas và chảo vuông; xiên xếp dọc, đầu nhọn lên trên, cán hướng xuống.
- Không có điều chỉnh mức lửa trong UI; hiệu ứng bong bóng dầu gồm 3 frame lặp lại.
- Điều khiển HYBRID: chạm để đưa xiên vào vị trí trống, có thể kéo thả chọn/chuyển vị trí.
- Xiên đang xỏ cần nằm trên bàn chế biến, không đứng ngoài bàn bên phải.

## Phân biệt QUY TẮC KỸ THUẬT và GAMEPLAY
- 10 PNG thức ăn là **nguyên liệu mẫu ban đầu**, không phải danh sách công thức khóa cứng.
- Que xiên PNG 32×136; sprite nguyên liệu PNG 32×32; bản thử ghép 4 nguyên liệu ở tọa độ y=0,21,42,63 trên que. Đây là **quy chuẩn hiển thị của mẫu xiên hiện tại**, không mặc nhiên khóa mọi công thức tương lai chỉ có 4 thành phần.
- Bếp prototype có 4 vị trí chiên. Đây là năng lực hiển thị bản thử, chưa quyết định quy tắc nâng cấp hay công suất game cuối cùng.
- Đơn hàng 4 viên trong prototype là **dữ liệu kiểm thử**, không phải định nghĩa món ăn chính thức.
- Thời gian chiên, cháy, giá bán, điểm đánh giá, độ phức tạp công thức: do chat Gameplay quyết định.

## Tài liệu chuyên môn
- `GAMEPLAY.md`: các quy tắc đã chốt và vấn đề gameplay chưa chốt.
- `ART_DIRECTION.md`: asset, kích thước, bố cục, animation, đường dẫn.

## Quy trình đồng bộ
1. Chat nào quyết định thay đổi trong phạm vi của mình thì đề xuất cập nhật đúng file chuyên môn.
2. Nếu ảnh hưởng lĩnh vực còn lại, ghi mục 'Cần phối hợp' thay vì tự quyết định.
3. Cập nhật PROJECT_MASTER khi thay đổi ảnh hưởng toàn dự án.
4. Claude Code đọc cả ba file trước mỗi đợt triển khai lớn.

## Cần phối hợp tiếp
- Cấu trúc dữ liệu công thức tự sáng tạo và cách đơn hàng NPC yêu cầu/nhận diện công thức.
- Quy tắc số nguyên liệu trên mỗi xiên và loại công thức không dùng xiên (nếu có).
- Vị trí UI tạo, lưu, đặt tên và chọn công thức do Gameplay xác định; Đồ họa chỉ thiết kế sau khi nhận yêu cầu.

## Cập nhật định hướng Gameplay — 2026-10-25
### Đã thống nhất về cách triển khai trước mắt
- **Tạm giữ nguyên prototype chế biến hiện tại** (đơn hàng mẫu, xỏ xiên, chiên, giao món); chưa mở rộng thêm cơ chế chế biến hoặc yêu cầu vẽ sprite mới.
- **Chưa loại bỏ khả năng tự sáng tạo công thức** đã thống nhất trước đó. Tuy nhiên, chưa chốt cấu trúc chi tiết, chỉ số hương vị, số lượng viên/xiên hay giao diện sổ công thức. Không biến gợi ý đơn giản hóa thành luật chính thức.
- Ưu tiên tiếp theo của chat Gameplay là **vòng lặp chơi tổng thể**, nhất là động lực tiếp tục chơi sau khi người chơi thuê nhân viên.
- Định hướng vai trò: **tự bán để khởi nghiệp → quản lý quán để phát triển → cộng đồng/drama để gắn bó lâu dài**. Đây là định hướng thiết kế, không phải quy định cứng về thứ tự mở khóa hay thời gian chơi.
- Cân nhắc cho phép thuê nhân viên tương đối sớm để người chơi không bị giữ quá lâu trong mini-game chế biến; **thời điểm mở khóa chưa chốt**.

### Chưa chốt — không tự triển khai
- Cơ chế tạo/lưu công thức chi tiết, hương vị, sốt/gia vị, món nhiều xiên và giới hạn slot.
- Cân bằng tự bán so với nhân viên, năng suất, chi phí, chất lượng và thời điểm thuê.
- Hoạt động quản lý/cộng đồng nào đủ hấp dẫn để giữ chân người chơi khi quán đã tự động hóa.

### Phối hợp giữa các bên
- **Đồ họa:** giữ nguyên asset và layout prototype; chưa cần thiết kế thêm UI/sprite cho cơ chế công thức mở rộng khi Gameplay chưa chốt.
- **Claude Code:** không tự suy diễn các gợi ý brainstorm thành yêu cầu tính năng; chỉ triển khai phần đã được duyệt.

## Kiểm tra đồng bộ GitHub — 2026-10-25
- Kiểm tra khả năng ghi từ chat Gameplay vào repository chung theo yêu cầu của chủ dự án.
- Đây là dòng kiểm thử kết nối, **không thay đổi quyết định thiết kế hoặc yêu cầu triển khai**.

## Cập nhật gameplay đã chốt: xử lý nhiều đơn và khay thành phẩm — 2026-10-25
- **Thay thế mô hình một đơn tại một thời điểm của prototype** bằng khả năng nhiều đơn chờ đồng thời; người chơi tự chọn thứ tự chế biến và tận dụng các vị trí chiên để làm món cho nhiều khách.
- **Thêm khay thành phẩm chung** để chứa xiên đã chiên, không buộc gán xiên vào đơn ngay khi nấu.
- **Giao theo đơn bằng một thao tác:** nút Giao chỉ khả dụng khi khay đủ tất cả món đúng yêu cầu; bấm Giao sẽ tự lấy/trừ các món tương ứng và hoàn thành đơn. Không yêu cầu kéo từng xiên đến từng khách.
- Khi đối chiếu đơn phải xét **đúng món/công thức**, không chỉ loại nguyên liệu; cấu trúc công thức chi tiết vẫn chưa chốt.
- **Cần phối hợp Đồ họa:** thiết kế vị trí khay thành phẩm, cách hiển thị nhiều đơn, trạng thái đủ/thiếu món và nút Giao trong giao diện mobile. Thứ tự bố cục prototype cũ cần được điều chỉnh có chủ đích để bổ sung khay; không tự chốt tọa độ.
- **Cần phối hợp Claude Code:** cập nhật logic nhiều đơn, kho thành phẩm và tự khớp/giao đúng đơn sau khi layout được duyệt.
- **Chưa chốt:** giới hạn số đơn, sức chứa khay, thời gian chờ, công suất chiên cuối cùng và cơ chế món để lâu. Không tự biến các ví dụ brainstorm thành thông số bắt buộc.

## Xác nhận phối hợp Gameplay–Đồ họa — 2026-10-25
- Chủ dự án đồng ý bố cục mobile do Đồ họa đề xuất: **[Thẻ nhiều đơn cuộn ngang] → [Chảo dầu] → [Khay thành phẩm chung] → [Bàn chế biến]**. Đây là bố cục mới thay cho bố cục ba vùng của prototype.
- Gameplay chốt **HYBRID** cho thao tác xiên đã chín → khay: chạm để chuyển tự động hoặc kéo thả; không buộc kéo.
- Cho phép chạm món trong khay để **xem tên công thức và chi tiết phân biệt** (thành phần/hương vị khi có), kể cả khi sprite giống nhau.
- Đồ họa phụ trách thể hiện trạng thái, thẻ đơn, khay và chi tiết món; chưa khóa kích thước, sức chứa, số đơn tối đa hoặc thông số kinh tế.

## Điều chỉnh đã chốt: hai đơn chính và xếp hàng FIFO — 2026-10-25
- **Thay thế đề xuất thẻ nhiều đơn cuộn ngang**: chỉ hiển thị **2 đơn chính** đang phục vụ, cộng **hàng chờ thu gọn** có thể mở xem yêu cầu để chuẩn bị món trước.
- **Phục vụ đúng thứ tự khách đến (FIFO)**: có thể chế biến song song và dự trữ món trong khay chung, nhưng chỉ được **Giao/thu tiền** cho khách đứng đầu hàng. Đơn thứ hai chỉ giao được sau khi đơn đầu hoàn tất.
- Khi một đơn chính hoàn tất, hàng chờ tiến lên theo thứ tự. Giữ nguyên khay thành phẩm chung, đối chiếu đúng món/công thức và nút Giao trọn đơn.
- **Đồ họa** cập nhật thiết kế vùng đơn từ thẻ cuộn ngang sang 2 đơn chính + hàng chờ thu gọn. Chưa khóa kích thước, số khách chờ, thời gian chờ hoặc hình thức mở hàng chờ.

## Đồng bộ asset màn Quán — 2026-10-25

- Chủ dự án đã commit cấu trúc hiện hành vào nhánh `main`: **`assets/world/shop_base/` có 16 sprite PNG**, gồm sàn, vỉa hè, tường, cửa, mái hiên. Đây là đường dẫn được dùng cho tích hợp hiện tại.
- **Không bắt buộc đổi sang `assets/world/shop/`**. Sơ đồ `shop/` với nhiều thư mục con là phương án tổ chức khi có nội thất, đồ trang trí, nhân vật; chưa áp dụng và không nên di chuyển asset đang dùng.
- **Bỏ bó vỉa hè** (4 sprite curb/corner/end), giữ vỉa hè phẳng bằng `sidewalk_tile.png`. Không tái tạo các sprite curb trong những đợt sửa kế tiếp.
- Màn Quán: isometric 3/4, tile footprint 64×32 px; bộ kiến trúc hỗ trợ ghép mặt bằng 6×5, mở rộng thử 8×5, 8×7. Mái hiên phải tránh che khuất khu vực kinh doanh.
- **Trạng thái mỹ thuật:** RC3 là bản thử, chưa có xác nhận nghiệm thu cuối cùng; việc asset tồn tại trên `main` không tự động có nghĩa đã được duyệt. Ưu tiên chuyển sang module nội thất sau khi xử lý mức che khuất mái ở mức đủ dùng.
- Claude Code và chat Đồ họa phải dùng đường dẫn thực tế trên `main`, không tạo import `shop/` hoặc các sprite bó vỉa đã bỏ. Không thay đổi gameplay vì cập nhật này.
