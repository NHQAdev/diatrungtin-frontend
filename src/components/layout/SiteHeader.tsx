import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { loginUrl } from '../../features/auth/redirect';
import { useCart } from '../../features/cart/cart-store';
import { useCategories, useCurrentCustomer } from '../../lib/queries';
import type { CategoryNode } from '../../types/api';
import { BagIcon, ChevronDownIcon, CloseIcon, MenuIcon, UserIcon } from '../ui/icons';
import { Brand } from './Brand';
import { MAIN_NAV } from './nav';
import { SearchBox } from './SearchBox';

function childrenOf(categories: CategoryNode[] | undefined, slug?: string) {
  return slug ? (categories?.find((category) => category.slug === slug)?.children ?? []) : [];
}

export function SiteHeader() {
  const { count } = useCart();
  const { data: categories } = useCategories();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { data: customer } = useCurrentCustomer();
  // Guests go to the login page; logged-in customers to their account (shown by first name).
  const account = customer
    ? { to: '/tai-khoan', label: customer.fullName.trim().split(/\s+/).pop() || 'Tài khoản' }
    : { to: loginUrl(location.pathname + location.search), label: 'Đăng nhập' };

  // Close the mobile menu after navigating. Done while rendering (React's "adjust state when a
  // prop changes" pattern) instead of in an effect, so there is no extra render with the menu open.
  const locationKey = location.pathname + location.search;
  const [menuLocation, setMenuLocation] = useState(locationKey);
  if (menuLocation !== locationKey) {
    setMenuLocation(locationKey);
    setMenuOpen(false);
  }

  return (
    <header className="bg-surface">
      {/* ---------- Desktop ---------- */}
      <div className="mx-auto hidden max-w-[1440px] px-10 md:block">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 pt-7">
          <SearchBox id="search-desktop" className="w-full max-w-[318px]" />
          <Brand />
          <div className="flex items-center justify-end gap-6">
            <Link to={account.to} className="inline-flex items-center gap-2.5 rounded-md px-2 py-2 text-xl text-ink hover:text-brand">
              <UserIcon size={26} className="text-brand" />
              <span className="max-w-[180px] truncate">{account.label}</span>
            </Link>
            <Link to="/gio-hang" className="inline-flex items-center gap-3 rounded-md px-2 py-2 text-xl text-ink hover:text-brand">
              <BagIcon size={26} className="text-brand" />
              <span>Giỏ hàng ({count})</span>
            </Link>
          </div>
        </div>
        <nav aria-label="Menu chính" className="border-b border-line">
          <ul className="flex justify-center gap-[72px] pb-6 pt-7 text-xl">
            {MAIN_NAV.map((item) => {
              const sub = childrenOf(categories, item.categorySlug);
              return (
                <li key={item.label} className="group relative">
                  <NavLink to={item.to} className="inline-flex items-center gap-1.5 py-1 text-ink hover:text-brand">
                    {item.label}
                    {item.categorySlug && <ChevronDownIcon size={16} className="text-ink-muted" />}
                  </NavLink>
                  {sub.length > 0 && (
                    // Opens on hover and when a link inside gets keyboard focus.
                    <ul className="invisible absolute left-1/2 top-full z-20 min-w-48 -translate-x-1/2 rounded-md border border-line bg-surface py-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      {sub.map((child) => (
                        <li key={child.slug}>
                          <Link to={`/san-pham?category=${child.slug}`} className="block px-5 py-2.5 text-base text-ink hover:bg-surface-muted hover:text-brand">
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* ---------- Mobile ---------- */}
      <div className="px-4 pb-3 pt-3 md:hidden">
        <div className="grid grid-cols-[44px_1fr_44px] items-center min-[360px]:grid-cols-[88px_1fr_88px]">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center text-brand"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
          <Brand />
          <div className="flex justify-end">
          {/* Very narrow phones (<360px): no room beside the brand; the account link stays in the menu. */}
          <Link to={account.to} className="hidden h-11 w-11 place-items-center text-brand min-[360px]:grid" aria-label={account.label}>
            <UserIcon size={24} />
          </Link>
          <Link to="/gio-hang" className="relative grid h-11 w-11 place-items-center text-brand" aria-label={`Giỏ hàng, ${count} sản phẩm`}>
            <BagIcon size={24} />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-semibold text-on-brand">{count}</span>
            )}
          </Link>
          </div>
        </div>
        <SearchBox id="search-mobile" className="mt-3" />
        {menuOpen && (
          <nav id="mobile-menu" aria-label="Menu chính" className="mt-3 border-t border-line">
            <ul className="divide-y divide-line">
              {MAIN_NAV.map((item) => {
                const sub = childrenOf(categories, item.categorySlug);
                return (
                  <li key={item.label} className="py-1">
                    <Link to={item.to} className="block py-3 text-base font-medium text-ink">
                      {item.label}
                    </Link>
                    {sub.length > 0 && (
                      <ul className="mb-2 ml-4">
                        {sub.map((child) => (
                          <li key={child.slug}>
                            <Link to={`/san-pham?category=${child.slug}`} className="block py-2 text-sm text-ink-muted">
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              <li className="py-1">
                <Link to="/tra-cuu-don-hang" className="block py-3 text-base text-ink">Tra cứu đơn hàng</Link>
              </li>
              <li className="py-1">
                {customer ? (
                  <Link to="/tai-khoan" className="block py-3 text-base text-ink">Tài khoản của tôi</Link>
                ) : (
                  <span className="flex gap-6 text-base">
                    <Link to={account.to} className="py-3 font-medium text-brand">Đăng nhập</Link>
                    <Link to="/dang-ky" className="py-3 text-ink">Đăng ký</Link>
                  </span>
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
