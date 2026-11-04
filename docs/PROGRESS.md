# Tiến độ frontend

Cập nhật: 2026-11-05.

## Đã có

- Khung dự án (Vite, TypeScript strict, Tailwind 4, ESLint), proxy `/api` sang backend khi dev.
- Design token theo thông số đã duyệt: nền `#F7F2EA`/`#EEE7DE`, đỏ trầm `#811F1C`/`#651714`, chữ `#2F211C`/`#6B5C53`, viền `#D3C6B9`, chữ trên nền đậm `#FFF8EE`; font Noto Serif (tiêu đề), Be Vietnam Pro (nội dung).
- API client (cookie, lỗi tiếng Việt, lỗi theo trường), kiểu dữ liệu khớp backend, giỏ hàng localStorage (đồng bộ nhiều tab).
- Router đủ các trang; header/footer **tạm**; trang nội dung chính sách (`/trang/:slug`) chạy với API thật.

## Đang chờ

- **Thiết kế Figma:** chưa đọc được (gói Figma Starter đã dùng hết 6 lượt gọi MCP của tháng). Cần ảnh export các frame đã duyệt.
- Các route đang hiển thị "Màn hình đang được xây dựng": trang chủ, danh mục, chi tiết sản phẩm, giỏ hàng, thanh toán, đơn hàng, tra cứu, đăng nhập/đăng ký, tài khoản.

## Đã kiểm tra

- `tsc` chạy với thư viện của repo FE cũ (cùng phiên bản): chỉ còn lỗi do `@tanstack/react-query` chưa được cài. Chưa chạy `npm run dev`/`build`.
