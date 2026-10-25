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
