// Dữ liệu & cấu hình (chỉnh thông số tại đây)
const PVC={
 FOODS:[['banhbao_trungca','Bánh bao'],['bovien','Bò viên'],['hoanhthanh','Hoành thánh'],['xucxich','Xúc xích'],['xoichien','Xôi chiên'],['thanhcua','Thanh cua'],['daubap','Đậu bắp'],['cavien','Cá viên'],['trungcut','Trứng cút'],['tomsurimi','Tôm surimi']].map(([id,name])=>({id,name,src:`assets/food/${id}.png`})),
 SKEWER:{w:32,h:136,ys:[0,21,42,63],max:4},
 SLOTS:[[52,24],[92,24],[132,24],[172,24]], // lệch +4px x so với giả thuyết (48..168) để cân tâm chảo
 FRY:{cook:6,burn:7,bub:180}, // giây — TẠM, do Gameplay chốt; không còn điều chỉnh lửa
 PREP:{trayX:[12,60,108,156,204],trayY:[16,64],skewer:[112,120]}, // phương án A (ART_DIRECTION)
 TEST:{queue:4,qtyMax:2}, // GIẢ LẬP: số khách ban đầu & số lượng/đơn chỉ để thử, không phải luật; chưa chốt giới hạn khách, sức chứa khay, thời gian chờ
 IMG:['skewer/skewer_empty','cooking/stove/gas_stove','cooking/pan/pan_base','cooking/pan/pan_front_rim','cooking/effects/oil_bubbles','cooking/effects/oil_bubbles_v2','cooking/effects/oil_bubbles_v3','prep/prep_counter','prep/ingredient_tray_empty']
};
