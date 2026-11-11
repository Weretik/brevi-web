/**
 * The path of an address as BreviERP keeps old addresses: decoded, lower case, without the query, repeated or
 * closing slashes. Null for the root or an address that cannot be decoded.
 */
export function redirectPath(path: string): string | null {
  let value = path.split(/[?#]/)[0] ?? '';
  try {
    value = decodeURIComponent(value);
  } catch {
    return null;
  }
  const parts = value.split('/').filter(Boolean);
  return parts.length === 0 ? null : `/${parts.join('/').toLowerCase()}`;
}

/** The page an old address leads to, only when it is a page of the new site. */
export function findRedirect(redirects: ReadonlyMap<string, string>, path: string): string | null {
  const key = redirectPath(path);
  const target = key === null ? undefined : redirects.get(key);
  return target && /^\/(uk|ru)(\/|$)/.test(target) ? target : null;
}
