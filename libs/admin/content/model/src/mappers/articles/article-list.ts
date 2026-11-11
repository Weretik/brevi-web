import type { ArticleRow } from '../../entities/articles/article';

export const articleTitle = (row: ArticleRow) => row.titleUk ?? row.titleRu ?? row.slug;

/**
 * What the site would miss for this article. Only problems are shown: a complete article has no
 * mark, and a hidden one has nothing to miss yet.
 */
export function articleProblems(row: ArticleRow): string[] {
  if (!row.showOnSite) return [];
  const problems: string[] = [];
  if (!row.coverUrl) problems.push('Немає обкладинки');
  if (!row.hasUkrainianText) problems.push('Немає тексту українською');
  if (!row.titleRu) problems.push('Немає назви російською');
  else if (!row.hasRussianText) problems.push('Немає тексту російською');
  if (!row.hasSeo) problems.push('Немає SEO');
  return problems;
}

/** Articles whose title or address has the term. */
export function filterArticles(rows: readonly ArticleRow[], term: string): ArticleRow[] {
  const wanted = term.trim().toLowerCase();
  if (!wanted) return [...rows];
  return rows.filter((row) =>
    [row.titleUk, row.titleRu, row.slug].some((value) => value?.toLowerCase().includes(wanted)),
  );
}

/** `2026-11-11` as «11.11.2026». */
export function articleDateLabel(date: string): string {
  const [year, month, day] = date.split('-');
  return year && month && day ? `${day}.${month}.${year}` : date;
}
