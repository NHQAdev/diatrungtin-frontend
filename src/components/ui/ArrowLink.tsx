import { Link, type LinkProps } from 'react-router-dom';

/**
 * "Xem chi tiết →" style link from the design: brand red with one continuous line under text and arrow.
 * On mobile the link gets extra invisible vertical padding (cancelled by negative margin) so the tap
 * target is ~44px tall without changing the layout.
 */
export function ArrowLink({ children, className = '', tone = 'brand', ...props }: LinkProps & { tone?: 'brand' | 'light' }) {
  const color = tone === 'light' ? 'text-on-brand border-on-brand/60' : 'text-brand border-brand/50 hover:text-brand-dark hover:border-brand-dark';
  return (
    <Link {...props} className={`group -my-2.5 inline-block py-2.5 text-[15px] font-semibold md:my-0 md:py-0 md:text-xl ${color} ${className}`}>
      <span className="border-b border-inherit pb-1 md:pb-2">
        {children}
        {' '}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
