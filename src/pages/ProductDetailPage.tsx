import { Link, useParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowLink } from '../components/ui/ArrowLink';
import { Container } from '../components/ui/Container';
import { StatusMessage } from '../components/ui/StatusMessage';
import { PAGE, pageUrl } from '../config/merchandising';
import { ProductGallery } from '../features/product/ProductGallery';
import { PurchasePanel } from '../features/product/PurchasePanel';
import { ApiError } from '../lib/api';
import { useProduct, useProducts } from '../lib/queries';
import type { ProductDetail } from '../types/api';
import { NotFoundPage } from './NotFoundPage';

// Product page, following the approved Figma frame:
// breadcrumb · gallery | purchase panel · section tabs · details + specs · size banner ·
// usage/shipping accordions · related products.

const SECTIONS = [
  { id: 'chi-tiet', label: 'Chi tiết sản phẩm' },
  { id: 'chon-size', label: 'Hướng dẫn chọn size' },
  { id: 'bao-quan', label: 'Sử dụng & bảo quản' },
  { id: 'giao-hang', label: 'Giao hàng & đổi trả' },
];

export function ProductDetailPage() {
  const { slug = '' } = useParams();
  const { data: product, isPending, error, refetch } = useProduct(slug);

  if (error instanceof ApiError && error.status === 404) return <NotFoundPage />;
  if (error) {
    return (
      <Container className="py-16">
        <StatusMessage kind="error" action={<button type="button" className="text-sm font-semibold underline" onClick={() => refetch()}>Thử lại</button>}>
          {error.message}
        </StatusMessage>
      </Container>
    );
  }
  if (isPending) {
    return (
      <Container className="py-16">
        <StatusMessage kind="loading">Đang tải sản phẩm…</StatusMessage>
      </Container>
    );
  }
  return <ProductView product={product} />;
}

