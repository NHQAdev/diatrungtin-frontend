# Tiến độ frontend

Cập nhật: 2026-11-05.

## Đã có (kết nối API thật)

- Khung dự án gồm Vite, TypeScript strict, Tailwind 4 (design token theo màu và font đã duyệt) và ESLint. Khi dev, proxy `/api` và `/uploads` sang backend.
- Header và footer dựng theo Figma đã export:
  - Desktop: tìm kiếm, thương hiệu, giỏ hàng, menu danh mục có dropdown.
  - Mobile: nút menu mở drawer, ô tìm kiếm riêng một hàng.
- Trang chủ `/`:
  - Hero.
  - Mục "Bạn đang tìm gì?".
  - Hai khối sản phẩm có tab (Trang sức, Nhang trầm).
  - Ba banner: Trẻ em, Quà tặng, Câu chuyện.
  - Mục "Chọn và chăm trầm".
- Danh sách sản phẩm `/san-pham`:
  - Lọc theo `category`, `collection` và `q`.
  - Sắp xếp và phân trang.
  - Đủ trạng thái loading, rỗng và lỗi.
  - Trang này chưa có thiết kế Figma nên được dựng theo cùng phong cách.
- Chi tiết sản phẩm `/san-pham/:slug`:
  - Gallery có phóng to.
  - Chọn phiên bản: chip hết hàng bị khóa; giá và tồn kho cập nhật theo phiên bản đã chọn.
  - Chọn "Thêm hạt" theo D2.
  - Chọn số lượng, nút "Thêm vào giỏ" và "Mua ngay".
  - Tab neo tới từng phần, bảng thông số, banner chọn size, accordion, sản phẩm liên quan.
- Trang nội dung `/trang/:slug`.
- Logic chọn phiên bản thuần (`src/features/product/variant-selection.ts`) có test (`npm test`).

## Sai khác có chủ đích so với Figma

- Figma dùng "Chu vi cổ tay 15/16/17 cm". Code dùng "Thêm hạt (cho cổ tay lớn)" theo quyết định D2. **Cần chủ dự án xác nhận.**
- Đã bỏ chú thích "Giá minh họa / Mẫu minh họa" vì giá lấy từ dữ liệu thật.
- Tiêu đề khối chi tiết dùng chữ chung "Chi tiết sản phẩm". Câu "Vẻ đẹp trong từng vân gỗ." trong Figma là nội dung riêng của từng sản phẩm, chưa có trường dữ liệu.
- Ảnh trong `public/images` tạm cắt từ file Figma, độ phân giải thấp. Cần thay bằng ảnh gốc.

## Đang chờ

- Giỏ hàng, thanh toán, kết quả đặt hàng, tra cứu đơn, đăng nhập/đăng ký, tài khoản: route vẫn hiển thị "Màn hình đang được xây dựng".
- Khu quản trị `/admin`.

## Đã kiểm tra

- `tsc -p tsconfig.app.json --noEmit`: không lỗi. Test `variant-selection` đạt 6/6.
- Chụp màn hình (render tĩnh với dữ liệu mẫu, font thay thế) ở 1440px và 390px, so với ảnh export Figma: trang chủ và chi tiết sản phẩm.
- Chưa chạy `npm run dev`, `npm run build` và `lint` trên máy thật.
