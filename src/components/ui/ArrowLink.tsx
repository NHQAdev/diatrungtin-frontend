import { Link, type LinkProps } from 'react-router-dom';

/** "Xem chi tiết →" style link from the design: brand red, underlined, arrow. */
export function ArrowLink({ children, className = '', tone = 'brand', ...props }: LinkProps & { tone?: 'brand' | 'light' }) {
  const color = tone === 'light' ? 'text-on-brand decoration-on-brand/60' : 'text-brand decoration-brand/50 hover:text-brand-dark';
  return (
    <Link {...props} className={`inline-flex items-center gap-1 text-[15px] font-semibold underline decoration-1 underline-offset-[7px] md:text-xl md:underline-offset-[10px] ${color} ${className}`}>
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}
