/** Resolve every internal URL against Astro’s configured deployment base. */
export function url(path = ''): string {
  if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (
    base &&
    (path === base ||
      path.startsWith(`${base}/`) ||
      path.startsWith(`${base}#`) ||
      path.startsWith(`${base}?`))
  )
    return path;
  return `${base}/${path.replace(/^\/+/, '')}`;
}
export const asset = url;
