import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '../ui/icons';
import { Brand } from './Brand';

/**
 * Minimal layout from the design for login, registration, email verification and the account
 * area: a back link, the centred wordmark, and a one-line footer. No shop navigation, so the
 * customer stays focused on the form.
 */
export function AuthLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isVerify = pathname.startsWith('/xac-minh-email');

  const back = isVerify ? (
    <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} className="inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-brand">
      <ArrowLeftIcon size={18} />
      <span className="hidden md:inline">Quay lại</span>
      <span className="sr-only md:hidden">Quay lại</span>
    </button>
  ) : (
    <Link to="/" className="inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-brand">
      <ArrowLeftIcon size={18} />
      <span className="hidden md:inline">Về cửa hàng</span>
      <span className="sr-only md:hidden">Về cửa hàng</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand">
        Bỏ qua tới nội dung chính
      </a>
      <header className="border-b border-line">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[44px_1fr_44px] items-center px-4 py-3 md:grid-cols-[160px_1fr_160px] md:px-[64px] md:py-4">
          {back}
          <Brand />
          <span aria-hidden="true" />
        </div>
      </header>
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line py-5 text-center text-sm font-medium text-ink-muted">Trầm Hương Địa Trung Tín</footer>
    </div>
  );
}
