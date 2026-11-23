/**
 * Where to go after logging in. Only same-site paths are accepted ("/gio-hang", "/san-pham/x?y=1");
 * anything else (other domains, "//evil.com", "javascript:") falls back to the home page.
 */
export function safeNextPath(raw: string | null | undefined, fallback = '/'): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return fallback;
  if (raw.startsWith('/dang-nhap') || raw.startsWith('/dang-ky')) return fallback;
  return raw;
}

/** Login link that brings the customer back to the page they were on. */
export function loginUrl(currentPath: string): string {
  const next = safeNextPath(currentPath, '');
  return next && next !== '/' ? `/dang-nhap?next=${encodeURIComponent(next)}` : '/dang-nhap';
}
