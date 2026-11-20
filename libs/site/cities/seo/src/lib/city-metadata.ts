import { CITIES, cityText } from '@site/cities/model';
import { cityPagePath } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { CityPageKind, Locale } from '@site/core/i18n';
import type { SitemapPage } from '@site/core/seo';
import type { Metadata } from 'next';

const KINDS: readonly CityPageKind[] = ['sewing', 'workwear'];

/**
 * Title, description, canonical and `hreflang` of a city page; the city must be one of `CITIES`. The title is
 * written for the city and the layout template adds « — Brevi».
 */
export function buildCityMetadata(kind: CityPageKind, citySlug: string, locale: Locale): Metadata {
  const { title, description } = cityText(kind, citySlug, locale);
  return buildPageMetadata({ locale, path: cityPagePath(kind, citySlug), title, description });
}

/** Both kinds of page of every city, for the sitemap; every page has both languages. */
export function citySitemapPages(): SitemapPage[] {
  return KINDS.flatMap((kind) => CITIES.map((city) => ({ path: cityPagePath(kind, city.slug) })));
}
