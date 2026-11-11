import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

/** One tag for the redirect list, so a «refresh the site» call can drop it. */
export const REDIRECTS_CACHE_TAG = 'redirects';

/** The list is kept for five minutes: a redirect added in the Admin works within about that time. */
const REDIRECTS_LIFE = { stale: 300, revalidate: 300, expire: 86_400 };
const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3_600 };

/** Pairs [old address, page] of a list answer; throws on any other shape. */
export function mapRedirects(data: unknown): [string, string][] {
  const items = (data as { items?: unknown } | null)?.items;
  if (!Array.isArray(items)) throw new Error('Unexpected redirect list.');
  return items.map((item: unknown) => {
    const { from, to } = (item ?? {}) as { from?: unknown; to?: unknown };
    if (typeof from !== 'string' || typeof to !== 'string') throw new Error('Unexpected redirect.');
    return [from, to];
  });
}

/** Every redirect of the site; an empty list when the API is unavailable (kept for a minute only). */
export async function loadRedirects(): Promise<[string, string][]> {
  'use cache';
  cacheTag(REDIRECTS_CACHE_TAG);

  const result = await siteApiGet('/api/public/redirects');
  if (result.kind === 'ok') {
    try {
      const pairs = mapRedirects(result.data);
      cacheLife(REDIRECTS_LIFE);
      return pairs;
    } catch {
      // Falls through to the short life below.
    }
  }
  cacheLife(FAILURE_LIFE);
  return [];
}
