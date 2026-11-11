import { CATALOG_TYPES } from '@site/catalog/model';

import type {
  CatalogFabric,
  CatalogPriceTiers,
  CatalogProduct,
  CatalogProductAddress,
  CatalogProductCard,
  CatalogProductType,
  CatalogSpecGroup,
  CatalogTextBlock,
  CatalogTreeNode,
} from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Turns answers of the BreviERP public catalog API into the site's own types. Every answer is checked: a
 * field of another shape throws, and the loader treats the answer as unavailable instead of showing half
 * of a product.
 */
const invalid = (what: string) => new Error(`Public catalog API: unexpected ${what}`);

function record(value: unknown, what: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid(what);
  return value as Record<string, unknown>;
}

function list(value: unknown, what: string): unknown[] {
  if (!Array.isArray(value)) throw invalid(what);
  return value;
}

function text(value: unknown, what: string): string {
  if (typeof value !== 'string') throw invalid(what);
  return value;
}

const optionalText = (value: unknown, what: string): string | null =>
  value === null || value === undefined ? null : text(value, what);

function count(value: unknown, what: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) throw invalid(what);
  return value;
}

function price(value: unknown, what: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw invalid(what);
  return value;
}

const optionalPrice = (value: unknown, what: string): number | null =>
  value === null || value === undefined ? null : price(value, what);

function productType(value: unknown): CatalogProductType {
  if (value !== 'Sewing' && value !== 'Ppe') throw invalid('product type');
  return value;
}

function tiers(value: unknown): CatalogPriceTiers | null {
  if (value === null || value === undefined) return null;
  const prices = record(value, 'prices');
  return {
    retail: price(prices['retail'], 'retail price'),
    wholesale: price(prices['wholesale'], 'wholesale price'),
    largeWholesale: price(prices['largeWholesale'], 'large wholesale price'),
  };
}

/**
 * The tree of the site: the product types that have products, each with its sections. A section has only
 * the Ukrainian name in the Admin, so both languages show it.
 */
export function mapCatalogTree(value: unknown): CatalogTreeNode[] {
  const typeSlugs = new Set(Object.values(CATALOG_TYPES).map((type) => type.slug));
  return list(record(value, 'tree')['types'], 'types').map((item) => {
    const type = record(item, 'type');
    const code = productType(type['type']);
    return {
      ...CATALOG_TYPES[code],
      productCount: count(type['productCount'], 'product count'),
      productType: code,
      sectionId: null,
      children: list(type['sections'], 'sections').map((entry) => {
        const section = record(entry, 'section');
        const id = count(section['id'], 'section id');
        const slug = text(section['slug'], 'section slug');
        const name = text(section['name'], 'section name');
        return {
          // A section may not take the address of a product type.
          slug: typeSlugs.has(slug) ? `${slug}-${id}` : slug,
          name: { uk: name, ru: name },
          productCount: count(section['productCount'], 'product count'),
          productType: code,
          sectionId: id,
          children: [],
        };
      }),
    };
  });
}

export function mapCatalogCard(value: unknown): CatalogProductCard {
  const card = record(value, 'card');
  return {
    slug: text(card['slug'], 'slug'),
    name: text(card['name'], 'name'),
    image: optionalText(card['photoUrl'], 'photo'),
    priceFrom: optionalPrice(card['priceFrom'], 'price'),
  };
}

export function mapCatalogCardPage(value: unknown): { items: CatalogProductCard[]; total: number } {
  const page = record(value, 'card page');
  return {
    items: list(page['items'], 'cards').map(mapCatalogCard),
    total: count(page['total'], 'total'),
  };
}

function mapBlock(value: unknown): CatalogTextBlock | null {
  const block = record(value, 'text block');
  const kind = text(block['kind'], 'block kind');
  if (kind === 'List') {
    const items = list(block['items'] ?? [], 'list items').map((item) => text(item, 'list item'));
    return items.length > 0 ? { type: 'list', items } : null;
  }
  const body = optionalText(block['text'], 'block text') ?? '';
  if (kind === 'Heading') return body ? { type: 'heading', text: body } : null;
  if (kind !== 'Paragraph') throw invalid('block kind');
  const lead = optionalText(block['lead'], 'block lead');
  if (!body && !lead) return null;
  return lead ? { type: 'paragraph', text: body, lead } : { type: 'paragraph', text: body };
}

/** A short fact «Сезон: весна, літо» is a paragraph with a bold label. */
function mapFact(value: unknown): CatalogTextBlock {
  const fact = record(value, 'fact');
  const label = optionalText(fact['label'], 'fact label');
  const body = text(fact['text'], 'fact text');
  return label
    ? { type: 'paragraph', text: body, lead: `${label.replace(/:\s*$/, '')}:` }
    : { type: 'paragraph', text: body };
}

function mapSpecGroup(value: unknown): CatalogSpecGroup {
  const group = record(value, 'spec group');
  return {
    title: optionalText(group['title'], 'spec title'),
    rows: list(group['rows'], 'spec rows').map((item) => {
      const row = record(item, 'spec row');
      return { name: text(row['name'], 'spec name'), value: text(row['value'], 'spec value') };
    }),
  };
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

export function mapCatalogProduct(value: unknown): CatalogProduct {
  const product = record(value, 'product');
  const section =
    product['section'] === null || product['section'] === undefined
      ? null
      : record(product['section'], 'section');
  const textLocale: Locale = product['language'] === 'ru' ? 'ru' : 'uk';
  return {
    slug: text(product['slug'], 'slug'),
    type: productType(product['type']),
    sectionId: section ? count(section['id'], 'section id') : null,
    model: optionalText(product['code'], 'code'),
    name: text(product['name'], 'name'),
    textLocale,
    seo: {
      title: optionalText(product['seoTitle'], 'seo title') ?? '',
      description: optionalText(product['seoDescription'], 'seo description') ?? '',
    },
    photos: list(product['photos'], 'photos').map((item) => ({
      src: text(record(item, 'photo')['url'], 'photo url'),
    })),
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
