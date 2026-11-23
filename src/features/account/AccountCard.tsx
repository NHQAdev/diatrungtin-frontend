import type { ReactNode } from 'react';

export function AccountCard({ title, description, aside, children }: { title: string; description?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-[#FFFBF4] px-5 py-6 md:px-8 md:py-8" aria-label={title}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5">
        <div>
          <h2 className="font-serif text-[26px] leading-tight text-brand md:text-[30px]">{title}</h2>
          {description && <p className="mt-1.5 text-[15px] text-ink-muted">{description}</p>}
        </div>
        {aside}
      </div>
      <div className="pt-6">{children}</div>
    </section>
  );
}

export const saveButton =
  'h-12 w-full rounded-md bg-brand px-8 text-base font-semibold text-on-brand transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70 md:h-[52px] md:w-auto';
