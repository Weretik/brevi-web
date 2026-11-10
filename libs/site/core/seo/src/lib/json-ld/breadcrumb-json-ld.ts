import { siteConfig } from '@site/core/config';

import type { JsonLdData } from './json-ld';
import type { SiteConfig } from '@site/core/config';

/** `BreadcrumbList` for the visible breadcrumb trail; `path` is the localized path, for example `/uk/contacts`. */
export function buildBreadcrumbJsonLd(
  items: readonly { name: string; path: string }[],
  config: SiteConfig = siteConfig,
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${config.siteUrl}${item.path}`,
    })),
  };
}
