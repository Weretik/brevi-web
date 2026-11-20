import { cityPageProducts } from './city-products';

import type { CatalogProductCard } from '@site/catalog/model';

const card = (slug: string, type: CatalogProductCard['type'], image: string | null = 'x.jpg') => ({
  slug,
  type,
  code: null,
  name: slug,
  image,
  priceFrom: 100,
  fabrics: [],
});

const PRODUCTS: CatalogProductCard[] = [
  card('kostium', 'Sewing'),
  card('bez-foto', 'Sewing', null),
  card('kurtka', 'Sewing'),
  card('rukavytsi', 'Ppe'),
  card('okuliary', 'Ppe'),
  card('kaska', 'Ppe'),
];

describe('cityPageProducts', () => {
  it('shows own sewing with a photo on «Пошиття»', () => {
    expect(cityPageProducts('sewing', PRODUCTS).map((item) => item.slug)).toEqual([
      'kostium',
      'kurtka',
    ]);
  });

  it('takes sewing and protective equipment in turn on «Робочий одяг»', () => {
    expect(cityPageProducts('workwear', PRODUCTS, 4).map((item) => item.slug)).toEqual([
      'kostium',
      'rukavytsi',
      'kurtka',
      'okuliary',
    ]);
    expect(cityPageProducts('workwear', PRODUCTS).map((item) => item.slug)).toEqual([
      'kostium',
      'rukavytsi',
      'kurtka',
      'okuliary',
      'kaska',
    ]);
  });

  it('is empty when the catalog has nothing to show', () => {
    expect(cityPageProducts('workwear', [])).toEqual([]);
  });
});
