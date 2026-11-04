import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-serif text-3xl">Không tìm thấy trang</h1>
      <p className="mt-4 text-ink-muted">Đường dẫn không tồn tại hoặc đã thay đổi.</p>
      <Link to="/" className="mt-8 inline-block rounded-md bg-brand px-6 py-3 font-medium text-on-brand hover:bg-brand-dark">
        Về trang chủ
      </Link>
    </section>
  );
}
