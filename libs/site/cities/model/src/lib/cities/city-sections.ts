import { CITY_PAGE_ROOTS, SITE_PATHS, cityPagePath } from '@site/core/i18n';

import { CITIES } from './city-list';

import type { CatalogSection } from '@site/catalog/model';
import type { CityPageKind } from '@site/core/i18n';

const SECTION_LABELS: Record<CityPageKind, CatalogSection['label']> = {
  sewing: { uk: 'Пошиття', ru: 'Пошив' },
  workwear: { uk: 'Робочий одяг', ru: 'Рабочая одежда' },
};

const ALL_CITIES = { uk: 'Усі міста', ru: 'Все города' };

/**
 * «Пошиття» and «Робочий одяг» for the catalog menu: the cities are the subsections and lead to the city
 * pages; the section itself leads to «Регіони», which links every city.
 */
export function citySections(): CatalogSection[] {
  return (Object.keys(CITY_PAGE_ROOTS) as CityPageKind[]).map((kind) => ({
    key: kind,
    slug: kind,
    label: SECTION_LABELS[kind],
    path: SITE_PATHS.regions,
    allLabel: ALL_CITIES,
    items: CITIES.map((city) => ({
      key: city.slug,
      slug: city.slug,
      label: city.name,
      path: cityPagePath(kind, city.slug),
    })),
  }));
}
