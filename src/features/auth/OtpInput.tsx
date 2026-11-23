import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

/**
 * Six one-digit boxes. Typing moves to the next box, Backspace goes back, and pasting a whole code
 * (or the phone's SMS/email autofill into the first box) fills every box at once.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  invalid,
  describedBy,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  function setFrom(index: number, raw: string) {
    const typed = raw.replace(/\D/g, '');
    if (!typed) return;
    const next = (value.slice(0, index) + typed).slice(0, length);
    onChange(next);
    refs.current[Math.min(next.length, length - 1)]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (digits[index]) onChange(value.slice(0, index) + value.slice(index + 1));
      else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        refs.current[index - 1]?.focus();
      }
    } else if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
    else if (event.key === 'ArrowRight' && index < length - 1) refs.current[index + 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  }

  return (
    <div className="flex gap-2 md:gap-3" role="group" aria-label="Mã xác minh 6 chữ số" aria-describedby={describedBy}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={digit}
          disabled={disabled}
          // The first box receives the whole code from the browser's one-time-code autofill.
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={index === 0 ? length : 1}
          aria-label={`Chữ số ${index + 1}`}
          aria-invalid={invalid || undefined}
          onChange={(event) => setFrom(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className={`h-12 w-11 rounded-md border bg-surface text-center text-xl font-semibold text-ink focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand disabled:opacity-60 md:h-[52px] md:w-[46px] ${
            invalid ? 'border-brand' : 'border-line'
          }`}
        />
      ))}
    </div>
  );
}
