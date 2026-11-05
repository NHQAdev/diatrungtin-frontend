import { type ReactNode, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLink } from '../../components/ui/ArrowLink';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { ProductCard } from '../../components/product/ProductCard';
import { categoryUrl } from '../../config/merchandising';
import { useProducts } from '../../lib/queries';

interface Tab {
  label: string;
  categorySlug: string;
}

interface Props {
  title: string;
  allLink: string;
  tabs: Tab[];
  /** Editorial picture block placed next to the products. */
  feature: ReactNode;
  featureSide: 'left' | 'right';
}

/** Home section: title, sub-category tabs, two products and a large editorial picture. */
export function ProductTabsSection({ title, allLink, tabs, feature, featureSide }: Props) {
  const [active, setActive] = useState(0);
  const tab = tabs[active] ?? tabs[0]!;
  const { data, isPending, isError } = useProducts({ category: tab.categorySlug, pageSize: 2 });
  const id = useId();

  const products = (
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="grid grid-cols-2 gap-4 md:col-span-2 md:gap-6">
      {isPending &&
        [0, 1].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[24/25] bg-surface-muted" />
            <div className="mt-3 h-4 w-3/4 bg-surface-muted" />
            <div className="mt-2 h-4 w-1/2 bg-surface-muted" />
          </div>
        ))}
      {isError && <p className="col-span-2 text-sm text-ink-muted">Chưa tải được sản phẩm. Vui lòng thử lại sau.</p>}
      {data?.data.length === 0 && (
        <p className="col-span-2 text-sm text-ink-muted">
          Chưa có sản phẩm. <ArrowLink to={categoryUrl(tab.categorySlug)}>Xem danh mục</ArrowLink>
        </p>
      )}
      {data?.data.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );

  return (
    <section aria-labelledby={`${id}-title`} className="mt-14 md:mt-[72px]">
      <SectionTitle id={`${id}-title`} action={<ArrowLink to={allLink}>Xem toàn bộ</ArrowLink>}>
        {title}
      </SectionTitle>
      <div role="tablist" aria-label={title} className="mb-5 flex gap-6 text-[15px] md:mb-8 md:gap-8 md:text-xl">
        {tabs.map((item, index) => (
          <button
            key={item.categorySlug}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`${id}-panel`}
            onClick={() => setActive(index)}
            className={`py-1 font-medium ${index === active ? 'text-brand underline decoration-1 underline-offset-[7px]' : 'text-ink hover:text-brand'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-4 md:gap-6">
        {featureSide === 'left' ? (
          <>
            {feature}
            {products}
          </>
        ) : (
          <>
            {products}
            {feature}
          </>
        )}
      </div>
    </section>
  );
}

/** Large photo with a dark caption band (design: "Đeo theo cách của bạn.", "Hương cho không gian"). */
export function FeatureImage({ src, title, to }: { src: string; title: string; to: string }) {
  return (
    <Link to={to} className="group flex flex-col overflow-hidden bg-ink md:col-span-2">
      {/* The photo fills whatever height the product cards next to it have (desktop). */}
      <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-[240px] md:flex-1">
        <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full bg-surface-muted object-cover transition duration-500 group-hover:scale-[1.02]" />
      </div>
      <p className="whitespace-pre-line px-6 py-6 font-serif text-[26px] leading-tight text-on-brand md:px-8 md:py-9 md:text-[48px] md:leading-[1.15]">{title}</p>
    </Link>
  );
}
