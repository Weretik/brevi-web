import { COMPANY, siteConfig } from '@site/core/config';
import { LOCALES, OPEN_GRAPH_LOCALES } from '@site/core/i18n';

import { buildCanonicalPath, buildLanguageAlternates } from './alternates';
import { buildRobotsMeta } from './robots-policy';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

export type PageMetadataInput = {
  locale: Locale;
  /** Locale-free path of the page, for example `/order-in-bulk`. */
  path: string;
  /** Query that identifies the page itself and stays in the canonical, for example `?page=2`. */
  search?: string;
  /** At most 60 characters with the key phrase first; the layout adds « — Brevi». */
  title: string;
  description: string;
  /** `false` for private, utility, or duplicate pages: they get `noindex, follow`. */
  indexable?: boolean;
};

/** Metadata defaults for the root layout: absolute URL base, title template, and site-wide robots. */
export function buildRootMetadata(locale: Locale, config: SiteConfig = siteConfig): Metadata {
  return {
    metadataBase: new URL(config.siteUrl),
    title: { default: COMPANY.name, template: `%s — ${COMPANY.name}` },
    applicationName: COMPANY.name,
    robots: buildRobotsMeta(config, true),
    formatDetection: { telephone: false },
    openGraph: { siteName: COMPANY.name, locale: OPEN_GRAPH_LOCALES[locale] },
  };
}

/** Per-page metadata with a self canonical, `hreflang` alternates, and Open Graph. */
export function buildPageMetadata(
  input: PageMetadataInput,
  config: SiteConfig = siteConfig,
): Metadata {
  const { locale, path, search = '', title, description, indexable = true } = input;
  const canonical = buildCanonicalPath(locale, path, search);

  return {
    title,
    description,
    alternates: { canonical, languages: buildLanguageAlternates(path, search) },
    robots: buildRobotsMeta(config, indexable),
    openGraph: {
      type: 'website',
      siteName: COMPANY.name,
      url: canonical,
      title,
      description,
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: LOCALES.filter((other) => other !== locale).map(
        (other) => OPEN_GRAPH_LOCALES[other],
      ),
    },
  };
}
