import type { ContentProductRow } from '../../entities/product-pages/content-product';

/**
 * What the site would miss for this product, shortest first. Only problems are shown: a complete
 * page has no mark. A product that is not marked for the site has nothing to miss yet.
 */
export function contentProductProblems(row: ContentProductRow): string[] {
  if (!row.showOnSite) return [];
  const problems: string[] = [];
  if (!row.isActive) problems.push('Товар вимкнено в «Товари»');
  if (!row.hasPrice) problems.push('Немає ціни');
  if (!row.mainPhotoUrl) problems.push('Немає фото');
  if (!row.hasUkrainianText) problems.push('Немає опису українською');
  if (!row.hasRussianText) problems.push('Немає опису російською');
  if (!row.hasSeo) problems.push('Немає SEO');
  return problems;
}

export const contentProductTypeLabel = (type: ContentProductRow['type']) =>
  type === 'Sewing' ? 'Швейна продукція' : 'ЗІЗ';
