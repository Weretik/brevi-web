/** One tag for every article entry, so a later «refresh the site» call can drop them together. */
export const ARTICLES_CACHE_TAG = 'articles';

/**
 * Articles are kept for five minutes: a change in the Admin reaches the site within about that time, and
 * a page stays served from the cache while the next visit refreshes it in the background.
 */
export const ARTICLES_LIFE = { stale: 300, revalidate: 300, expire: 86_400 };

/** A failed read is kept only for a minute, so the site recovers soon after the API does. */
export const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3_600 };
