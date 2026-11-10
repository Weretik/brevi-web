import { buildSitemapEntries } from '@site/core/seo';

import type { MetadataRoute } from 'next';

/** Pages in both languages with `hreflang` alternates. Each migrated page adds its own entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries([{ path: '/' }]);
}
