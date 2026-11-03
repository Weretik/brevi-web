import { productSectionTypes } from '../../entities/product-sections/product-section';

import type {
  ProductSection,
  ProductSectionType,
} from '../../entities/product-sections/product-section';

/** `null` shows both product types. */
export type ProductSectionTypeFilter = ProductSectionType | null;

export interface ProductSectionTypeCount {
  type: ProductSectionType;
  count: number;
}

export function countProductSectionsByType(
  rows: readonly ProductSection[],
): ProductSectionTypeCount[] {
  return productSectionTypes.map((type) => ({
    type,
    count: rows.filter((row) => row.type === type).length,
  }));
}

/** Product type chip, then local search over the name and comment. */
export function filterProductSections(
  rows: ProductSection[],
  search: string,
  type: ProductSectionTypeFilter,
): ProductSection[] {
  const query = search.trim().toLocaleLowerCase('uk');
  return rows.filter(
    (row) =>
      (type === null || row.type === type) &&
      (!query ||
        [row.name, row.comment].some((value) => value?.toLocaleLowerCase('uk').includes(query))),
  );
}
