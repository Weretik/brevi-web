/** One tag for every catalog entry, so a later «refresh the site» call from BreviERP can drop them together. */
export const CATALOG_CACHE_TAG = 'catalog';

/**
 * Catalog data is kept for five minutes: a change in the Admin reaches the site within about that time, and
 * a page stays served from the cache while the next visit refreshes it in the background.
 */
export const CATALOG_LIFE = { stale: 300, revalidate: 300, expire: 86_400 };

/** A failed read is kept only for a minute, so the site recovers soon after the API does. */
export const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3_600 };
