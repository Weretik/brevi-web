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
  agreement: '/agreement',
  /** Private request list: never indexed, links to it carry `rel="nofollow"`. */
  request: '/request',
} as const;

/** Locale-free path of a product page: `/product/<slug>`. */
export function catalogProductPath(slug: string): string {
  return `/product/${slug}`;
}

/** Locale-free path of a catalog category: `/catalog/<slug>`. Every level of the tree has a flat URL. */
export function catalogCategoryPath(slug: string): string {
  return `${SITE_PATHS.catalog}/${slug}`;
}
