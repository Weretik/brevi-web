import { ARTICLE_FILES } from './article-files';

import type { Article } from './article';

/**
 * Articles of the live `brevi.com.ua` blog, newest first; equal dates keep the order of the live list.
 * They live in files until the admin gets an article editor.
 */
export const ARTICLES: readonly Article[] = ARTICLE_FILES.map((article, index) => ({
  article,
  index,
}))
  .sort((a, b) => b.article.date.localeCompare(a.article.date) || a.index - b.index)
  .map(({ article }) => article);

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** `2021-07-29` → `29.07.2021`, the date form of both site languages. */
export function formatArticleDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}
