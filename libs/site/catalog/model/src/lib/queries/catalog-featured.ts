import type { CatalogProductCard } from '../entities/catalog-category';

/**
 * Products for a carousel such as «Популярні моделі» on the home page: the first ones of the catalog order
 * (own sewing first, as staff sort them in the Admin) that have a photo and a price, so every card shows
 * what it costs and a «Купити» button.
 */
export function pickFeaturedProducts(
  products: readonly CatalogProductCard[],
  count: number,
): CatalogProductCard[] {
  return products
    .filter((product) => product.image !== null && product.priceFrom !== null)
    .slice(0, count);
}
