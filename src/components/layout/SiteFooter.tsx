import { Link } from 'react-router-dom';
import { PAGE, pageUrl } from '../../config/merchandising';
import { useStoreInfo } from '../../lib/queries';
import { Brand } from './Brand';

const orPending = (value: string | null | undefined) => (value && value.trim() ? value : '[Cập nhật]');
/** Only real http(s) links become clickable; placeholders stay plain text. */
const isUrl = (value: string | null | undefined): value is string => !!value && /^https?:\/\/\S+$/.test(value.trim());

const COLUMNS = [
  {
    title: 'Chăm sóc khách hàng',
    links: [
      { label: 'Hướng dẫn mua hàng', to: pageUrl(PAGE.howToBuy) },
      { label: 'Thanh toán & vận chuyển', to: pageUrl(PAGE.shipping) },
      { label: 'Đổi trả & bảo hành', to: pageUrl(PAGE.returns) },
      { label: 'Chính sách bảo mật', to: pageUrl(PAGE.privacy) },
      { label: 'Tra cứu đơn hàng', to: '/tra-cuu-don-hang' },
    ],
  },
  {
    title: 'Tìm hiểu về trầm',
    links: [
      { label: 'Hướng dẫn đo vòng tay', to: pageUrl(PAGE.sizeGuide) },
      { label: 'Sử dụng & bảo quản', to: pageUrl(PAGE.care) },
      { label: 'Câu chuyện Địa Trung Tín', to: pageUrl(PAGE.story) },
    ],
  },
];

export function SiteFooter() {
  const { data: store } = useStoreInfo();
  const social = [
    { label: 'Facebook', url: store?.facebookUrl },
    { label: 'Zalo', url: store?.zaloUrl },
  ];

  return (
    <footer className="mt-16 bg-brand-dark text-on-brand md:mt-12">
      <div className="mx-auto max-w-[1440px] px-4 pb-6 pt-10 md:px-12 md:pb-8 md:pt-14">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1.3fr_1.3fr_1.1fr]">
          <div>
            <Brand tone="light" size="sm" />
            <address className="mt-4 space-y-2 text-sm not-italic opacity-90 md:mt-5 md:space-y-3 md:text-lg">
              <p>Địa chỉ: {orPending(store?.address)}</p>
              <p>Hotline: {orPending(store?.hotline)}</p>
              <p>Email: {orPending(store?.email)}</p>
            </address>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-base font-semibold md:text-[22px]">{column.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm opacity-90 md:mt-5 md:space-y-3 md:text-xl">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:underline">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="text-base font-semibold md:text-[22px]">Kết nối với chúng tôi</h2>
            <ul className="mt-4 space-y-2.5 text-sm opacity-90 md:mt-5 md:space-y-3 md:text-xl">
              {social.map((item) => (
                <li key={item.label}>
                  {isUrl(item.url) ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.label}</a>
                  ) : (
                    <span>{item.label} [Cập nhật]</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-on-brand/40 pt-5 text-xs opacity-90 md:mt-12 md:grid md:grid-cols-2 md:pt-7 md:text-lg">
          <p>© {new Date().getFullYear()} {store?.storeName ?? 'Trầm Hương Địa Trung Tín'}.</p>
          <p>Thông tin doanh nghiệp: {orPending(store?.businessInfo)}</p>
        </div>
      </div>
    </footer>
  );
}
