import { SITE_PATHS } from '@site/core/i18n';

import type { ShellDictionary } from '../i18n/shell-dictionary';

export type NavLinkKey = keyof ShellDictionary['links'];

export type NavLink = { key: NavLinkKey; path: string };

/** The site paths, checked here to cover every menu and footer link. */
export const SHELL_PATHS = SITE_PATHS satisfies Record<NavLinkKey | 'request', string>;

const links = (...keys: NavLinkKey[]): readonly NavLink[] =>
  keys.map((key) => ({ key, path: SHELL_PATHS[key] }));

/** Header menu after the «Каталог» button. */
export const MAIN_NAV_LINKS = links(
  'logoPrinting',
  'wholesale',
  'industries',
  'production',
  'ourWork',
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
