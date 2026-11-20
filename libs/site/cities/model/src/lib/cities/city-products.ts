import { pickFeaturedProducts } from '@site/catalog/model';

import type { CatalogProductCard } from '@site/catalog/model';
import type { CityPageKind } from '@site/core/i18n';

/** How many models the carousel of a city page shows: four at once on a wide screen, the rest by the arrows. */
export const CITY_PRODUCT_COUNT = 8;

/**
 * Models for the carousel of a city page, each with a photo and a price. «Пошиття» shows own sewing only.
 * «Робочий одяг» takes own sewing and protective equipment in turn, so both are seen in the first four cards.
 */
export function cityPageProducts(
  kind: CityPageKind,
  products: readonly CatalogProductCard[],
  count = CITY_PRODUCT_COUNT,
): CatalogProductCard[] {
  const sewing = pickFeaturedProducts(
    products.filter((product) => product.type === 'Sewing'),
    count,
  );
  if (kind === 'sewing') return sewing;

  const ppe = pickFeaturedProducts(
    products.filter((product) => product.type === 'Ppe'),
    count,
  );
  const mixed: CatalogProductCard[] = [];
  for (
    let index = 0;
    mixed.length < count && index < Math.max(sewing.length, ppe.length);
    index++
  ) {
    for (const product of [sewing[index], ppe[index]]) {
      if (product && mixed.length < count) mixed.push(product);
    }
  }
  return mixed;
}
