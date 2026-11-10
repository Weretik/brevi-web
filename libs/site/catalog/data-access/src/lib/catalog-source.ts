import { CATEGORY_SNAPSHOT } from './snapshot/categories';
import { PRODUCT_SNAPSHOT } from './snapshot/products';

import type { CatalogCategory, CatalogProductCard } from '@site/catalog/model';

const CATEGORIES = new Map(CATEGORY_SNAPSHOT.map((category) => [category.slug, category]));
const PRODUCTS = new Map(PRODUCT_SNAPSHOT.map((product) => [product.slug, product]));

/**
 * Catalog data for server components. Today it reads the snapshot of the live `brevi.com.ua` catalog kept in
 * `snapshot/`; the functions are async so the BreviERP public API can replace the snapshot without touching pages.
 */
export async function getCatalogCategory(slug: string): Promise<CatalogCategory | null> {
  return CATEGORIES.get(slug) ?? null;
}

/** Products of a category in listing order; a slug without a product is skipped. */
export async function getCatalogCategoryProducts(
  category: CatalogCategory,
): Promise<readonly CatalogProductCard[]> {
  return category.productSlugs.flatMap((slug) => {
    const product = PRODUCTS.get(slug);
    return product ? [product] : [];
  });
}

export async function getCatalogCategorySlugs(): Promise<readonly string[]> {
  return CATEGORY_SNAPSHOT.map((category) => category.slug);
}
