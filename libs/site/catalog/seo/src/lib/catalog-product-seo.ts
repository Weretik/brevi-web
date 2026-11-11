import { COMPANY, siteConfig } from '@site/core/config';
import { catalogProductPath, localizedPath } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { CatalogProduct } from '@site/catalog/model';
import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';
import type { Metadata } from 'next';

const DESCRIPTION_LIMIT = 160;

/** The first paragraph of the product description, cut at a word within the search snippet length. */
function firstParagraph(product: CatalogProduct): string {
  const blocks = [...product.description, ...product.summary];
  const text = blocks.flatMap((block) => (block.type === 'paragraph' ? [block.text] : []))[0] ?? '';
  if (text.length <= DESCRIPTION_LIMIT) return text;
  const cut = text.slice(0, DESCRIPTION_LIMIT - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** Search snippet of a product: the description staff wrote for search, or the start of the product text. */
export function productDescription(product: CatalogProduct): string {
  return product.seo.description || firstParagraph(product) || product.name;
}

/**
 * Metadata of a product page; the main photo becomes the Open Graph image. A product without Russian texts
 * shows the Ukrainian ones on the Russian page, so that page names the Ukrainian one as canonical and has no
 * language alternates.
 */
export function buildCatalogProductMetadata(locale: Locale, product: CatalogProduct): Metadata {
  const path = catalogProductPath(product.slug);
  const page = buildPageMetadata({
    locale,
    path,
    title: product.seo.title || product.name,
    description: productDescription(product),
  });
  const original = localizedPath(product.textLocale, path);
  const metadata: Metadata =
    product.textLocale === locale
      ? page
      : {
          ...page,
          alternates: { canonical: original },
          openGraph: { ...page.openGraph, url: original },
        };
  const [photo] = product.photos;

  return photo
    ? { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: photo.src }] } }
    : metadata;
}

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
