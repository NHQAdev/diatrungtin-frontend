import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../features/cart/cart-store';

// TEMPORARY header: structure from the brief (search, brand, cart, category menu).
// Visual details will be matched to the Figma design once it can be read.

const NAV = [
  { to: '/san-pham?category=trang-suc-tram-huong', label: 'Trang sức trầm hương' },
  { to: '/san-pham?category=nhang-tram', label: 'Nhang trầm' },
  { to: '/san-pham?collection=danh-cho-tre-em', label: 'Dành cho trẻ em' },
  { to: '/san-pham?collection=qua-tang', label: 'Quà tặng' },
];

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="font-serif text-xl font-semibold text-brand md:text-2xl">
          Trầm Hương Địa Trung Tín
        </Link>
        <Link to="/gio-hang" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-muted" aria-label={`Giỏ hàng, ${count} sản phẩm`}>
          Giỏ hàng ({count})
        </Link>
      </div>
      <nav aria-label="Danh mục sản phẩm" className="mx-auto max-w-7xl overflow-x-auto px-4 pb-3">
        <ul className="flex gap-6 whitespace-nowrap text-sm">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className="text-ink-muted hover:text-brand">
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
