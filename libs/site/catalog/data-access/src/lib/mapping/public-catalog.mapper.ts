import { mapBlock } from './public-catalog-text';
import {
  count,
  list,
  optionalPrice,
  optionalText,
  productType,
  record,
  text,
} from './public-catalog-values';

import type { CatalogCategoryPage, CatalogProductCard, CatalogTreeNode } from '@site/catalog/model';

/**
 * Turns answers of the BreviERP public catalog API into the site's own types. Every answer is checked: a
 * field of another shape throws, and the loader treats the answer as unavailable instead of showing half
 * of a product.
 */
function mapTreeNode(value: unknown): CatalogTreeNode {
  const category = record(value, 'category');
  return {
    slug: text(category['slug'], 'category slug'),
    name: {
      uk: text(category['nameUk'], 'category name'),
      ru: text(category['nameRu'], 'category name'),
    },
    productCount: count(category['productCount'], 'product count'),
    children: list(category['children'], 'subcategories').map(mapTreeNode),
  };
}

/** The category tree of the site as staff keep it in the Admin, with names in both languages. */
export function mapCatalogTree(value: unknown): CatalogTreeNode[] {
  return list(record(value, 'tree')['categories'], 'categories').map(mapTreeNode);
}

/** What staff wrote about a category; its place in the tree is added by the source. */
export function mapCatalogCategoryText(
  value: unknown,
): Pick<CatalogCategoryPage, 'name' | 'textLocale' | 'seo' | 'text'> {
  const page = record(value, 'category page');
  return {
    name: text(page['name'], 'category name'),
    textLocale: page['language'] === 'ru' ? 'ru' : 'uk',
    seo: {
      title: optionalText(page['seoTitle'], 'seo title') ?? '',
      description: optionalText(page['seoDescription'], 'seo description') ?? '',
    },
    text: list(page['text'], 'category text').flatMap((item) => {
      const block = mapBlock(item);
      return block ? [block] : [];
    }),
  };
}

export function mapCatalogCard(value: unknown): CatalogProductCard {
  const card = record(value, 'card');
  return {
    slug: text(card['slug'], 'slug'),
    type: productType(card['type']),
    code: optionalText(card['code'], 'code'),
    name: text(card['name'], 'name'),
    image: optionalText(card['photoUrl'], 'photo'),
    priceFrom: optionalPrice(card['priceFrom'], 'price'),
    // An API older than the fabric filter sends no list: the listing then simply has no fabric filter.
    fabrics:
      card['fabrics'] === undefined
        ? []
        : list(card['fabrics'], 'fabrics').map((fabric) => text(fabric, 'fabric')),
  };
}

export function mapCatalogCardPage(value: unknown): { items: CatalogProductCard[]; total: number } {
  const page = record(value, 'card page');
  return {
    items: list(page['items'], 'cards').map(mapCatalogCard),
    total: count(page['total'], 'total'),
  };
}
