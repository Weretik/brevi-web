import type { SiteCategoryRow } from '../../entities/site-categories/site-category';

export const siteCategoryName = (row: SiteCategoryRow) => row.nameUk ?? row.nameRu ?? row.slug;

/**
 * What the site would miss for this category. Only problems are shown: a complete category has no
 * mark, and a hidden one has nothing to miss yet.
 */
export function siteCategoryProblems(
  row: SiteCategoryRow,
  parent: SiteCategoryRow | null,
): string[] {
  if (!row.showOnSite) return [];
  const problems: string[] = [];
  if (parent && !parent.showOnSite) problems.push(`Розділ «${siteCategoryName(parent)}» приховано`);
  if (!row.nameRu) problems.push('Немає назви російською');
  if (row.productCount === 0) problems.push('Немає товарів');
  if (!row.hasSeo) problems.push('Немає SEO');
  return problems;
}

/** Rows whose name or address has the term, each with its category so the tree stays readable. */
export function filterSiteCategories(rows: readonly SiteCategoryRow[], term: string) {
  const wanted = term.trim().toLowerCase();
  if (!wanted) return [...rows];
  const matches = (row: SiteCategoryRow) =>
    [row.nameUk, row.nameRu, row.slug].some((value) => value?.toLowerCase().includes(wanted));
  const kept = new Set<number>();
  for (const row of rows) {
    if (!matches(row)) continue;
    kept.add(row.id);
    if (row.parentId !== null) kept.add(row.parentId);
  }
  return rows.filter((row) => kept.has(row.id));
}

/**
 * The new order of the neighbours of a category after one step up (-1) or down (1); null when it is
 * already at the edge.
 */
export function moveSiteCategory(
  rows: readonly SiteCategoryRow[],
  id: number,
  step: -1 | 1,
): { parentId: number | null; ids: number[] } | null {
  const row = rows.find((item) => item.id === id);
  if (!row) return null;
  const ids = rows.filter((item) => item.parentId === row.parentId).map((item) => item.id);
  const from = ids.indexOf(id);
  const to = from + step;
  if (to < 0 || to >= ids.length) return null;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  return { parentId: row.parentId, ids };
}
