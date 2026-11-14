import {
  EMPTY_CATALOG_CHOICE,
  applyCatalogChoice,
  catalogFabrics,
  catalogPriceBands,
  countCatalogFilters,
  readCatalogChoice,
  writeCatalogChoice,
} from './catalog-listing';
import { catalogCategoryFamily } from '../entities/catalog-tree';

import type { CatalogProductType, CatalogTreeNode } from '../entities/catalog-tree';

const item = (
  slug: string,
  priceFrom: number | null,
  type: CatalogProductType = 'Sewing',
  fabrics: string[] = [],
) => ({ slug, priceFrom, type, fabrics });
const products = [
  item('a', 1480, 'Sewing', ['Грета', 'Саржа']),
  item('b', 890, 'Sewing', ['Грета']),
  item('c', null),
  item('d', 1350, 'Sewing', ['Оксфорд', 'грета']),
  item('e', 1040, 'Ppe'),
  item('f', 2400, 'Sewing', ['Саржа']),
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

    expect(slugs({ type: 'Ppe', band: null, fabric: null, sort: 'default' })).toEqual(['e']);
    expect(slugs({ type: null, band: '1000-1400', fabric: null, sort: 'cheap' })).toEqual([
      'e',
      'h',
      'd',
    ]);
    expect(slugs({ type: null, band: null, fabric: 'Грета', sort: 'default' })).toEqual([
      'a',
      'b',
      'd',
    ]);
    expect(slugs({ type: 'Sewing', band: null, fabric: null, sort: 'cheap' })).toEqual([
      'g',
      'b',
      'h',
      'd',
      'a',
      'f',
      'c',
    ]);
    const expensive = slugs({ type: null, band: null, fabric: null, sort: 'expensive' });
    expect(expensive.slice(0, 2)).toEqual(['f', 'a']);
    expect(expensive.at(-1)).toBe('c');
  });

  it('offers the fabrics of a listing, the most common first', () => {
    expect(catalogFabrics(products)).toEqual(['Грета', 'Саржа', 'Оксфорд']);
    expect(
      catalogFabrics([item('a', 1, 'Sewing', ['Грета']), item('b', 2, 'Sewing', ['грета'])]),
    ).toEqual([]);
  });

  it('reads and writes the choice in the address', () => {
    const options = {
      bands: catalogPriceBands(products.map((product) => product.priceFrom)),
      fabrics: catalogFabrics(products),
    };
    const choice = readCatalogChoice(
      new URLSearchParams(
        'type=Ppe&price=1000-1400&fabric=%D0%B3%D1%80%D0%B5%D1%82%D0%B0&sort=cheap&utm=x',
      ),
      options,
    );
    expect(choice).toEqual({ type: 'Ppe', band: '1000-1400', fabric: 'Грета', sort: 'cheap' });
    expect(countCatalogFilters(choice)).toBe(3);
    expect(
      readCatalogChoice(new URLSearchParams('type=Car&price=1-2&fabric=Шовк&sort=new'), options),
    ).toEqual(EMPTY_CATALOG_CHOICE);
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
