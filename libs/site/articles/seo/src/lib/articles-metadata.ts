import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** What the SEO values of one article are built from; the caller picks the language. */
export type ArticleSeoInput = {
  slug: string;
  title: string;
  /** The article excerpt: it is the meta description. */
  description: string;
  /** ISO date of publication. */
  date: string;
  /** Root-relative path of the article picture, when it has one. */
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

/** Metadata of one article: its own title and description, Open Graph type `article` with the date. */
export function buildArticleMetadata(locale: Locale, article: ArticleSeoInput): Metadata {
  const metadata = buildPageMetadata({
    locale,
    path: articlePath(article.slug),
    title: article.title,
    description: article.description,
  });

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
