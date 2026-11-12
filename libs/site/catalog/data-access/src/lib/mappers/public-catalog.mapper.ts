import type {
  CatalogCategoryPage,
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

function mapLink(value: unknown): { slug: string; name: string } {
  const link = record(value, 'category link');
  return { slug: text(link['slug'], 'category slug'), name: text(link['name'], 'category name') };
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
