/**
 * Locale-free paths of the site's pages. The names follow the Angular storefront routes and the URL policy in
 * docs/architecture/site/platform/seo-architecture.md. Pass a path to `localizedPath` to get a link.
 */
export const SITE_PATHS = {
  catalog: '/catalog',
  logoPrinting: '/logo-printing',
  wholesale: '/order-in-bulk',
  industries: '/industries',
  production: '/about-company',
  contacts: '/contacts',
  ourWork: '/our-work',
  certificates: '/certificates',
  articles: '/articles',
  regions: '/regions',
  deliveryAndPayment: '/delivery-and-payment',
  returnsExchanges: '/returns-exchanges',
  sizeChart: '/size-chart',
  agreement: '/agreement',
  /** Private request list: never indexed, links to it carry `rel="nofollow"`. */
  request: '/request',
  /** Search results: never indexed, every query is its own address. */
  search: '/search',
} as const;

/** Locale-free path of a product page: `/product/<slug>`. */
export function catalogProductPath(slug: string): string {
  return `/product/${slug}`;
}

/** Locale-free path of a catalog category: `/catalog/<slug>`. Every level of the tree has a flat URL. */
export function catalogCategoryPath(slug: string): string {
  return `${SITE_PATHS.catalog}/${slug}`;
}

/**
 * Address of the catalog search index of a language: every product and category for the search box. A
 * route handler outside the localized pages, so the locale rewrite of old-site addresses skips it.
 */
export function catalogSearchIndexPath(locale: string): string {
  return `/api/catalog-search/${locale}`;
}

/** The two kinds of city page: own sewing to order, and ready workwear to buy. */
export type CityPageKind = 'sewing' | 'workwear';

/** Locale-free root of each kind of city page; a city page is `<root>/<citySlug>`. */
export const CITY_PAGE_ROOTS: Record<CityPageKind, string> = {
  sewing: '/sewing',
  workwear: '/workwear',
};

/** Locale-free path of a city page: `/sewing/kharkiv` or `/workwear/kharkiv`. */
export function cityPagePath(kind: CityPageKind, citySlug: string): string {
  return `${CITY_PAGE_ROOTS[kind]}/${citySlug}`;
}
