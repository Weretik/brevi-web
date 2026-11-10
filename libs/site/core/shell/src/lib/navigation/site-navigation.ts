import type { ShellDictionary } from '../i18n/shell-dictionary';

export type NavLinkKey = keyof ShellDictionary['links'];

export type NavLink = { key: NavLinkKey; path: string };

/**
 * Locale-free paths of the pages the shell links to. The names follow the Angular storefront routes and the
 * URL policy in docs/architecture/site/platform/seo-architecture.md.
 */
export const SHELL_PATHS = {
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
} as const satisfies Record<NavLinkKey | 'request', string>;

const links = (...keys: NavLinkKey[]): readonly NavLink[] =>
  keys.map((key) => ({ key, path: SHELL_PATHS[key] }));

/** Header menu after «Каталог», in the order of the «Строчка» mockup. */
export const MAIN_NAV_LINKS = links(
  'logoPrinting',
  'wholesale',
  'industries',
  'production',
  'contacts',
);

export const FOOTER_COMPANY_LINKS = links(
  'production',
  'ourWork',
  'certificates',
  'articles',
  'regions',
  'contacts',
);

export const FOOTER_BUYER_LINKS = links(
  'wholesale',
  'logoPrinting',
  'industries',
  'deliveryAndPayment',
  'returnsExchanges',
  'agreement',
);
