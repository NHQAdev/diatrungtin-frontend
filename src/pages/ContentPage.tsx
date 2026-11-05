import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { queryKeys } from '../lib/queries';
import { NotFoundPage } from './NotFoundPage';

interface PageContent {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

/** Policy / info pages managed in the admin (/api/pages/:slug). Content is plain text with blank lines between paragraphs. */
export function ContentPage() {
  const { slug = '' } = useParams();
  const { data, isPending, error } = useQuery({ queryKey: queryKeys.page(slug), queryFn: () => api<PageContent>(`/api/pages/${encodeURIComponent(slug)}`) });

  if (error instanceof ApiError && error.status === 404) return <NotFoundPage />;
  if (error) return <p className="mx-auto max-w-3xl px-4 py-16 text-center text-ink-muted">{error.message}</p>;
  if (isPending) return <p className="mx-auto max-w-3xl px-4 py-16 text-center text-ink-muted" role="status">Đang tải…</p>;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl text-ink">{data.title}</h1>
      <div className="mt-6 space-y-4 leading-7 text-ink">
        {data.content.split(/\n\s*\n/).map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
