import type { CatalogLocalized, CatalogProductType } from './catalog-tree';

/**
 * Address and name of the two product types on the site. The Admin knows a type only by its code, so the
 * site names it; sections under a type come from the Admin with their own names.
 */
export const CATALOG_TYPES: Record<CatalogProductType, { slug: string; name: CatalogLocalized }> = {
  Sewing: {
    slug: 'spetsodyah',
    name: { uk: 'Спецодяг власного пошиття', ru: 'Спецодежда собственного пошива' },
  },
  Ppe: {
    slug: 'zasoby-zakhystu',
    name: { uk: 'Засоби індивідуального захисту', ru: 'Средства индивидуальной защиты' },
  },
};
