const csrfCookieName = 'brevi.csrf';

export const csrfHeaderName = 'X-CSRF-Token';

/** Reads the readable CSRF cookie that the API sets next to the HttpOnly session cookie. */
export function readCsrfToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const prefix = `${csrfCookieName}=`;
  const cookie = document.cookie.split('; ').find((value) => value.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.substring(prefix.length)) : null;
}

/** The API checks the CSRF header on every request that can change data. */
export function needsCsrfToken(method: string | undefined): boolean {
  const normalized = (method ?? 'get').toUpperCase();

  return normalized !== 'GET' && normalized !== 'HEAD' && normalized !== 'OPTIONS';
}
