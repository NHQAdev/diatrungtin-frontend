import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { EyeIcon, EyeOffIcon } from './icons';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string;
  error?: string;
  hint?: ReactNode;
  /** Small element at the right of the label row (e.g. "Quên mật khẩu?", a status badge). */
  labelAside?: ReactNode;
};

/** Labelled input with hint and error text wired up through aria-describedby. */
export const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, error, hint, labelAside, className = '', type = 'text', readOnly, ...props },
  ref,
) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <div className="flex min-h-6 items-center justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-semibold text-ink">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative mt-2">
        <input
          ref={ref}
          id={id}
          type={isPassword && reveal ? 'text' : type}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`h-12 w-full rounded-md border px-4 text-base text-ink placeholder:text-ink-muted/80 focus:outline-2 focus:outline-offset-0 focus:outline-brand md:h-[52px] ${
            error ? 'border-brand' : 'border-line'
          } ${readOnly ? 'bg-surface-muted text-ink-muted' : 'bg-surface'} ${isPassword ? 'pr-14' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((value) => !value)}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink-muted hover:text-brand"
            aria-label={reveal ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={reveal}
          >
            {reveal ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-brand">
          {error}
        </p>
      )}
    </div>
  );
});
