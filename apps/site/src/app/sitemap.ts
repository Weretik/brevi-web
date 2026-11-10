import { SITE_PATHS } from '@site/core/i18n';
import { buildSitemapEntries } from '@site/core/seo';

import type { MetadataRoute } from 'next';

/** Pages in both languages with `hreflang` alternates. Each migrated page adds its own entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries([
    { path: '/' },
    { path: SITE_PATHS.production },
    { path: SITE_PATHS.deliveryAndPayment },
    { path: SITE_PATHS.contacts },
    { path: SITE_PATHS.returnsExchanges },
    { path: SITE_PATHS.ourWork },
  ]);
}
