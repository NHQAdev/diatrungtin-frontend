import { Link } from 'react-router-dom';
import { useStoreInfo } from '../../lib/queries';

const orPending = (value: string | null | undefined) => value || '[Cập nhật]';

// TEMPORARY footer: contact info comes from /api/store; missing values show "[Cập nhật]".
export function SiteFooter() {
  const { data: store } = useStoreInfo();
  return (
    <footer className="mt-16 bg-brand-dark text-on-brand">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-semibold">{store?.storeName ?? 'Trầm Hương Địa Trung Tín'}</p>
          <p className="mt-2 text-sm opacity-90">{orPending(store?.businessInfo)}</p>
        </div>
        <address className="text-sm not-italic leading-7">
          <p>Hotline: {orPending(store?.hotline)}</p>
          <p>Email: {orPending(store?.email)}</p>
          <p>Địa chỉ: {orPending(store?.address)}</p>
        </address>
        <ul className="text-sm leading-7">
          <li><Link className="hover:underline" to="/trang/chinh-sach-doi-tra">Chính sách đổi trả</Link></li>
          <li><Link className="hover:underline" to="/trang/chinh-sach-giao-hang">Chính sách giao hàng</Link></li>
          <li><Link className="hover:underline" to="/trang/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
          <li><Link className="hover:underline" to="/tra-cuu-don-hang">Tra cứu đơn hàng</Link></li>
        </ul>
      </div>
    </footer>
  );
}
