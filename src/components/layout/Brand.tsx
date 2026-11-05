import { Link } from 'react-router-dom';

/** Two-line wordmark from the design: small spaced "TRẦM HƯƠNG" over "ĐỊA TRUNG TÍN". */
export function Brand({ tone = 'brand', size = 'lg', asLink = true }: { tone?: 'brand' | 'light'; size?: 'lg' | 'sm'; asLink?: boolean }) {
  const color = tone === 'light' ? 'text-on-brand' : 'text-brand';
  const content = (
    <span className={`flex flex-col ${size === 'lg' ? 'items-center' : 'items-start'} ${color}`}>
      <span className={`font-sans font-medium uppercase ${size === 'lg' ? 'text-[11px] tracking-[0.35em] md:text-base' : 'text-[10px] tracking-[0.3em] md:text-sm'}`}>Trầm Hương</span>
      <span className={`font-serif font-bold uppercase leading-tight ${size === 'lg' ? 'text-[22px] md:text-[44px]' : 'text-xl md:text-[28px]'}`}>Địa Trung Tín</span>
    </span>
  );
  return asLink ? (
    <Link to="/" aria-label="Trầm Hương Địa Trung Tín — Trang chủ">
      {content}
    </Link>
  ) : (
    content
  );
}
