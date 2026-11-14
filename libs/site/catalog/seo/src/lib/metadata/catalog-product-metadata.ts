import { plainCatalogText } from '@site/catalog/model';
import { catalogProductPath, localizedPath } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { CatalogProduct } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const DESCRIPTION_LIMIT = 160;

/** The first paragraph of the product description, cut at a word within the search snippet length. */
function firstParagraph(product: CatalogProduct): string {
  const blocks = [...product.description, ...product.summary];
  const text = plainCatalogText(
    blocks.flatMap((block) => (block.type === 'paragraph' ? [block.text] : []))[0] ?? '',
  );
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
