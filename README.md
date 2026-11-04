# diatrungtin-frontend

Website bán hàng và trang quản trị cho Trầm Hương Địa Trung Tín. React 19 + TypeScript + Vite + Tailwind CSS 4, React Router, TanStack Query.

Backend: `C:\repos\diatrungtin-backend` (API: `docs/API.md` bên backend).

## Chạy local

```bash
npm install
npm run dev        # http://localhost:5173
```

Cần backend chạy ở `http://localhost:4000` (`npm run dev` bên backend). Vite chuyển tiếp `/api` và `/uploads` sang backend, nên không cần cấu hình CORS khi dev. Backend khác cổng: đặt `VITE_DEV_BACKEND=http://localhost:xxxx`.

## Kiểm tra

```bash
npm run typecheck
npm run lint
npm run build
```

## Cấu trúc

```
src/
  app/            router
  components/     thành phần giao diện dùng chung (layout, nút, ô nhập…)
  features/       logic theo nghiệp vụ (cart…)
  lib/            api client, định dạng tiền/ngày, query dùng chung
  pages/          màn hình theo route
  types/          kiểu dữ liệu trả về từ API
  index.css       design token (màu, font)
```

## Quy ước

- URL tiếng Việt không dấu: `/san-pham/:slug`, `/gio-hang`, `/thanh-toan`… Hai đường dẫn dùng trong email của backend không được đổi: `/don-hang/:code?token=…`, `/dat-lai-mat-khau?token=…`.
- Giá luôn lấy từ API (`/api/checkout/quote`); giỏ hàng chỉ lưu lựa chọn.
- Thông tin cửa hàng chưa có hiển thị **[Cập nhật]**.
