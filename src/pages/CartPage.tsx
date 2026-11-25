import { Link, useNavigate } from 'react-router-dom';
import { InfoIcon, BagIcon, TrashIcon } from '../components/ui/icons';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { cart, useCart, type CartItem } from '../features/cart/cart-store';
import { CheckoutSteps } from '../features/cart/CheckoutSteps';
import { lineKey, useQuote } from '../features/cart/useQuote';
import { ApiError } from '../lib/api';
import { formatVnd } from '../lib/format';
import { useStoreInfo } from '../lib/queries';
import type { CartProblem, QuoteLine } from '../types/api';

const MAX_PER_LINE = 99;
const DASH = '—';

interface Row {
  item: CartItem;
  line: QuoteLine | undefined;
  problem: CartProblem | undefined;
}

function problemText(problem: CartProblem | undefined, quantity: number): string | null {
  if (!problem) return null;
  if (problem.reason === 'unavailable') return 'Sản phẩm không còn bán';
  if (problem.availableQuantity <= 0) return 'Hết hàng · Vui lòng xóa';
  return `Chỉ còn ${problem.availableQuantity} sản phẩm${quantity > problem.availableQuantity ? ' · Giảm số lượng' : ''}`;
}

export function CartPage() {
  const navigate = useNavigate();
  const { lines, count } = useCart();
  const requestItems = cart.toRequestItems(lines);
  const quote = useQuote(requestItems);
  const { data: store } = useStoreInfo();

  const quoteData = quote.data;
  const firstLoad = quote.isPending && lines.length > 0;
  const refreshing = quote.isFetching && !firstLoad;
  const failed = quote.isError && !quote.isFetching;
  const problems = quoteData?.problems ?? [];
  const blocking = problems.length > 0;
  const linesByKey = new Map((quoteData?.lines ?? []).map((line) => [lineKey(line), line]));
  const rows: Row[] = lines.map((item) => ({ item, line: linesByKey.get(lineKey(item)), problem: problems.find((p) => p.variantId === item.variantId) }));
  const showNumbers = !!quoteData && !firstLoad && !failed && !blocking;
  const canCheckout = showNumbers && !refreshing;

  const errorMessage =
    quote.error instanceof ApiError
      ? quote.error.code === 'STORE_NOT_CONFIGURED'
        ? 'Cửa hàng đang cập nhật phí giao hàng. Vui lòng quay lại sau ít phút.'
        : quote.error.status >= 400 && quote.error.status < 500
          ? quote.error.message
          : 'Chưa thể cập nhật giỏ hàng. Vui lòng kiểm tra kết nối và thử lại.'
      : 'Chưa thể cập nhật giỏ hàng. Vui lòng thử lại.';

  const summaryHint = firstLoad || refreshing ? 'Chờ giá cập nhật để thanh toán.' : failed ? 'Thử lại để xác nhận giá và tồn kho.' : blocking ? 'Cần xóa sản phẩm không khả dụng.' : null;
  const checkoutLabel = firstLoad || refreshing ? 'Đang cập nhật…' : 'Thanh toán';

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-32 pt-6 md:px-10 md:pb-16 md:pt-12 lg:px-[90px]">
      <title>Giỏ hàng | Trầm Hương Địa Trung Tín</title>
      <meta name="robots" content="noindex" />

      <nav aria-label="Đường dẫn" className="text-sm text-ink-muted">
        <Link to="/" className="-my-3 inline-block py-3 hover:text-brand md:my-0 md:py-0">Trang chủ</Link> / <span aria-current="page">Giỏ hàng</span>
      </nav>
      <div className="mt-3 flex items-baseline gap-4">
        <h1 className="font-serif text-[36px] leading-tight text-brand md:text-[52px]">Giỏ hàng</h1>
        <span className="text-[15px] text-ink-muted">{count} sản phẩm</span>
      </div>
      <CheckoutSteps current={1} />

      {lines.length === 0 ? (
        <div className="mx-auto mt-14 max-w-[640px] text-center md:mt-20">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface-muted text-ink-muted" aria-hidden="true">
            <BagIcon size={22} />
          </span>
          <h2 className="mt-6 font-serif text-[30px] leading-tight text-brand md:text-[38px]">Giỏ hàng của bạn đang trống</h2>
          <p className="mt-3 text-base text-ink-muted">Khám phá trang sức và hương trầm cho riêng bạn.</p>
          <Link to="/san-pham" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-brand px-10 font-semibold text-on-brand hover:bg-brand-dark md:w-auto">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="mt-6 md:mt-10 lg:grid lg:grid-cols-[1fr_404px] lg:items-start lg:gap-8">
          <div>
            {/* Status banner: one at a time, most important first. */}
            <div aria-live="polite">
              {failed ? (
                <div className="mb-4">
                  <Banner tone="error">{errorMessage}</Banner>
                  <button type="button" onClick={() => quote.refetch()} className="mt-3 h-12 rounded-md bg-brand px-12 font-semibold text-on-brand hover:bg-brand-dark">
                    Thử lại
                  </button>
                </div>
              ) : firstLoad ? (
                <Banner>Đang tải lại giá và kiểm tra tồn kho…</Banner>
              ) : blocking ? (
                <Banner tone="error">Xóa sản phẩm không khả dụng hoặc giảm số lượng để tiếp tục.</Banner>
              ) : quoteData?.priceTier === 'business' ? (
                <div className="mb-1 rounded-md bg-surface-muted px-4 py-3 text-sm">
                  <span className="font-semibold text-brand">Giá doanh nghiệp</span>
                  <span className="ml-3 text-ink-muted">Tài khoản đã được duyệt</span>
                </div>
              ) : null}
            </div>

            <div className="mt-3 hidden grid-cols-[1fr_110px_150px_130px_44px] gap-4 px-5 text-sm text-ink-muted md:grid" aria-hidden="true">
              <span>Sản phẩm</span>
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
              <span />
            </div>

            <ul className="mt-3 space-y-3">
              {rows.map((row) => (
                <CartRow key={lineKey(row.item)} row={row} pricesKnown={!firstLoad && !!row.line} locked={firstLoad || failed} />
              ))}
            </ul>

            <Link to="/san-pham" className="mt-5 inline-block py-2 text-[15px] font-semibold text-brand hover:underline">
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Summary: a card on desktop, a sticky bar at the bottom on mobile. */}
          <aside aria-label="Tóm tắt đơn hàng" className="mt-6 lg:mt-0">
            <div className="rounded-md bg-surface-muted px-5 py-6 md:px-7 md:py-7">
              <h2 className="font-serif text-[26px] leading-tight text-brand md:text-[30px]">Tóm tắt đơn hàng</h2>
              <dl className="mt-4 space-y-3 text-[15px]">
                <div className="flex justify-between gap-4">
                  <dt>Tạm tính</dt>
                  <dd>{showNumbers ? formatVnd(quoteData.subtotal) : DASH}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Phí giao hàng</dt>
                  <dd>{showNumbers ? (quoteData.shippingFee === 0 ? 'Miễn phí' : formatVnd(quoteData.shippingFee)) : DASH}</dd>
                </div>
              </dl>
              {store?.freeShippingThreshold ? <p className="mt-3 text-sm text-ink-muted">Miễn phí giao từ {formatVnd(store.freeShippingThreshold)}</p> : null}
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                <span className="text-base">Tổng cộng</span>
                <span className="text-[22px] font-bold text-brand">{showNumbers ? formatVnd(quoteData.total) : DASH}</span>
              </div>
              {summaryHint && <p className="mt-3 text-sm text-brand">{summaryHint}</p>}
              <button
                type="button"
                disabled={!canCheckout}
                onClick={() => navigate('/thanh-toan')}
                className="mt-5 hidden h-12 w-full rounded-md bg-brand font-semibold text-on-brand hover:bg-brand-dark disabled:bg-transparent disabled:text-ink-muted md:block"
              >
                {checkoutLabel}
              </button>
              <p className="mt-4 text-sm text-ink-muted">Thanh toán khi nhận hàng (COD).</p>
            </div>
          </aside>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 md:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink-muted">Tổng cộng</p>
                <p className="text-xl font-bold text-brand">{showNumbers ? formatVnd(quoteData.total) : DASH}</p>
              </div>
              <button
                type="button"
                disabled={!canCheckout}
                onClick={() => navigate('/thanh-toan')}
                className="h-12 min-w-[160px] rounded-md bg-brand px-6 font-semibold text-on-brand disabled:bg-surface-muted disabled:text-ink-muted"
              >
                {checkoutLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Banner({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'error' }) {
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-md bg-surface-muted px-4 py-3 text-[15px] ${tone === 'error' ? 'text-brand' : 'text-ink-muted'}`}>
      <InfoIcon size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function CartRow({ row, pricesKnown, locked }: { row: Row; pricesKnown: boolean; locked: boolean }) {
  const { item, line, problem } = row;
  const name = line?.productName ?? item.display.productName;
  const variant = line?.variantName ?? item.display.variantName;
  const image = line?.imageUrl ?? item.display.imageUrl;
  const slug = line?.productSlug ?? item.display.productSlug;
  const unit = line ? line.unitPrice + line.extraBeads * line.extraBeadUnitPrice : null;
  const message = problemText(problem, item.quantity);
  const unavailable = problem?.reason === 'unavailable' || (problem?.reason === 'insufficient_stock' && problem.availableQuantity <= 0);
  const maxQuantity = problem?.reason === 'insufficient_stock' && problem.availableQuantity > 0 ? Math.max(problem.availableQuantity, 1) : MAX_PER_LINE;
  const label = `${name} – ${variant}`;

  return (
    <li className="rounded-md border border-line px-4 py-4 md:grid md:grid-cols-[1fr_110px_150px_130px_44px] md:items-center md:gap-4 md:px-5 md:py-9">
      <div className="flex gap-4">
        <Link to={`/san-pham/${slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-surface-muted md:h-24 md:w-24" tabIndex={-1} aria-hidden="true">
          {image && <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />}
        </Link>
        <div className="min-w-0">
          <Link to={`/san-pham/${slug}`} className="font-semibold leading-snug text-ink hover:text-brand md:text-[17px]">
            {name}
          </Link>
          <p className="mt-1 text-[15px] text-ink-muted">{variant}</p>
          {item.extraBeads > 0 && (
            <p className="mt-1 text-sm text-ink-muted">
              Thêm {item.extraBeads} hạt{line ? ` × ${formatVnd(line.extraBeadUnitPrice)}` : ''}
            </p>
          )}
          {message && <p className="mt-1.5 text-sm font-semibold text-brand">{message}</p>}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[15px] md:mt-0 md:block">
        <span className="text-sm text-ink-muted md:hidden">Đơn giá</span>
        <span>{pricesKnown && unit !== null ? formatVnd(unit) : DASH}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 md:contents">
        <QuantityStepper
          value={item.quantity}
          max={maxQuantity}
          onChange={(quantity) => cart.setQuantity(item.variantId, item.extraBeads, quantity)}
          label={`Số lượng ${label}`}
          disabled={unavailable || locked}
        />
        <span className="ml-auto font-bold text-ink md:ml-0 md:text-[17px]">{pricesKnown && line ? formatVnd(line.lineTotal) : DASH}</span>
        <button
          type="button"
          onClick={() => cart.remove(item.variantId, item.extraBeads)}
          className="grid h-11 w-11 place-items-center text-ink-muted hover:text-brand md:h-10 md:w-10"
          aria-label={`Xóa ${label} khỏi giỏ hàng`}
        >
          <TrashIcon size={18} />
        </button>
      </div>
    </li>
  );
}
