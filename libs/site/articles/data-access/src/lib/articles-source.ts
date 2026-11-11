import { loadArticle, loadArticles } from './articles-loaders';

import type { Article, ArticleCard } from '@site/articles/model';
import type { Locale } from '@site/core/i18n';

/**
 * Articles for server components, read from the BreviERP public article API: the articles staff keep in
 * «Контент → Статті» and mark «Показувати на сайті». When the API is unavailable the list is empty and an
 * article is «not found»; the answer is kept for a minute, so the site recovers on its own.
 */
export async function getArticles(locale: Locale): Promise<readonly ArticleCard[]> {
  return (await loadArticles(locale)) ?? [];
}

export async function getArticle(slug: string, locale: Locale): Promise<Article | null> {
  const article = await loadArticle(slug, locale);
  return article === 'not-found' ? null : article;
}

/** Addresses of the articles for the sitemap and for building the pages ahead of time. */
export async function getArticleAddresses(): Promise<readonly ArticleCard[]> {
  return getArticles('uk');
}
