// Small wrapper around fetch for the backend API (see backend docs/API.md).
// - Always sends cookies (customer and admin sessions are HttpOnly cookies set by the server).
// - Returns `data` from { data } responses; throws ApiError for { error } responses.

const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export interface ApiErrorDetail {
  field?: string;
  message?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** Field errors from a VALIDATION_ERROR, keyed by field path ("contact.phone" → "Số điện thoại không hợp lệ."). */
  fieldErrors(): Record<string, string> {
    if (this.code !== 'VALIDATION_ERROR' || !Array.isArray(this.details)) return {};
    const result: Record<string, string> = {};
    for (const detail of this.details as ApiErrorDetail[]) {
      if (detail.field && detail.message && !result[detail.field]) result[detail.field] = detail.message;
    }
    return result;
  }
}

export interface Paged<T> {
  data: T[];
  meta: { page: number; pageSize: number; total: number; totalPages: number; [key: string]: unknown };
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function send(path: string, options: RequestOptions = {}): Promise<unknown> {
  const isForm = options.body instanceof FormData;
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      credentials: 'include',
      signal: options.signal,
      headers: {
        ...(options.body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      body: options.body === undefined ? undefined : isForm ? (options.body as FormData) : JSON.stringify(options.body),
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    throw new ApiError(0, 'NETWORK_ERROR', 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.');
  }

  if (response.status === 204) return null;
  const json = (await response.json().catch(() => null)) as { data?: unknown; error?: { code: string; message: string; details?: unknown } } | null;

  if (!response.ok) {
    const error = json?.error;
    throw new ApiError(response.status, error?.code ?? 'INTERNAL_ERROR', error?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.', error?.details);
  }
  return json;
}

/** For endpoints that return { data }. */
export async function api<T>(path: string, options?: RequestOptions): Promise<T> {
  const json = (await send(path, options)) as { data: T } | null;
  return (json?.data ?? null) as T;
}

/** For list endpoints that return { data, meta }. */
export async function apiPaged<T>(path: string, options?: RequestOptions): Promise<Paged<T>> {
  return (await send(path, options)) as Paged<T>;
}

/** Builds "?a=1&b=2" from an object, skipping empty values. */
export function toQuery(params: Record<string, string | number | boolean | string[] | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) continue;
    search.set(key, Array.isArray(value) ? value.join(',') : String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}
