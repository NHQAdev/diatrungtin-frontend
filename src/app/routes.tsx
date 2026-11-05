import type { RouteObject } from 'react-router-dom';
import { SiteLayout } from '../components/layout/SiteLayout';
import { ContentPage } from '../pages/ContentPage';
import { ErrorPage } from '../pages/ErrorPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PendingPage } from '../pages/PendingPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ProductListPage } from '../pages/ProductListPage';

// Vietnamese URLs. Paths used in backend emails must not change:
//   /don-hang/:code?token=…   (order confirmation)
//   /dat-lai-mat-khau?token=… (password reset)
export const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/san-pham', element: <ProductListPage /> },
      { path: '/san-pham/:slug', element: <ProductDetailPage /> },
      { path: '/gio-hang', element: <PendingPage title="Giỏ hàng" /> },
      { path: '/thanh-toan', element: <PendingPage title="Thanh toán" /> },
      { path: '/don-hang/:code', element: <PendingPage title="Đơn hàng" /> },
      { path: '/tra-cuu-don-hang', element: <PendingPage title="Tra cứu đơn hàng" /> },
      { path: '/dang-nhap', element: <PendingPage title="Đăng nhập" /> },
      { path: '/dang-ky', element: <PendingPage title="Đăng ký" /> },
      { path: '/quen-mat-khau', element: <PendingPage title="Quên mật khẩu" /> },
      { path: '/dat-lai-mat-khau', element: <PendingPage title="Đặt lại mật khẩu" /> },
      { path: '/tai-khoan', element: <PendingPage title="Tài khoản" /> },
      { path: '/trang/:slug', element: <ContentPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  // The admin area (/admin/*) gets its own layout later.
];

