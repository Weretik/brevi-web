import { localizedPath } from './localized-path';
import { SITE_PATHS } from './site-paths';

import type { Locale } from './locales';

/** Query parameter of the request page with the product a visitor wants to buy. */
export const REQUEST_PRODUCT_PARAM = 'product';

/**
 * Link of every «Залишити заявку» and «Купити»: the request page, which a click inside the site opens as a
 * window over the current page. With a product the form opens with its name in «Що потрібно пошити?».
 */
export function requestHref(locale: Locale, product?: string): string {
  return withRequestProduct(localizedPath(locale, SITE_PATHS.request), product);
}

/** Adds the product to a request link that a component got from its page, for example a product card. */
export function withRequestProduct(href: string, product?: string): string {
  const name = product?.trim();
  return name ? `${href}?${new URLSearchParams({ [REQUEST_PRODUCT_PARAM]: name })}` : href;
}
