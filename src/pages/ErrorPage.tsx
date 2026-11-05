import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

/**
 * Shown when a page crashes while rendering. It replaces the whole layout (header/footer may be the
 * part that failed), so it keeps its own minimal markup. Details are logged to the console only.
 */
export function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <p className="font-serif text-2xl text-brand">Trầm Hương Địa Trung Tín</p>
      <h1 className="mt-6 font-serif text-[32px] leading-tight text-ink md:text-[44px]">
        {notFound ? 'Không tìm thấy trang' : 'Đã có lỗi khi hiển thị trang'}
      </h1>
      <p className="mt-3 max-w-md text-base text-ink-muted">
        {notFound ? 'Đường dẫn có thể đã thay đổi.' : 'Bạn thử tải lại trang. Nếu vẫn lỗi, vui lòng quay lại sau ít phút.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {!notFound && (
          <button type="button" onClick={() => window.location.reload()} className="h-12 rounded-sm bg-brand px-6 font-semibold text-on-brand hover:bg-brand-dark">
            Tải lại trang
          </button>
        )}
        <Link to="/" reloadDocument className="inline-flex h-12 items-center rounded-sm border border-brand px-6 font-semibold text-brand hover:bg-surface-muted">
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
