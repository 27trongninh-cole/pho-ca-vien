# PHỐ VIÊN CHIÊN — ART DIRECTION
Version: 0.1 | 2026-10-25

## Phong cách
- Pixel art chibi Việt Nam, cảm hứng Kairosoft; tối ưu mobile và tái sử dụng sprite.
- Màn hình quán: isometric 3/4. Màn hình chế biến: top-down 90°.
- Giữ pixel sắc nét khi phóng to; không tự vẽ lại sprite đã có.

## Thư mục asset
```text
assets/
├── food/
│   ├── banhbao_trungca.png
│   ├── bovien.png
│   ├── hoanhthanh.png
│   ├── xucxich.png
│   ├── xoichien.png
│   ├── thanhcua.png
│   ├── daubap.png
│   ├── cavien.png
│   ├── trungcut.png
│   └── tomsurimi.png
├── skewer/
│   └── skewer_empty.png
├── cooking/
│   ├── stove/gas_stove.png
│   ├── pan/pan_base.png
│   ├── pan/pan_front_rim.png
│   └── effects/
│       ├── oil_bubbles.png
│       ├── oil_bubbles_v2.png
│       └── oil_bubbles_v3.png
└── prep/
    ├── prep_counter.png
    └── ingredient_tray_empty.png
```

## Kích thước và cách ghép đã thử
- 10 sprite thức ăn: 32×32 px mỗi sprite.
- `skewer_empty.png`: 32×136 px.
- Ghép thức ăn lên que tại (x,y)=(0,0),(0,21),(0,42),(0,63), không scale, vẽ que trước rồi đến thức ăn.
- Bếp gas/chảo: canvas thử 256×208 px. Bốn gốc đặt xiên tương đối: (48,24), (88,24), (128,24), (168,24). Cần đối chiếu PNG thực tế khi chỉnh layout.
- `prep_counter.png`: 256×272 px; `ingredient_tray_empty.png`: 40×40 px. Mười khay dùng chung một mẫu, ghép sprite thức ăn vào.
- Mặt dầu và ba sprite bong bóng được dùng như các lớp độc lập. Bong bóng luân phiên ba frame; tốc độ animation cần thống nhất khi triển khai, không liên quan đến điều khiển lửa vì UI chỉnh lửa đã bỏ.

## Layout mobile đã chốt
1. Đơn hàng (trên cùng)
2. Chảo dầu và bếp gas (giữa)
3. Bàn chế biến, 10 khay và khu vực xỏ xiên (dưới)

- Không có nút Nhỏ/Vừa/Lớn.
- Xiên đang chuẩn bị hiển thị **trên bàn**, không nằm bên phải ngoài bàn.
- Không thu nhỏ asset đến mức khó chạm; nếu cần, tối ưu bố cục/scroll trước.

## Quy tắc không được hiểu nhầm
- 10 hình thức ăn là **thư viện nguyên liệu**, không phải mười công thức bán cố định.
- Mỗi công thức do người chơi sáng tạo sẽ được biểu diễn bằng cách phối sprite nguyên liệu và thông tin từ hệ thống gameplay.
- 4 slot hiện tại chỉ là cấu trúc xiên prototype; mọi thay đổi giới hạn công thức phải do Gameplay chốt trước.
- Không tự tạo sprite mới cho từng tổ hợp công thức nếu có thể ghép runtime.

## Việc đồ họa tiếp theo
- Rà lại prototype trên màn hình điện thoại theo layout mới.
- Kiểm tra vùng chạm khay, vùng xỏ xiên, vị trí các lớp chảo/xiên/bong bóng.
- Khi Gameplay xác định UI sáng tạo công thức, thiết kế các thành phần bổ sung theo yêu cầu.

## Bố trí bàn chế biến — phương án A (thử nghiệm)
- Giữ xiên đang xỏ **đứng dọc 1:1** trên bàn, không xoay ngang khi chuẩn bị; không thu nhỏ sprite 32×136 px.
- Với canvas `prep_counter.png` 256×272 px, bố trí 10 khay 40×40 px: hàng 1 y=16, hàng 2 y=64; mỗi hàng có x=12,60,108,156,204.
- Xiên đang xỏ tại x=112, y=120, chiếm x=112..144, y=120..256. Hàng khay thứ hai kết thúc tại y=104, cách xiên 16 px; xiên cách đáy canvas 16 px.
- Tọa độ tính theo góc trái trên của canvas bàn, chưa kiểm tra viền/chi tiết trên sprite thực tế; cần kiểm tra trực quan trên prototype trước khi khóa.
- Giữ thao tác đưa xiên từ bàn lên chảo theo hướng dọc; không sửa asset gốc.

