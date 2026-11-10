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
function firstParagraph(product: CatalogProduct, locale: Locale): string {
  const blocks = [...product.description[locale], ...product.summary[locale]];
  const text = blocks.flatMap((block) => (block.type === 'paragraph' ? [block.text] : []))[0] ?? '';
  if (text.length <= DESCRIPTION_LIMIT) return text;
  const cut = text.slice(0, DESCRIPTION_LIMIT - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** Search snippet of a product: the catalog's own description, or the start of the product text. */
export function productDescription(product: CatalogProduct, locale: Locale): string {
  return product.seo[locale].description || firstParagraph(product, locale) || product.name[locale];
}

/** Metadata of a product page; the main photo becomes the Open Graph image. */
export function buildCatalogProductMetadata(locale: Locale, product: CatalogProduct): Metadata {
  const metadata = buildPageMetadata({
    locale,
    path: catalogProductPath(product.slug),
    title: product.seo[locale].title || product.name[locale],
    description: productDescription(product, locale),
  });
  const [photo] = product.photos;

  return photo
    ? {
        ...metadata,
        openGraph: {
          ...metadata.openGraph,
          images: [{ url: photo.src, width: photo.width, height: photo.height }],
        },
      }
    : metadata;
}

/**
 * `Product` without an offer: the site shows no prices, and a made-up price would mislead search engines.
 * `categoryName` is the product's own category in the page language.
 */
export function buildCatalogProductJsonLd(
  locale: Locale,
  product: CatalogProduct,
  categoryName: string | null,
  config: SiteConfig = siteConfig,
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description: productDescription(product, locale),
    url: `${config.siteUrl}${localizedPath(locale, catalogProductPath(product.slug))}`,
    image: product.photos.map((photo) => `${config.siteUrl}${photo.src}`),
    brand: { '@type': 'Brand', name: COMPANY.name },
    ...(product.model ? { sku: product.model, mpn: product.model } : {}),
    ...(categoryName ? { category: categoryName } : {}),
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
