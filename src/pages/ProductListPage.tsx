import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { Container } from '../components/ui/Container';
import { StatusMessage } from '../components/ui/StatusMessage';
import { type ProductListParams, useCategories, useCollections, useProducts } from '../lib/queries';

// Product listing for categories, collections and search. Everything lives in the URL
// (?category=…&sort=…&page=…) so filtered pages can be shared and the back button works.

const SORTS: { value: NonNullable<ProductListParams['sort']>; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'name_asc', label: 'Tên A → Z' },
];
const PAGE_SIZE = 12;

export function ProductListPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? undefined;
  const collection = params.get('collection') ?? undefined;
  const q = params.get('q') ?? undefined;
  const sortParam = params.get('sort');
  const sort = SORTS.some((s) => s.value === sortParam) ? (sortParam as ProductListParams['sort']) : 'newest';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const { data, isPending, isError, isPlaceholderData, refetch } = useProducts({ category, collection, q, sort, page, pageSize: PAGE_SIZE });
  const { data: categories } = useCategories();
  const { data: collections } = useCollections();

  // Title and sub-category chips from the current filter.
  const parent = categories?.find((c) => c.slug === category) ?? categories?.find((c) => c.children.some((child) => child.slug === category));
  const current = parent?.slug === category ? parent : parent?.children.find((child) => child.slug === category);
  const currentCollection = collections?.find((c) => c.slug === collection);
  const title = q ? `Kết quả cho “${q}”` : (current?.name ?? currentCollection?.name ?? 'Tất cả sản phẩm');

  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!('page' in changes)) next.delete('page'); // any filter change goes back to page 1
    setParams(next);
  };

  return (
    <Container className="pt-6 md:pt-8">
      <nav aria-label="Đường dẫn" className="text-sm text-ink-muted">
        <ol className="flex flex-wrap gap-1.5">
          <li><Link to="/" className="-my-3 inline-block py-3 hover:text-brand md:my-0 md:py-0">Trang chủ</Link></li>
          {parent && parent.slug !== category && (
            <li>/ <Link to={`/san-pham?category=${parent.slug}`} className="hover:text-brand">{parent.name}</Link></li>
          )}
          <li aria-current="page">/ <span className="text-ink">{title}</span></li>
        </ol>
      </nav>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-[30px] leading-tight text-brand md:text-[44px]">{title}</h1>
          {(current?.description ?? currentCollection?.description) && <p className="mt-2 max-w-2xl text-sm text-ink-muted">{current?.description ?? currentCollection?.description}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          Sắp xếp
          <select value={sort} onChange={(event) => update({ sort: event.target.value })} className="h-10 rounded-md border border-line bg-surface px-3 text-sm focus:border-brand focus:outline-none">
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {parent && parent.children.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Danh mục con">
          {[{ name: 'Tất cả', slug: parent.slug }, ...parent.children].map((item) => (
            <li key={item.slug}>
              <button
                type="button"
                onClick={() => update({ category: item.slug })}
                aria-pressed={item.slug === category}
                className={`h-10 rounded-md border px-4 text-sm font-medium ${item.slug === category ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface text-ink hover:border-brand'}`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8" aria-busy={isPending || isPlaceholderData}>
        {isPending && <StatusMessage kind="loading">Đang tải sản phẩm…</StatusMessage>}
        {isError && (
          <StatusMessage kind="error" action={<button type="button" className="text-sm font-semibold underline" onClick={() => refetch()}>Thử lại</button>}>
            Chưa tải được sản phẩm.
          </StatusMessage>
        )}
        {data && data.data.length === 0 && (
          <StatusMessage kind="empty" action={<Link to="/san-pham" className="text-sm font-semibold text-brand underline">Xem tất cả sản phẩm</Link>}>
            {q ? 'Không tìm thấy sản phẩm phù hợp. Thử từ khóa khác.' : 'Chưa có sản phẩm trong mục này.'}
          </StatusMessage>
        )}
        {data && data.data.length > 0 && (
          <>
            <p className="mb-4 text-sm text-ink-muted">{data.meta.total} sản phẩm</p>
            <div className={`grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-5 ${isPlaceholderData ? 'opacity-60' : ''}`}>
              {data.data.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            {data.meta.totalPages > 1 && (
              <nav aria-label="Phân trang" className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update({ page: String(n) })}
                    aria-current={n === page ? 'page' : undefined}
                    className={`h-10 min-w-10 rounded-md border px-3 text-sm ${n === page ? 'border-brand bg-brand text-on-brand' : 'border-line hover:border-brand'}`}
                  >
                    {n}
                  </button>
                ))}
              </nav>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
