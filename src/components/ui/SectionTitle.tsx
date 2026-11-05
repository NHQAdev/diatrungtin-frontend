import type { ReactNode } from 'react';

export function SectionTitle({ children, action, id }: { children: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-5 flex flex-col items-start gap-3 md:mb-6 md:flex-row md:items-end md:justify-between md:gap-4">
      <h2 id={id} className="font-serif text-[26px] leading-tight text-brand md:text-[48px]">{children}</h2>
      {action}
    </div>
  );
}
