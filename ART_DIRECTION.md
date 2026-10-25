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
