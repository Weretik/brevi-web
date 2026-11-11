import { siteConfig } from '@site/core/config';
import { LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { MetadataRoute } from 'next';

export type SitemapPage = {
  /** Locale-free path, for example `/order-in-bulk`. */
  path: string;
  lastModified?: Date;
  /** Language versions the page has; all of them when omitted. */
  locales?: readonly Locale[];
};

/** One sitemap entry per language version, each listing all versions as alternates. */
export function buildSitemapEntries(
  pages: SitemapPage[],
  config: SiteConfig = siteConfig,
): MetadataRoute.Sitemap {
  const absolute = (path: string) => `${config.siteUrl}${path}`;

  return pages.flatMap(({ path, lastModified, locales = LOCALES }) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [
        LOCALE_LANGUAGE_TAGS[locale],
        absolute(localizedPath(locale, path)),
      ]),
    );
    return locales.map((locale) => ({
      url: absolute(localizedPath(locale, path)),
      lastModified,
      alternates: { languages },
    }));
  });
}
