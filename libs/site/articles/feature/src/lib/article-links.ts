import { articlePath } from '@site/articles/seo';
import { plainCatalogText } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';

import type { Article, ArticleCard } from '@site/articles/model';
import type { ArticleSeoInput } from '@site/articles/seo';
import type { Locale } from '@site/core/i18n';

/** Localized link of an article page. */
export function articleHref(locale: Locale, article: Pick<ArticleCard, 'slug'>): string {
  return localizedPath(locale, articlePath(article.slug));
}

/** The values the SEO builders need from an article: what staff wrote for search, or the title and excerpt. */
export function toArticleSeoInput(article: Article): ArticleSeoInput {
  return {
    slug: article.slug,
    textLocale: article.textLocale,
    title: article.seo.title || article.title,
    description: article.seo.description || plainCatalogText(article.excerpt) || article.title,
    date: article.date,
    modified: article.updatedAt,
    image: article.cover?.src,
  };
}
