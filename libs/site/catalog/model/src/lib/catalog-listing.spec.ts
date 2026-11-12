import {
  EMPTY_CATALOG_CHOICE,
  applyCatalogChoice,
  catalogPriceBands,
  countCatalogFilters,
  readCatalogChoice,
  writeCatalogChoice,
} from './catalog-listing';
import { catalogCategoryFamily } from './catalog-tree';

import type { CatalogProductType, CatalogTreeNode } from './catalog-tree';

const item = (slug: string, priceFrom: number | null, type: CatalogProductType = 'Sewing') => ({
  slug,
  priceFrom,
  type,
});
const products = [
  item('a', 1480),
  item('b', 890),
  item('c', null),
  item('d', 1350),
  item('e', 1040, 'Ppe'),
  item('f', 2400),
  item('g', 650),
  item('h', 1190),
];

describe('catalog listing', () => {
  it('splits prices into three round ranges', () => {
    const bands = catalogPriceBands(products.map((product) => product.priceFrom));
    expect(bands).toEqual([
      { key: '0-1000', min: null, max: 1000 },
      { key: '1000-1400', min: 1000, max: 1400 },
      { key: '1400-', min: 1400, max: null },
    ]);
  });

  it('gives no ranges to a listing with few prices', () => {
    expect(catalogPriceBands([100, 200, 300, null, null])).toEqual([]);
    expect(catalogPriceBands([500, 500, 500, 500, 500, 500])).toEqual([]);
  });

  it('keeps the order of the category until the visitor chooses another', () => {
    const bands = catalogPriceBands(products.map((product) => product.priceFrom));
    expect(applyCatalogChoice(products, EMPTY_CATALOG_CHOICE, bands)).toEqual(products);
  });

  it('filters by kind and price range and sorts with unpriced products last', () => {
    const bands = catalogPriceBands(products.map((product) => product.priceFrom));
    const slugs = (choice: Parameters<typeof applyCatalogChoice>[1]) =>
      applyCatalogChoice(products, choice, bands).map((product) => product.slug);

    expect(slugs({ type: 'Ppe', band: null, sort: 'default' })).toEqual(['e']);
    expect(slugs({ type: null, band: '1000-1400', sort: 'cheap' })).toEqual(['e', 'h', 'd']);
    expect(slugs({ type: 'Sewing', band: null, sort: 'cheap' })).toEqual([
      'g',
      'b',
      'h',
      'd',
      'a',
      'f',
      'c',
    ]);
    expect(slugs({ type: null, band: null, sort: 'expensive' }).slice(0, 2)).toEqual(['f', 'a']);
    expect(slugs({ type: null, band: null, sort: 'expensive' }).at(-1)).toBe('c');
  });

  it('reads and writes the choice in the address', () => {
    const bands = catalogPriceBands(products.map((product) => product.priceFrom));
    const choice = readCatalogChoice(
      new URLSearchParams('type=Ppe&price=1000-1400&sort=cheap&utm=x'),
      bands,
    );
    expect(choice).toEqual({ type: 'Ppe', band: '1000-1400', sort: 'cheap' });
    expect(countCatalogFilters(choice)).toBe(2);
    expect(readCatalogChoice(new URLSearchParams('type=Car&price=1-2&sort=new'), bands)).toEqual(
      EMPTY_CATALOG_CHOICE,
    );
    expect(
      writeCatalogChoice(new URLSearchParams('utm=x&sort=cheap'), EMPTY_CATALOG_CHOICE).toString(),
    ).toBe('utm=x');
  });
});

describe('category tabs', () => {
  const node = (slug: string, children: CatalogTreeNode[] = []): CatalogTreeNode => ({
    slug,
    name: { uk: slug, ru: slug },
    productCount: 1,
    children,
  });
  const vests = node('zhylety');
  const jackets = node('kurtky');
  const winter = node('zyma', [jackets, vests]);
  const welders = node('zvaryuvalnyky');

  it('shows the subcategories of a category', () => {
    expect(catalogCategoryFamily([winter])).toEqual({ parent: winter, items: [jackets, vests] });
  });

  it('shows the neighbours of a subcategory', () => {
    expect(catalogCategoryFamily([winter, vests])).toEqual({
      parent: winter,
      items: [jackets, vests],
    });
  });

  it('shows no tabs for a category without subcategories', () => {
    expect(catalogCategoryFamily([welders])).toBeNull();
  });
});
