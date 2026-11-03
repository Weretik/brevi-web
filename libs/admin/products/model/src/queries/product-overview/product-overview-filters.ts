import type { ProductOverview } from '../../entities/product-overview/product-overview';

/** `null` shows every row; `'none'` shows rows without a section. */
export type ProductSectionFilter = number | 'none' | null;

export interface ProductSectionCount {
  sectionId: number | null;
  count: number;
}

/** Row counts per section in the order sections first appear in `sectionOrder`, then rows without one. */
export function countProductsBySection(
  rows: readonly ProductOverview[],
  sectionOrder: readonly number[],
): ProductSectionCount[] {
  const counts = new Map<number | null, number>();
  for (const row of rows) counts.set(row.sectionId, (counts.get(row.sectionId) ?? 0) + 1);
  const known = sectionOrder
    .filter((id) => counts.has(id))
    .map((id) => ({ sectionId: id, count: counts.get(id) ?? 0 }));
  const unknown = [...counts.keys()]
    .filter((id): id is number => id !== null && !sectionOrder.includes(id))
    .map((id) => ({ sectionId: id, count: counts.get(id) ?? 0 }));
  const withoutSection = counts.has(null)
    ? [{ sectionId: null, count: counts.get(null) ?? 0 }]
    : [];
  return [...known, ...unknown, ...withoutSection];
}

/** Section chip, then local search over code, name and quote description. */
export function filterProductOverview(
  rows: ProductOverview[],
  search: string,
  section: ProductSectionFilter,
): ProductOverview[] {
  const query = search.trim().toLocaleLowerCase('uk');
  return rows.filter(
    (row) =>
      (section === null ||
        (section === 'none' ? row.sectionId === null : row.sectionId === section)) &&
      (!query ||
        [row.code, row.name, row.quoteDescription].some((value) =>
          value?.toLocaleLowerCase('uk').includes(query),
        )),
  );
}
