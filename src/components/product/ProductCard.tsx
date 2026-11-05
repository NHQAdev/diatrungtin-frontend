import { Link } from 'react-router-dom';
import { formatVnd } from '../../lib/format';
import type { ProductCard as ProductCardData } from '../../types/api';
import { ArrowLink } from '../ui/ArrowLink';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';

/** Vertical product card: square photo, name, short line, "from" price, "Xem chi tiết →". */
export function ProductCard({ product, layout = 'vertical' }: { product: ProductCardData; layout?: 'vertical' | 'horizontal' }) {
  const href = `/san-pham/${product.slug}`;
  const image = (
    <Link to={href} tabIndex={-1} aria-hidden="true" className={`block overflow-hidden bg-surface-muted ${layout === 'horizontal' ? 'aspect-square w-28 shrink-0 md:w-[200px]' : 'aspect-[24/25]'}`}>
      {product.imageUrl ? (
        <img src={product.imageUrl} alt="" loading="lazy" className="h-full w-full bg-surface-muted object-cover transition duration-300 hover:scale-[1.03]" />
      ) : (
        <ImagePlaceholder />
      )}
    </Link>
  );

  return (
    <article className={layout === 'horizontal' ? 'flex gap-4' : 'flex flex-col'}>
      {image}
      <div className={layout === 'horizontal' ? 'min-w-0 pt-1' : 'pt-4'}>
        <h3 className="text-base font-semibold leading-snug text-ink md:text-2xl">
          <Link to={href} className="hover:text-brand">{product.name}</Link>
        </h3>
        {product.shortDescription && <p className="mt-1 line-clamp-1 text-xs text-ink-muted md:mt-1.5 md:text-base">{product.shortDescription}</p>}
        <p className="mt-1.5 text-lg font-bold text-ink md:mt-2 md:text-[28px]">
          {formatVnd(product.priceFrom)}
          {!product.inStock && <span className="ml-2 align-middle text-xs font-medium text-ink-muted">Hết hàng</span>}
        </p>
        <ArrowLink to={href} className="mt-1.5 md:mt-2" aria-label={`Xem chi tiết ${product.name}`}>Xem chi tiết</ArrowLink>
      </div>
    </article>
  );
}
