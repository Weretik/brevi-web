import { siteConfig } from '@site/core/config';
import { LOCALES, localizedPath } from '@site/core/i18n';

import type { SiteConfig } from '@site/core/config';
import type { MetadataRoute } from 'next';

/** Locale-free paths of private pages that must never be crawled. */
export const PRIVATE_PATHS = ['/request'] as const;

/** robots.txt: blocks everything until indexing is enabled, then only private pages, the API, and sort URLs. */
export function buildRobotsFile(config: SiteConfig = siteConfig): MetadataRoute.Robots {
  if (!config.indexingEnabled) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        ...LOCALES.flatMap((locale) => PRIVATE_PATHS.map((path) => localizedPath(locale, path))),
        '/*?*sort=',
      ],
    },
    sitemap: `${config.siteUrl}/sitemap.xml`,
  };
}
