import { mapBlock, mapFact, mapSpecGroup } from './public-catalog-text';
import {
  list,
  optionalPrice,
  optionalText,
  productType,
  record,
  text,
  tiers,
} from './public-catalog-values';

import type { CatalogFabric, CatalogProduct, CatalogProductAddress } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

function mapLink(value: unknown): { slug: string; name: string } {
  const link = record(value, 'category link');
  return { slug: text(link['slug'], 'category slug'), name: text(link['name'], 'category name') };
}

export function mapCatalogProduct(value: unknown): CatalogProduct {
  const product = record(value, 'product');
  const textLocale: Locale = product['language'] === 'ru' ? 'ru' : 'uk';
  return {
    slug: text(product['slug'], 'slug'),
    type: productType(product['type']),
    categories: list(product['categories'], 'categories').map((item) => {
      const category = record(item, 'category');
      const parent = category['parent'];
      return {
        ...mapLink(category),
        parent: parent === null || parent === undefined ? null : mapLink(parent),
      };
    }),
    model: optionalText(product['code'], 'code'),
    name: text(product['name'], 'name'),
    textLocale,
    seo: {
      title: optionalText(product['seoTitle'], 'seo title') ?? '',
      description: optionalText(product['seoDescription'], 'seo description') ?? '',
    },
    photos: list(product['photos'], 'photos').map((item) => {
      const photo = record(item, 'photo');
      return {
        src: text(photo['url'], 'photo url'),
        thumbnail: optionalText(photo['thumbnailUrl'], 'small photo'),
      };
    }),
    summary: list(product['summary'], 'summary').map(mapFact),
    description: list(product['description'], 'description').flatMap((item) => {
      const block = mapBlock(item);
      return block ? [block] : [];
    }),
    specs: list(product['specs'], 'specs')
      .map(mapSpecGroup)
      .filter((group) => group.rows.length > 0),
    priceFrom: optionalPrice(product['priceFrom'], 'price'),
    prices: tiers(product['prices']),
    fabrics: list(product['variants'], 'variants').map(mapFabric),
  };
}

export function mapCatalogAddresses(value: unknown): CatalogProductAddress[] {
  return list(value, 'addresses').map((item) => {
    const address = record(item, 'address');
    return {
      slug: text(address['slug'], 'slug'),
      updatedAt: text(address['updatedAtUtc'], 'update time'),
      hasRussian: address['hasRussian'] === true,
    };
  });
}

function mapFabric(value: unknown): CatalogFabric {
  const fabric = record(value, 'fabric');
  const sku = text(fabric['sku'], 'sku');
  return {
    sku,
    name: optionalText(fabric['fabricName'], 'fabric name') ?? sku,
    details: optionalText(fabric['fabricDetails'], 'fabric details'),
    prices: tiers(fabric['prices']),
  };
}
