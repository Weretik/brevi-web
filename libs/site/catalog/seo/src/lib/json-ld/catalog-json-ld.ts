import { COMPANY, siteConfig } from '@site/core/config';
import { catalogProductPath, localizedPath } from '@site/core/i18n';

import { productDescription } from '../metadata/catalog-product-metadata';

import type { CatalogProduct } from '@site/catalog/model';
import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

/** Every price the page shows: of each fabric, or of the product itself. */
function shownPrices(product: CatalogProduct): number[] {
  return [product.prices, ...product.fabrics.map((fabric) => fabric.prices)].flatMap((tiers) =>
    tiers ? [tiers.retail, tiers.wholesale, tiers.largeWholesale] : [],
  );
}

/**
 * `Product` with the price range the page shows, in hryvnias; a product whose price a manager quotes has
 * no offer, because a made-up price would mislead search engines. `categoryName` is the product's own
 * category in the page language.
 */
export function buildCatalogProductJsonLd(
  locale: Locale,
  product: CatalogProduct,
  categoryName: string | null,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const prices = shownPrices(product);
  const url = `${config.siteUrl}${localizedPath(locale, catalogProductPath(product.slug))}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: productDescription(product),
    url,
    image: product.photos.map((photo) => photo.src),
    brand: { '@type': 'Brand', name: COMPANY.name },
    ...(product.model ? { sku: product.model, mpn: product.model } : {}),
    ...(categoryName ? { category: categoryName } : {}),
    ...(prices.length > 0
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'UAH',
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: Math.max(1, product.fabrics.length),
            url,
          },
        }
      : {}),
  };
}

/** `ItemList` of a listing: the products in the order the page shows them; `path` is the localized path. */
export function buildCatalogItemListJsonLd(
  items: readonly { name: string; path: string }[],
  config: SiteConfig = siteConfig,
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${config.siteUrl}${item.path}`,
    })),
  };
}
