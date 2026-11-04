// Placeholder for screens that are routed but not built yet (waiting for the approved design).
// Every route that still shows this is listed in docs/PROGRESS.md.
export function PendingPage({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-serif text-3xl text-ink">{title}</h1>
      <p className="mt-4 text-ink-muted">Màn hình đang được xây dựng theo thiết kế đã duyệt.</p>
    </section>
  );
}
