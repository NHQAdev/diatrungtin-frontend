import { useState } from 'react';
import { Link, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BagIcon, LockIcon, LogoutIcon, UserIcon } from '../components/ui/icons';
import { StatusMessage } from '../components/ui/StatusMessage';
import { BusinessSection } from '../features/account/BusinessSection';
import { OrdersSection } from '../features/account/OrdersSection';
import { PasswordSection } from '../features/account/PasswordSection';
import { ProfileSection } from '../features/account/ProfileSection';
import { initials } from '../features/auth/mask';
import { useSetCurrentCustomer } from '../features/auth/session';
import { api } from '../lib/api';
import { useCurrentCustomer } from '../lib/queries';

type Section = 'profile' | 'orders' | 'password';

const NAV: { section: Section; to: string; label: string; Icon: typeof UserIcon }[] = [
  { section: 'profile', to: '/tai-khoan', label: 'Hồ sơ', Icon: UserIcon },
  { section: 'orders', to: '/tai-khoan/don-hang', label: 'Đơn hàng', Icon: BagIcon },
  { section: 'password', to: '/tai-khoan/doi-mat-khau', label: 'Đổi mật khẩu', Icon: LockIcon },
];

export function AccountPage({ section }: { section: Section }) {
  const { data: customer, isPending, isError, refetch } = useCurrentCustomer();
  const location = useLocation();
  const navigate = useNavigate();
  const setCustomer = useSetCurrentCustomer();
  const [loggingOut, setLoggingOut] = useState(false);
  const notice = (location.state as { notice?: string } | null)?.notice;

  if (isPending) return <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-[64px]"><StatusMessage kind="loading">Đang tải tài khoản…</StatusMessage></div>;
  if (isError)
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-[64px]">
        <StatusMessage kind="error" action={<button type="button" onClick={() => refetch()} className="font-semibold underline">Thử lại</button>}>
          Chưa tải được tài khoản.
        </StatusMessage>
      </div>
    );
  if (!customer && !loggingOut) return <Navigate to={`/dang-nhap?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (!customer) return null;

  async function logout() {
    setLoggingOut(true);
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } catch {
      // Even if the request fails, forget the session on this device.
    }
    await setCustomer(null);
    navigate('/', { replace: true });
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex h-12 items-center gap-3 rounded-md px-4 text-[15px] font-semibold ${isActive ? 'bg-brand/10 text-brand' : 'text-ink hover:bg-surface-muted hover:text-brand'}`;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 md:px-[64px] md:pb-16 md:pt-10">
      <title>Tài khoản của tôi | Trầm Hương Địa Trung Tín</title>
      <meta name="robots" content="noindex" />

      <nav aria-label="Đường dẫn" className="text-sm font-medium text-ink-muted">
        <Link to="/" className="-my-3 inline-block py-3 hover:text-brand md:my-0 md:py-0">Trang chủ</Link> / <span aria-current="page">Tài khoản</span>
      </nav>
      <h1 className="mt-3 font-serif text-[34px] leading-tight text-brand md:text-[56px]">Tài khoản của tôi</h1>
      <p className="mt-2 text-[15px] text-ink-muted md:text-base">Quản lý hồ sơ, thông tin doanh nghiệp và đơn hàng.</p>

      {notice && (
        <p role="status" className="mt-5 rounded-md border border-[#3f6b4e]/30 bg-[#3f6b4e]/10 px-4 py-3 text-[15px] font-medium text-[#2f5a3d]">
          {notice}
        </p>
      )}
      {!customer.emailVerified && (
        <p className="mt-5 rounded-md border border-brand/30 bg-brand/5 px-4 py-3 text-[15px] text-brand">
          Email của bạn chưa được xác minh.{' '}
          <Link to="/xac-minh-email?next=%2Ftai-khoan" className="font-semibold underline underline-offset-4">
            Xác minh ngay
          </Link>
        </p>
      )}

      <div className="mt-6 md:mt-8 md:grid md:grid-cols-[280px_1fr] md:items-start md:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden rounded-lg border border-line bg-[#FFFBF4] p-4 md:block">
          <div className="flex items-center gap-3 border-b border-line px-1 pb-4 pt-1">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-[15px] font-semibold text-on-brand" aria-hidden="true">
              {initials(customer.fullName)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{customer.fullName}</p>
              <p className="truncate text-sm text-ink-muted">{customer.email}</p>
            </div>
          </div>
          <nav aria-label="Mục tài khoản" className="mt-3 space-y-1">
            {NAV.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} end className={navLinkClass}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            <button type="button" onClick={logout} disabled={loggingOut} className="flex h-12 w-full items-center gap-3 rounded-md px-4 text-[15px] font-semibold text-ink hover:bg-surface-muted hover:text-brand disabled:opacity-60">
              <LogoutIcon size={18} />
              {loggingOut ? 'Đang đăng xuất…' : 'Đăng xuất'}
            </button>
          </nav>
        </aside>

        {/* Mobile tabs */}
        <nav aria-label="Mục tài khoản" className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-line bg-[#FFFBF4] p-1 md:hidden">
          {NAV.slice(0, 2).map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `flex h-11 items-center justify-center gap-2 rounded-md text-[15px] font-semibold ${isActive ? 'bg-brand/10 text-brand' : 'text-ink'}`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-6">
          {section === 'profile' && (
            <>
              <ProfileSection key={customer.id} customer={customer} />
              <BusinessSection key={customer.id} customer={customer} />
            </>
          )}
          {section === 'orders' && <OrdersSection />}
          {section === 'password' && <PasswordSection />}
        </div>

        {/* Mobile: password and logout below the content, as in the design */}
        <div className="mt-6 flex items-center justify-between md:hidden">
          <NavLink to="/tai-khoan/doi-mat-khau" className={({ isActive }) => `inline-flex h-11 items-center gap-2 text-[15px] font-semibold ${isActive ? 'text-brand' : 'text-ink'}`}>
            <LockIcon size={18} />
            Đổi mật khẩu
          </NavLink>
          <button type="button" onClick={logout} disabled={loggingOut} className="inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ink disabled:opacity-60">
            <LogoutIcon size={18} />
            {loggingOut ? 'Đang đăng xuất…' : 'Đăng xuất'}
          </button>
        </div>
      </div>
    </div>
  );
}
