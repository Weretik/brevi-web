import type { ArticleCard } from './article';

/** `2021-07-29` → `29.07.2021`, the date form of both site languages. */
export function formatArticleDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

/** How many other articles the «Читайте також» block offers. */
export const MORE_ARTICLES = 3;

/** The articles that follow this one in the list, wrapping around, so every article gets linked. */
export function pickMoreArticles(
  articles: readonly ArticleCard[],
  slug: string,
  count = MORE_ARTICLES,
): readonly ArticleCard[] {
  const others = articles.filter((item) => item.slug !== slug);
  const start = Math.max(
    0,
    articles.findIndex((item) => item.slug === slug),
  );
  return [...others.slice(start), ...others.slice(0, start)].slice(0, count);
}
