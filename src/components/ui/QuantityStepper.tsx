import { MinusIcon, PlusIcon } from './icons';

interface Props {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  disabled?: boolean;
  size?: 'md' | 'lg';
}

/** − value + control. Buttons are disabled at the limits; the number can also be typed. */
export function QuantityStepper({ value, min = 1, max, onChange, label, disabled, size = 'md' }: Props) {
  const clamp = (n: number) => Math.max(min, Math.min(max, Number.isFinite(n) ? Math.trunc(n) : min));
  return (
    <div className={`inline-flex items-stretch rounded-sm border border-line bg-surface ${size === 'lg' ? 'h-12 md:h-16' : 'h-11 md:h-12'}`} role="group" aria-label={label}>
      <button type="button" className="grid w-11 place-items-center text-ink disabled:opacity-30" onClick={() => onChange(clamp(value - 1))} disabled={disabled || value <= min} aria-label={`Giảm ${label.toLowerCase()}`}>
        <MinusIcon size={16} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        className="w-12 border-x border-line bg-transparent text-center text-base font-medium md:w-14 md:text-xl outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onChange(clamp(Number(event.target.value)))}
      />
      <button type="button" className="grid w-11 place-items-center text-ink disabled:opacity-30" onClick={() => onChange(clamp(value + 1))} disabled={disabled || value >= max} aria-label={`Tăng ${label.toLowerCase()}`}>
        <PlusIcon size={16} />
      </button>
    </div>
  );
}
