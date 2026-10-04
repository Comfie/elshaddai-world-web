/**
 * Returns a same-origin path (with query/hash) that is safe to navigate to
 * after sign-in, or `fallback`.
 *
 * NextAuth's middleware sets callbackUrl to an ABSOLUTE URL and anyone can craft
 * `/login?callbackUrl=https://evil.example`, so the value must never be pushed to
 * the router as-is (open-redirect / phishing risk). Anything that is not on this
 * origin, or that points back at an auth page, is replaced by the fallback.
 */
export function safeRedirectPath(raw: string | null | undefined, origin: string, fallback = '/admin') {
  if (!raw) return fallback;
  try {
    const url = new URL(raw, origin);
    if (url.origin !== origin) return fallback; // catches https://evil, //evil, /\evil, javascript: …
    const path = `${url.pathname}${url.search}${url.hash}`;
    if (!path.startsWith('/') || path.startsWith('//')) return fallback;
    if (url.pathname === '/login' || url.pathname === '/register') return fallback;
    return path;
  } catch {
    return fallback;
  }
}
