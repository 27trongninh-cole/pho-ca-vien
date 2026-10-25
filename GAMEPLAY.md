# PHỐ VIÊN CHIÊN — GAMEPLAY
Version: 0.1 | 2026-10-25

## Đã thống nhất
- Mỗi người chơi là chủ một quán riêng; khách NPC tạo nhu cầu thường xuyên.
- Giai đoạn đầu người chơi tự xỏ xiên, chiên và giao; về sau có thể thuê nhân viên để tự động hóa.
- Người chơi có thể **tự sáng tạo công thức**, lựa chọn/phối nguyên liệu, điều chỉnh thuộc tính hương vị và tự đặt tên món. Công thức không bị giới hạn ở 10 mẫu PNG.
- Cộng đồng có bạn bè, xã hội, bảng xếp hạng; người chơi có thể thăm quán, đánh giá, tạo tương tác/drama.
- Quán có thể được mua bán/chuyển chủ; các chi tiết cân bằng kinh tế để chat Gameplay hoàn thiện.

## Prototype hiện có (KHÔNG phải luật cuối)
- Một đơn hàng mẫu chỉ định bốn nguyên liệu để thử chu trình xỏ → chiên → giao.
- Bốn slot trên que là cấu trúc sprite thử nghiệm. Không suy ra rằng mọi công thức trong game chỉ được có bốn viên hoặc một xiên.
- Chảo hiện hiển thị bốn xiên. Đây là giới hạn bố cục bản thử.
- Điều chỉnh lửa thủ công đã bị loại khỏi UI chế biến theo quyết định người dùng; các thông số nấu còn lại do Gameplay chốt.

## Cần chat Gameplay chốt
- Công thức được tạo bằng nguyên liệu nào, có số lượng/tỷ lệ/hương vị ra sao; cách lưu và đặt tên.
- NPC gọi công thức đã lưu, nguyên liệu cụ thể hay món tùy biến theo cách nào.
- Khi đơn sai công thức, giao nhầm hoặc món quá lửa, hậu quả là gì.
- Cơ chế công thức mới, mở khóa nguyên liệu, chi phí và đánh giá.
- Số vị trí/độ dài xiên tối đa và các loại món khác ngoài xiên (nếu có).

## Nguyên tắc phối hợp với Đồ họa
Gameplay mô tả khả năng và tương tác cần có; Đồ họa thiết kế cách hiển thị mà không tự áp đặt quy tắc kinh tế hay công thức.

## Chốt gameplay: nhiều đơn đồng thời và khay thành phẩm — 2026-10-25
- Người chơi có thể có **nhiều đơn hàng đang chờ đồng thời**, được quyền chọn thứ tự xỏ và chiên; không buộc hoàn thành tuần tự từng khách.
- Có thể chiên đồng thời các xiên thuộc nhiều đơn khác nhau trong các vị trí chảo hiện có. **Số đơn tối đa, thời gian chờ và công suất cuối cùng chưa chốt**.
- Bổ sung **khay thành phẩm**: xiên chiên xong được đưa vào khay chung, không cần gán thủ công cho từng khách.
- Mỗi đơn có thao tác **Giao**. Chỉ khi khay có đủ **toàn bộ món đúng yêu cầu của đơn** mới cho giao; hệ thống tự đối chiếu, lấy/trừ đúng số món trong khay và hoàn thành đơn, không cần người chơi chọn từng xiên cho khách.
- Khi đối chiếu món phải dựa trên **công thức/món hoàn chỉnh**, không chỉ tên nguyên liệu, để tránh nhầm các món cùng nguyên liệu nhưng khác cách chế biến/hương vị khi hệ thống công thức được hoàn thiện.
- Chưa chốt sức chứa khay, giới hạn tồn, xử lý món để lâu, giao một phần, cách hiển thị khay và UI danh sách đơn. **Đồ họa quyết bố cục, kích thước và sprite**; Claude Code chỉ triển khai sau khi phối hợp giao diện.

## Chốt tương tác khay thành phẩm — 2026-10-25
- Xiên đã chín: **chạm** để tự chuyển từ chảo vào khay thành phẩm; cũng hỗ trợ **kéo thả** theo cơ chế HYBRID, không bắt buộc kéo thủ công.
- Cho phép **chạm xem chi tiết** một xiên/món trong khay: tên công thức và thông tin thành phần/hương vị khi có. Món trông giống nhau nhưng khác công thức phải nhận diện/phân biệt được, không dựa vào sprite đơn thuần.
- Chủ dự án đã đồng ý với đề xuất bố cục Đồ họa: **[Nhiều đơn] → [Chảo dầu] → [Khay thành phẩm] → [Bàn chế biến]**. Đồ họa tự quyết kích thước/hiển thị sau khi thử mobile; chưa khóa số ô khay hay số đơn.

## Chốt thứ tự phục vụ FIFO — 2026-10-25
- Khách được phục vụ **theo thứ tự đến (FIFO)**; không cho giao đơn sau trước đơn trước.
- Giao diện có **tối đa 2 đơn chính đang phục vụ** cùng lúc; hoàn thành đơn đầu thì đơn tiếp theo từ hàng chờ được đưa lên. Hai đơn chính có thể **được chế biến song song**, tận dụng các vị trí chảo.
- **Đơn thứ hai chỉ được bấm Giao sau khi đơn thứ nhất đã giao xong**, kể cả khi khay đã đủ món cho đơn thứ hai.
- Có **hàng chờ thu gọn** và cho phép xem trước yêu cầu của khách đang đợi để chuẩn bị món. Có thể chiên sẵn, đặt vào khay chung, nhưng **không giao/thu tiền trước lượt**.
- Quy tắc khay thành phẩm chung, khớp đúng công thức và giao trọn đơn giữ nguyên. Chưa chốt giới hạn tổng hàng chờ, thời gian chờ hoặc cách trình bày cụ thể.

## Dữ liệu định danh khách NPC trên đơn hàng — 2026-10-25
- Mỗi đơn cung cấp `customerId` (định danh khách) và `customerName` (tên hiển thị) để UI dùng **tên khách NPC** làm tiêu đề thẻ đơn.
- Prototype được phép dùng tên mẫu. Chưa chốt danh sách tên, cách sinh NPC, chân dung hay đặc tính khách; không biến dữ liệu mẫu thành luật cuối.
- Chi tiết món/công thức vẫn xem trong chi tiết đơn; quy tắc FIFO và hai đơn chính không đổi.
