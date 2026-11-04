import type { ProductOverviewPage } from '../../entities/product-overview/product-overview';

/** `null` shows every row; `'none'` shows rows without a section. */
export type ProductSectionFilter = number | 'none' | null;

export interface ProductSectionCount {
  sectionId: number | null;
  count: number;
}

/**
 * The server's row counts per section (CAT-013) in the order of «Типи і розділи», then unknown
 * sections, then rows without a section.
 */
export function orderSectionCounts(
  counts: ProductOverviewPage['sections'],
  sectionOrder: readonly number[],
): ProductSectionCount[] {
  const byId = new Map(counts.map((item) => [item.sectionId, item.count]));
  const known = sectionOrder
    .filter((id) => byId.has(id))
    .map((id) => ({ sectionId: id, count: byId.get(id) ?? 0 }));
  const unknown = counts.filter(
    (item): item is { sectionId: number; count: number } =>
      item.sectionId !== null && !sectionOrder.includes(item.sectionId),
  );
  const withoutSection = byId.has(null) ? [{ sectionId: null, count: byId.get(null) ?? 0 }] : [];
  return [...known, ...unknown, ...withoutSection];
}
