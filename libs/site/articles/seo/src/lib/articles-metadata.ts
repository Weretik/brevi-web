import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** What the SEO values of one article are built from; the caller picks the language. */
export type ArticleSeoInput = {
  slug: string;
  /** The language of the texts: Ukrainian on the Russian page of an article without Russian texts. */
  textLocale: Locale;
  title: string;
  /** The meta description: what staff wrote for search, or the excerpt. */
  description: string;
  /** ISO date of publication. */
  date: string;
  /** Absolute address of the article cover on the CDN, when it has one. */
  image?: string;
};

/** Title and description of the list page per locale; the layout template adds « — Brevi». */
export const ARTICLES_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Статті про спецодяг і робочий одяг',
    description:
      'Статті Brevi про робочий одяг: як обрати спецодяг і тканину, як доглядати за утепленим одягом, що важливо для нафтогазової галузі та іміджу компанії.',
  },
  ru: {
    title: 'Статьи о спецодежде и рабочей одежде',
    description:
      'Статьи Brevi о рабочей одежде: как выбрать спецодежду и ткань, как ухаживать за утеплённой одеждой, что важно для нефтегазовой отрасли и имиджа компании.',
  },
};

/** Locale-free path of one article: `/articles/<slug>`. */
export function articlePath(slug: string): string {
  return `${SITE_PATHS.articles}/${slug}`;
}

export function buildArticlesMetadata(locale: Locale): Metadata {
  return buildPageMetadata({ locale, path: SITE_PATHS.articles, ...ARTICLES_SEO_TEXT[locale] });
}

/**
 * Metadata of one article: its own title and description, Open Graph type `article` with the date. An
 * article without Russian texts shows the Ukrainian ones on the Russian page, so that page names the
 * Ukrainian one as canonical and has no language alternates.
 */
export function buildArticleMetadata(locale: Locale, article: ArticleSeoInput): Metadata {
  const path = articlePath(article.slug);
  const page = buildPageMetadata({
    locale,
    path,
    title: article.title,
    description: article.description,
  });
  const original = localizedPath(article.textLocale, path);
  const metadata: Metadata =
    article.textLocale === locale
      ? page
      : {
          ...page,
          alternates: { canonical: original },
          openGraph: { ...page.openGraph, url: original },
        };

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: article.date,
      ...(article.image ? { images: [article.image] } : {}),
    },
  };
}
