import { Link } from 'react-router-dom';

/**
 * Two-line wordmark "TRẦM HƯƠNG / ĐỊA TRUNG TÍN". The footer version (size "sm") also shows the
 * shop's round stamp in a rounded square tile above the text; the header keeps the plain centred wordmark from the design.
 */
export function Brand({ tone = 'brand', size = 'lg', asLink = true }: { tone?: 'brand' | 'light'; size?: 'lg' | 'sm'; asLink?: boolean }) {
  const color = tone === 'light' ? 'text-on-brand' : 'text-brand';
  const content = (
    <span className={`flex ${size === 'lg' ? 'items-center justify-center' : 'flex-col items-start gap-4'} ${color}`}>
      {size === 'sm' && (
        <span className="block rounded-2xl bg-on-brand p-2 shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
          <img src="/images/logo-tile.png" alt="" width={180} height={180} className="h-24 w-24 md:h-28 md:w-28" />
        </span>
      )}
      <span className={`flex flex-col ${size === 'lg' ? 'items-center' : 'items-start'}`}>
        <span className={`font-sans font-medium uppercase ${size === 'lg' ? 'text-[10px] tracking-[0.35em] md:text-base' : 'text-[10px] tracking-[0.3em] md:text-sm'}`}>Trầm Hương</span>
        <span className={`whitespace-nowrap font-serif font-bold uppercase leading-tight ${size === 'lg' ? 'text-xl md:text-[44px]' : 'text-xl md:text-[28px]'}`}>Địa Trung Tín</span>
      </span>
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