## Phong cách UI chế biến — đã chốt
- UI **tươi tắn, vui nhộn, dễ thương theo cảm hứng Kairosoft**, phù hợp không khí quán ăn vỉa hè Việt Nam; không dùng tông xanh xám tối của prototype làm phong cách cuối.
- Khung nền kem/vàng nhạt, viền nâu ấm; nút chính vàng cam; nút phụ xanh lá non hoặc xanh da trời dịu. Viền/bóng pixel sắc nét, chữ rõ trên điện thoại. Đây là định hướng màu, chưa khóa mã màu hay atlas UI.
- Giữ nguyên sprite chảo, bếp, bàn, khay và thức ăn đã có; chỉ thiết kế lớp UI phù hợp bao quanh.
- Cần bộ asset UI riêng: khung đơn hàng, nút Giao, ô thành phẩm, thùng rác, thanh tiến trình chiên và thông báo.
- Đề xuất bỏ nút Lùi/Hủy trên bàn, thay bằng thùng rác để bỏ que đang xỏ; tương tác và hậu quả về nguyên liệu do Gameplay xác nhận trước khi khóa.
- Giữ layout [Đơn hàng] → [Chảo dầu] → [Bàn chế biến]; cân nhắc tận dụng không gian trống và vùng chạm, không tự ý thu nhỏ sprite.

## Quy chuẩn UI tái sử dụng — đã chốt
- **Không vẽ riêng một PNG cho mỗi nút, chữ, khung hoặc nội dung.** Thiết kế khung/nút/ô chứa theo **9-slice (9-patch)** để thay đổi chiều rộng, chiều cao mà không biến dạng góc và viền pixel.
- Bộ cơ bản gồm: panel chung, nút chính, nút phụ, ô chứa; mỗi loại chỉ cần trạng thái cần thiết (mặc định/nhấn/vô hiệu hóa). Các icon có ý nghĩa riêng như thùng rác, dấu tích có thể là sprite độc lập.
- Nhãn nút, tên công thức người chơi tạo, số lượng, trạng thái đơn hàng phải là text render bằng code; tuyệt đối không đóng chữ vào PNG giao diện.
- Thanh tiến trình chiên là asset có thể thay đổi chiều dài và phần fill theo giá trị, không vẽ một sprite riêng cho mỗi phần trăm.
- Đồ họa pixel sắc nét: giữ góc 9-slice không scale méo; cạnh/giữa có thể lặp texture pixel thay vì stretch gây mờ.
- Khi thiết kế atlas/UI spec, cần chỉ rõ kích thước gốc, độ dày viền, vùng slice, padding chữ và kích thước chạm tối thiểu trên mobile.

## Bộ UI sprite v0.1 — đã duyệt (2026-10-25)
- Người dùng đã gửi `UI.zip` gồm 10 sprite. Chat Đồ họa đã kiểm tra hình thức, kích thước và thử 9-slice; **đã duyệt bộ UI v0.1 để tích hợp prototype**.
- Các file cần đặt tại:
  - `assets/ui/panels/panel_cream.png` (48×48, slice 12/12/12/12)
  - `assets/ui/buttons/button_primary_normal.png` (48×32, slice 8/8/8/8)
  - `assets/ui/buttons/button_primary_pressed.png` (48×32, slice 8/8/8/8)
  - `assets/ui/buttons/button_primary_disabled.png` (48×32, slice 8/8/8/8)
  - `assets/ui/buttons/button_secondary_normal.png` (48×32, slice 8/8/8/8)
  - `assets/ui/buttons/button_secondary_pressed.png` (48×32, slice 8/8/8/8)
  - `assets/ui/slots/slot_empty.png` (32×32, slice 8/8/8/8)
  - `assets/ui/progress/progress_track.png` (32×16, slice 6/5/6/5)
  - `assets/ui/progress/progress_fill.png` (32×16, slice 6/5/6/5)
  - `assets/ui/icons/icon_trash.png` (32×32, icon thường, không 9-slice)
- Thử 9-slice đã đạt: panel 48×48 → 240×100; nút 48×32 → 120×40; ô 32×32 → 80×70. Không được kéo giãn toàn bộ PNG làm méo góc.
- **Việc tiếp theo cho Claude Code:** tích hợp các sprite UI vào prototype, thay khung/nút HTML xanh xám bằng UI pixel art kem/cam/xanh, render chữ động bằng code, giữ layout [Đơn hàng] → [Chảo dầu] → [Bàn chế biến]. Không thay đổi logic đơn hàng, công thức hoặc thời gian chiên.
- Icon thùng rác thay thế vị trí nút Lùi/Hủy trên bàn về mặt UI; hành vi xóa xiên và hậu quả về nguyên liệu cần chat Gameplay xác nhận. Trong prototype có thể dùng hành vi hủy xiên hiện tại, không tự thêm luật hao hụt.
- Chỉ cập nhật tài liệu; **không có nghĩa là PNG đã được commit vào repo**. Claude cần kiểm tra đường dẫn file thực tế trước khi tích hợp.

