import { CATALOG_SORTS } from '@site/catalog/model';

import { formatPrice } from '../../i18n/catalog-dictionary';

import type { CatalogDictionary } from '../../i18n/catalog-dictionary';
import type { CatalogPriceBand, CatalogProductType, CatalogSort } from '@site/catalog/model';

/** One value of a listing filter; `null` is «any». */
export type ListingOption<T extends string> = { value: T | null; label: string };
export type ListingText = CatalogDictionary['listing'];

/** What the listing can filter by: the price ranges, fabrics and kinds its products have. */
export type ListingFacets = {
  bands: readonly CatalogPriceBand[];
  fabrics: readonly string[];
  types: readonly CatalogProductType[];
};

/** A price range as the visitor reads it: «до 500 ₴», «понад 1 000 ₴» or «500 ₴ – 1 000 ₴». */
export function bandLabel(band: CatalogPriceBand, text: ListingText): string {
  if (band.min === null) return `${text.priceUpTo} ${formatPrice(band.max ?? 0)}`;
  if (band.max === null) return `${text.priceOver} ${formatPrice(band.min)}`;
  return `${formatPrice(band.min)} – ${formatPrice(band.max)}`;
}

/** The choices of every filter, each starting with «any», and the orders. */
export function catalogListingOptions(text: ListingText, facets: ListingFacets) {
  return {
    bands: [
      { value: null, label: text.any },
      ...facets.bands.map((band) => ({ value: band.key, label: bandLabel(band, text) })),
    ] as ListingOption<string>[],
    fabrics: [
      { value: null, label: text.any },
      ...facets.fabrics.map((fabric) => ({ value: fabric, label: fabric })),
    ] as ListingOption<string>[],
    types: [
      { value: null, label: text.anyType },
      ...facets.types.map((type) => ({ value: type, label: text.types[type] })),
    ] as ListingOption<CatalogProductType>[],
    sorts: CATALOG_SORTS.map((sort) => ({
      value: sort,
      label: text.sorts[sort],
    })) as ListingOption<CatalogSort>[],
  };
}

export type ListingOptions = ReturnType<typeof catalogListingOptions>;
