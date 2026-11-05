import type { ReactNode } from 'react';

/** Page width from the design: 1440 frame with 40 px side margins → 1360 px content. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-4 md:px-10 ${className}`}>{children}</div>;
}
