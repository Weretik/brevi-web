import { COMPANY, siteConfig } from '@site/core/config';
import { LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';

import { articlePath } from './articles-metadata';

import type { ArticleSeoInput } from './articles-metadata';
import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

/** `Article` for one article page: headline, date, language, and Brevi as author and publisher. */
export function buildArticleJsonLd(
  locale: Locale,
  article: ArticleSeoInput,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const url = `${config.siteUrl}${localizedPath(locale, articlePath(article.slug))}`;
  const organization = {
    '@type': 'Organization',
    name: COMPANY.name,
    url: `${config.siteUrl}${localizedPath(locale)}`,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: LOCALE_LANGUAGE_TAGS[locale],
    mainEntityOfPage: url,
    author: organization,
    publisher: organization,
    ...(article.image ? { image: `${config.siteUrl}${article.image}` } : {}),
  };
}
