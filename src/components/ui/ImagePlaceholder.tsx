/** Shown when a product has no photo yet. */
export function ImagePlaceholder({ label = 'Chưa có ảnh', className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`grid h-full w-full place-items-center bg-surface-muted text-xs text-ink-muted ${className}`} role="img" aria-label={label}>
      {label}
    </div>
  );
}
