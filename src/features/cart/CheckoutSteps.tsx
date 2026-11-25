const STEPS = ['Giỏ hàng', 'Thanh toán', 'Hoàn tất'];

/** "01 Giỏ hàng / 02 Thanh toán / 03 Hoàn tất" with the current step highlighted. */
export function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted md:mt-4 md:gap-x-5 md:text-[15px]" aria-label="Các bước đặt hàng">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const active = step === current;
        return (
          <li key={label} className="flex items-center gap-3 md:gap-5">
            {index > 0 && <span aria-hidden="true">/</span>}
            <span className={active ? 'font-semibold text-brand' : undefined} aria-current={active ? 'step' : undefined}>
              {String(step).padStart(2, '0')}&nbsp; {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
