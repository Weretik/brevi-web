import { siteConfig } from '@site/core/config';
import { LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';

import type { SiteConfig } from '@site/core/config';
import type { MetadataRoute } from 'next';

export type SitemapPage = {
  /** Locale-free path, for example `/order-in-bulk`. */
  path: string;
  lastModified?: Date;
};

/** One sitemap entry per language version, each listing all versions as alternates. */
export function buildSitemapEntries(
  pages: SitemapPage[],
  config: SiteConfig = siteConfig,
): MetadataRoute.Sitemap {
  const absolute = (path: string) => `${config.siteUrl}${path}`;

  return pages.flatMap(({ path, lastModified }) => {
    const languages = Object.fromEntries(
      LOCALES.map((locale) => [
        LOCALE_LANGUAGE_TAGS[locale],
        absolute(localizedPath(locale, path)),
      ]),
    );
    return LOCALES.map((locale) => ({
      url: absolute(localizedPath(locale, path)),
      lastModified,
      alternates: { languages },
    }));
  });
}
