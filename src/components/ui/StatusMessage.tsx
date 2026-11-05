import type { ReactNode } from 'react';

/** Loading / empty / error blocks with the same look everywhere. */
export function StatusMessage({ kind, children, action }: { kind: 'loading' | 'empty' | 'error'; children: ReactNode; action?: ReactNode }) {
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-md border px-6 py-10 text-center ${kind === 'error' ? 'border-brand/30 text-brand' : 'border-line text-ink-muted'}`}>
      <p>{children}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
