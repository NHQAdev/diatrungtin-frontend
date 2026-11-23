import type { ReactNode } from 'react';

/**
 * Two-column card from the design: brand photo on the left (a short banner on mobile), form panel
 * on the right.
 */
export function AuthSplit({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-5 md:px-[64px] md:py-9">
      <div className="overflow-hidden md:grid md:min-h-[640px] md:grid-cols-[616fr_695fr] md:rounded-none">
        <div className="relative aspect-[8/3] overflow-hidden rounded-md bg-surface-muted md:aspect-auto md:rounded-none">
          <img src="/images/hero-model.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_62%] md:object-center" />
          <div className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-black/70 to-transparent md:block" aria-hidden="true" />
          <div className="absolute bottom-10 left-10 hidden text-on-brand md:block">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em]">Trang sức trầm hương</p>
            <p className="mt-4 font-serif text-[38px] leading-[1.2]">
              Một nét trầm,
              <br />
              một dấu ấn riêng.
            </p>
          </div>
        </div>
        <div className="pt-8 md:flex md:items-center md:bg-surface-muted md:px-[8%] md:py-14 lg:px-[128px]">
          <div className="w-full md:max-w-[440px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** "TÀI KHOẢN" eyebrow + big serif title + one-line description. */
export function AuthHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-[36px] leading-[1.15] text-brand md:mt-4 md:text-[52px]">{title}</h1>
      {children && <div className="mt-2 text-[15px] leading-6 text-ink-muted md:text-base">{children}</div>}
    </div>
  );
}

export function FormAlert({ id, message, tone = 'error' }: { id?: string; message: string; tone?: 'error' | 'success' }) {
  return (
    <div
      id={id}
      tabIndex={-1}
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-md border px-4 py-3 text-[15px] font-medium ${tone === 'error' ? 'border-brand/30 bg-brand/5 text-brand' : 'border-[#3f6b4e]/30 bg-[#3f6b4e]/10 text-[#2f5a3d]'}`}
    >
      {message}
    </div>
  );
}

export const primaryButton =
  'h-12 w-full rounded-md bg-brand px-6 text-base font-semibold text-on-brand transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70 md:h-[52px] md:text-[17px]';
