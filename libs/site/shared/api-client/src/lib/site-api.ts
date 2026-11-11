import { siteConfig } from '@site/core/config';

import type { ApiResult } from './api-result';

/** Anonymous read paths of BreviERP that the site may call. */
export type PublicGetPath = `/api/public/${string}`;

export type SiteApiQuery = Record<string, string | number | boolean | null | undefined>;

type Fetch = typeof fetch;

const DEFAULT_TIMEOUT_MS = 10_000;

function buildUrl(path: PublicGetPath, query: SiteApiQuery, apiUrl: string): URL {
  const url = new URL(path, `${apiUrl}/`);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    url.searchParams.append(key, String(value));
  }
  // The same request always has the same address, so caches in front of the API can reuse the answer.
  url.searchParams.sort();
  return url;
}

/**
 * GET against the public BreviERP API, for Server Components, metadata, and sitemaps only. The answer is raw
 * JSON: the domain `data-access` checks its shape. Caching is the caller's job (`'use cache'`).
 */
export async function siteApiGet(
  path: PublicGetPath,
  query: SiteApiQuery = {},
  fetchImpl: Fetch = fetch,
  apiUrl: string = siteConfig.apiUrl,
): Promise<ApiResult> {
  try {
    const response = await fetchImpl(buildUrl(path, query, apiUrl), {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    if (response.status === 404) return { kind: 'not-found' };
    if (!response.ok) return { kind: 'unavailable', status: response.status };
    return { kind: 'ok', data: (await response.json()) as unknown };
  } catch {
    return { kind: 'unavailable' };
  }
}