function ProductView({ product }: { product: ProductDetail }) {
  const hasBeadOption = product.variants.some((variant) => variant.maxExtraBeads > 0 || 'bead_size_mm' in variant.options);
  const specs = [{ label: 'Chất liệu', value: product.material ?? '[Cập nhật]' }, ...product.specs];

  return (
    <>
      <title>{`${product.seo.title} | Trầm Hương Địa Trung Tín`}</title>
      {product.seo.description && <meta name="description" content={product.seo.description} />}

      <Container className="pt-5 md:pt-7">
        <nav aria-label="Đường dẫn" className="text-sm text-ink md:text-xl">
          <ol className="flex flex-wrap gap-1.5 md:gap-2.5">
            <li><Link to="/" className="-my-3 inline-block py-3 hover:text-brand md:my-0 md:py-0">Trang chủ</Link></li>
            {product.breadcrumb.map((crumb) => (
              <li key={crumb.slug}>
                / <Link to={`/san-pham?category=${crumb.slug}`} className="-my-3 inline-block py-3 hover:text-brand md:my-0 md:py-0">{crumb.name}</Link>
              </li>
            ))}
            <li aria-current="page" className="sr-only md:not-sr-only">/ {product.name}</li>
          </ol>
        </nav>

        <div className="mt-5 grid gap-8 md:mt-8 md:grid-cols-[700fr_612fr] md:gap-12">
          <ProductGallery images={product.images} productName={product.name} />
          <PurchasePanel product={product} />
        </div>

        {/* In-page tabs: jump to each section below. */}
        <nav aria-label="Nội dung sản phẩm" className="mt-10 border-b border-line md:mt-12">
          <ul className="grid grid-cols-2 text-center text-sm font-semibold md:grid-cols-4 md:text-xl md:font-medium">
            {SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={`flex h-full items-center justify-center px-2 py-3 md:py-4 ${index === 0 ? 'border-b-2 border-brand text-brand' : 'text-ink hover:text-brand'}`}>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section id="chi-tiet" className="mt-8 grid scroll-mt-6 gap-6 md:mt-10 md:grid-cols-[592fr_728fr] md:gap-10" aria-labelledby="details-title">
          <div>
            <h2 id="details-title" className="font-serif text-[26px] leading-tight text-brand md:text-[40px]">Chi tiết sản phẩm</h2>
            {product.description ? (
              <div className="mt-3 space-y-3 text-[15px] leading-6 text-ink md:text-xl md:leading-8">
                {product.description.split(/\n\s*\n/).map((paragraph, i) => <p key={i} className="whitespace-pre-line">{paragraph}</p>)}
              </div>
            ) : (
              <p className="mt-3 text-[15px] text-ink-muted">[Cập nhật] mô tả sản phẩm.</p>
            )}
            <table className="mt-5 w-full border-collapse text-sm md:text-lg">
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.label}>
                    <th scope="row" className="w-2/5 border border-line px-3 py-2 text-left font-medium text-ink">{spec.label}</th>
                    <td className="border border-line px-3 py-2 text-ink">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {product.images[1] && (
            <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[260px]">
              <img src={product.images[1].url} alt={product.images[1].alt ?? ''} loading="lazy" className="absolute inset-0 h-full w-full bg-surface-muted object-cover" />
            </div>
          )}
        </section>

        <section id="chon-size" className="mt-8 grid scroll-mt-6 overflow-hidden bg-surface-muted md:mt-10 md:min-h-[144px] md:grid-cols-[616fr_744fr]" aria-labelledby="size-title">
          <div className="relative aspect-[16/7] md:aspect-auto">
            <img src="/images/guide-wrist-measure.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full bg-surface-muted object-cover" />
          </div>
          <div className="flex flex-col justify-center px-6 py-6 md:px-10">
            <h2 id="size-title" className="font-serif text-[24px] leading-tight text-brand md:text-[40px]">Chọn kích thước vừa vặn</h2>
            {hasBeadOption && <p className="mt-2 text-sm text-ink-muted md:text-base">Cổ tay lớn hơn cỡ tiêu chuẩn? Chọn thêm hạt ở phần mua hàng.</p>}
            <ArrowLink to={pageUrl(PAGE.sizeGuide)} className="mt-3 self-start">Xem cách đo cổ tay</ArrowLink>
          </div>
        </section>

        <div className="mt-6 divide-y divide-line border-y border-line md:mt-8">
          <details id="bao-quan" className="group scroll-mt-6">
            <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-4 text-base font-semibold text-ink md:px-5 md:text-[22px]">
              Sử dụng & bảo quản <span aria-hidden="true" className="text-lg group-open:rotate-45">+</span>
            </summary>
            <div className="px-2 pb-4 text-sm leading-6 text-ink md:px-5 md:text-lg md:leading-8">
              {product.usageGuide ? <p className="whitespace-pre-line">{product.usageGuide}</p> : <ArrowLink to={pageUrl(PAGE.care)}>Xem hướng dẫn sử dụng & bảo quản</ArrowLink>}
            </div>
          </details>
          <details id="giao-hang" className="group scroll-mt-6">
            <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-4 text-base font-semibold text-ink md:px-5 md:text-[22px]">
              Giao hàng & đổi trả <span aria-hidden="true" className="text-lg group-open:rotate-45">+</span>
            </summary>
            <div className="space-y-2 px-2 pb-4 text-sm leading-6 text-ink md:px-5 md:text-lg md:leading-8">
              <p>Thanh toán khi nhận hàng (COD).</p>
              <p className="flex flex-wrap gap-x-6 gap-y-2">
                <ArrowLink to={pageUrl(PAGE.shipping)}>Chính sách giao hàng</ArrowLink>
                <ArrowLink to={pageUrl(PAGE.returns)}>Chính sách đổi trả</ArrowLink>
              </p>
            </div>
          </details>
        </div>

        <RelatedProducts product={product} />
      </Container>
    </>
  );
}

function RelatedProducts({ product }: { product: ProductDetail }) {
  const category = product.breadcrumb[0]?.slug;
  const { data } = useProducts({ category, pageSize: 4 });
  const related = (data?.data ?? []).filter((item) => item.id !== product.id).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 md:mt-14" aria-labelledby="related-title">
      <h2 id="related-title" className="mb-5 font-serif text-[28px] leading-tight text-brand md:mb-6 md:text-[44px]">Khám phá thêm từ trầm</h2>
      <div className="grid gap-6 md:grid-cols-3 md:gap-10">
        {related.map((item) => <ProductCard key={item.id} product={item} layout="horizontal" />)}
      </div>
    </section>
  );
}