## Cập nhật đã duyệt: nhiều đơn và khay thành phẩm — 2026-10-25
- **Bố cục mobile mới được chủ dự án duyệt về nguyên tắc:** [Thẻ nhiều đơn cuộn ngang] → [Chảo dầu] → [Khay thành phẩm chung] → [Bàn chế biến]. Bố cục này thay thế thứ tự ba khu vực cũ, không thay sprite bếp/chảo/bàn hiện có.
- **Đơn hàng:** thẻ cuộn ngang, mỗi thẻ có mã đơn, tiến độ đủ/thiếu món và nút Giao riêng. Chạm thẻ để xem chi tiết; nội dung được render động, nền dùng bộ UI 9-slice đã duyệt.
- **Khay thành phẩm chung:** dải ngang ngay dưới chảo, dùng các ô UI tái sử dụng; chứa món đã chín không gán trước cho khách. Kích thước, số ô và cách cuộn cần thử trên màn hình điện thoại trước khi khóa.
- **Tương tác xiên chín → khay đã được Gameplay xác nhận HYBRID:** chạm xiên chín để tự chuyển vào khay, hoặc kéo thả.
- **Xem món trong khay:** chạm món để mở chi tiết tên công thức và các thuộc tính phân biệt (thành phần/hương vị khi có); không dựa vào hình sprite đơn thuần để phân biệt công thức.
- **Không tự đặt giới hạn** số đơn, sức chứa khay, thời gian chờ hay luật hao hụt; các quy tắc này thuộc Gameplay và chưa chốt.
- **Cần kiểm tra khi triển khai:** độ cao tổng giao diện mobile, vùng chạm, cuộn ngang thẻ đơn và khay, vùng chuyển xiên từ chảo vào khay. Không tự sửa PNG gốc.
- **Asset mới:** trước tiên thử dựng khay thành phẩm từ panel/slot 9-slice hiện có. Chỉ vẽ thêm sprite nền khay nếu bản ghép thử cho thấy thật sự cần.

## Điều chỉnh mới nhất được chủ dự án duyệt — 2026-10-25: FIFO và khay cạnh chảo
- **Thay thế các phương án thẻ đơn cuộn ngang và khay nằm dưới chảo nêu ở mục trước.** Bố cục mới: **[2 đơn chính + hàng chờ thu gọn] → [Chảo dầu | Khay thành phẩm chung] → [Bàn chế biến]**. Dấu `|` nghĩa là hai khu vực đặt cạnh nhau trên cùng một hàng.
- **Vùng đơn:** hiển thị rõ hai đơn chính, có trạng thái đủ/thiếu món và trạng thái lượt giao; hàng chờ phía sau thu gọn, có thể mở xem món để chuẩn bị trước. Nội dung dùng panel 9-slice và chữ động, không vẽ chữ cố định vào PNG.
- **FIFO:** chỉ đơn đứng đầu hàng được bấm Giao/thu tiền khi đủ món. Đơn thứ hai dù đủ món vẫn hiển thị chờ lượt, không cho giao vượt. Khi đơn đầu hoàn tất, hàng chờ tiến lên. Đây là quy tắc Gameplay, Đồ họa chỉ thể hiện trạng thái tương ứng.
- **Chảo + khay cùng hàng:** giữ nguyên sprite chảo/bếp và bốn vị trí xiên của prototype; khay thành phẩm nằm bên cạnh, tận dụng panel/slot 9-slice hiện có. Hai khoảng trống cạnh bàn chế biến tạm để trống.
- **Tương tác giữ nguyên:** xiên chín → khay bằng chạm hoặc kéo thả (HYBRID); chạm món trong khay để xem công thức/thành phần/hương vị, kể cả khi sprite giống nhau.
- **Cần kiểm thử thực tế trên mobile trước khi khóa tọa độ:** sprite chảo gốc rộng 256 px; khi đặt khay cạnh chảo không được thu nhỏ chảo/xiên đến mức khó chạm hoặc làm mờ pixel. Thử kích thước vùng chảo, khay, khoảng cách, scrolling và thao tác kéo. Không khóa chiều rộng khay, tỷ lệ hiển thị hay số slot khi chưa có ảnh prototype.
- **Chưa chốt:** số người tối đa trong hàng chờ, sức chứa khay, thời gian chờ và kích thước pixel cuối. Không tự thêm quy tắc Gameplay.

## Khay thành phẩm nhỏ gọn, xiên xếp chồng — chủ dự án xác nhận 2026-10-25
- **Không cần hiển thị mỗi xiên thành một ô nằm ngang.** Khay thành phẩm đặt cạnh chảo có thể nhỏ vì các xiên đã chín **xếp chồng/lệch lớp** trong cùng khay, giống khay đựng đồ chiên thực tế.
- Ưu tiên giữ chảo và bốn vị trí chiên đủ lớn, dễ chạm; khay chiếm ít chiều ngang hơn so với phương án dãy slot trước đó.
- Xiên trong khay có thể lệch vài pixel để gợi số lượng; không dựa vào số xiên nhìn thấy để thể hiện chính xác toàn bộ món khi bị che khuất.
- Chạm khay mở danh sách/chi tiết món và số lượng để người chơi phân biệt các công thức, kể cả khi sprite trùng nhau. Đây là đề xuất cách thể hiện chi tiết, chưa khóa kiểu popup.
- Giữ thao tác chạm hoặc kéo xiên chín vào khay; chưa khóa kích thước khay, sức chứa hay quy tắc xếp lớp.
