import { useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLink } from '../../components/ui/ArrowLink';
import { QuantityStepper } from '../../components/ui/QuantityStepper';
import { PAGE, pageUrl } from '../../config/merchandising';
import { formatVnd } from '../../lib/format';
import type { ProductDetail } from '../../types/api';
import { cart } from '../cart/cart-store';
import { clampChoices, findVariant, initialSelection, optionGroups, selectValue, unitPrice } from './variant-selection';

/** Right column of the product page: name, price, options, extra beads, quantity, buttons. */
export function PurchasePanel({ product }: { product: ProductDetail }) {
  const navigate = useNavigate();
  const [selection, setSelection] = useState(() => initialSelection(product.variants));
  const [extraBeadsRaw, setExtraBeads] = useState(0);
  const [quantityRaw, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const statusId = useId();

  const variant = findVariant(product.variants, selection);
  const groups = optionGroups(product.variants, selection);
  // Re-clamp on every render: switching variant can lower the limits.
  const { extraBeads, quantity } = clampChoices(variant, extraBeadsRaw, quantityRaw);
  const canBuy = !!variant && variant.inStock;
  const eyebrow = product.breadcrumb[0]?.name;

  const addToCart = () => {
    if (!variant || !canBuy) return false;
    cart.add({
      variantId: variant.id,
      quantity,
      extraBeads,
      display: {
        productName: product.name,
        productSlug: product.slug,
        variantName: variant.name,
        imageUrl: product.images[0]?.url ?? null,
        unitPrice: unitPrice(variant, extraBeads),
      },
    });
    return true;
  };

  return (
    <div>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand md:text-xl">{eyebrow}</p>}
      <h1 className="mt-2 font-serif text-[30px] leading-tight text-brand md:mt-3 md:text-[56px] md:leading-[1.15]">{product.name}</h1>

      <p className="mt-3 text-[28px] font-bold text-brand md:mt-2 md:text-[44px]" aria-live="polite">
        {variant ? formatVnd(unitPrice(variant, extraBeads)) : <span className="text-lg font-medium text-ink-muted">Chọn phiên bản để xem giá</span>}
        {variant && product.priceTier === 'business' && variant.price !== variant.retailPrice && (
          <span className="ml-3 align-middle text-sm font-medium text-ink-muted md:text-base">
            Giá doanh nghiệp · giá lẻ <s>{formatVnd(variant.retailPrice)}</s>
          </span>
        )}
      </p>
      {product.shortDescription && <p className="mt-3 text-[15px] leading-6 text-ink md:mt-4 md:text-xl md:leading-8">{product.shortDescription}</p>}

      {groups.map((group) =>
        group.values.length > 1 || groups.length > 1 ? (
          <fieldset key={group.key} className="mt-5 md:mt-6">
            <legend className="text-sm font-semibold text-ink md:text-xl">{group.label}</legend>
            <div className="mt-2 grid grid-cols-3 gap-3 md:mt-3 md:flex md:flex-wrap md:gap-5">
              {group.values.map((option) => {
                const selected = selection[group.key] === option.value;
                const disabled = !option.exists || !option.inStock;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    disabled={disabled}
                    onClick={() => setSelection(selectValue(product.variants, selection, group.key, option.value))}
                    className={`h-11 rounded-sm border px-4 text-sm font-medium md:h-12 md:min-w-[132px] md:text-xl ${
                      selected ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface text-ink hover:border-brand'
                    } disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted disabled:text-ink-muted disabled:line-through`}
                  >
                    {option.label}
                    {option.exists && !option.inStock && <span className="sr-only"> (hết hàng)</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null,
      )}

      {variant && variant.maxExtraBeads > 0 && (
        <div className="mt-5 md:mt-6">
          <p className="text-sm font-semibold text-ink md:text-xl" id={`${statusId}-beads`}>Thêm hạt (cho cổ tay lớn)</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <QuantityStepper label="Số hạt thêm" value={extraBeads} min={0} max={variant.maxExtraBeads} onChange={setExtraBeads} />
            <p className="text-xs text-ink-muted md:text-base">
              {formatVnd(variant.extraBeadPrice ?? 0)}/hạt · tối đa {variant.maxExtraBeads} hạt
            </p>
          </div>
        </div>
      )}

      {variant && !variant.inStock && <p className="mt-4 text-sm font-medium text-brand">Phiên bản này đã hết hàng.</p>}

      <ArrowLink to={pageUrl(PAGE.sizeGuide)} className="mt-4 md:mt-5">Chưa rõ kích thước? Xem cách đo</ArrowLink>

      <div className="mt-6 grid grid-cols-[auto_1fr] gap-3 md:mt-8 md:grid-cols-[auto_1fr_1fr] md:gap-5">
        <QuantityStepper size="lg" label="Số lượng" value={quantity} max={Math.max(1, variant?.availableQuantity ?? 1)} onChange={setQuantity} disabled={!canBuy} />
        <button
          type="button"
          disabled={!canBuy}
          onClick={() => addToCart() && setAdded(true)}
          className="order-3 col-span-2 h-12 rounded-sm bg-brand px-6 text-[15px] font-semibold md:h-16 md:text-xl text-on-brand hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40 md:order-none md:col-span-1"
          aria-describedby={statusId}
        >
          Thêm vào giỏ
        </button>
        <button
          type="button"
          disabled={!canBuy}
          onClick={() => addToCart() && navigate('/gio-hang')}
          className="h-12 rounded-sm border border-line bg-surface px-6 text-[15px] font-semibold md:h-16 md:text-xl text-ink hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mua ngay
        </button>
      </div>

      <p id={statusId} role="status" className="mt-3 min-h-5 text-sm text-ink md:text-base">
        {added && (
          <>
            Đã thêm vào giỏ. <Link to="/gio-hang" className="font-semibold text-brand underline">Xem giỏ hàng</Link>
          </>
        )}
      </p>

      <ArrowLink to={pageUrl(PAGE.sizeGuide)}>Cần hỗ trợ chọn size?</ArrowLink>
    </div>
  );
}
