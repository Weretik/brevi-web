import { pickFeaturedProducts } from './catalog-featured';

import type { CatalogProductCard } from '../entities/catalog-category';

const card = (slug: string, overrides: Partial<CatalogProductCard> = {}): CatalogProductCard => ({
  slug,
  type: 'Sewing',
  code: null,
  name: slug,
  image: `https://media.example/${slug}.webp`,
  priceFrom: 1000,
  fabrics: [],
  ...overrides,
});

describe('pickFeaturedProducts', () => {
  it('takes products with a photo and a price, in the catalog order', () => {
    const products = [
      card('a'),
      card('no-photo', { image: null }),
      card('no-price', { priceFrom: null }),
      card('b'),
      card('c', { type: 'Ppe' }),
    ];

    expect(pickFeaturedProducts(products, 5).map((product) => product.slug)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('stops at the asked number', () => {
    const products = Array.from({ length: 9 }, (_, index) => card(`p${index}`));

    expect(pickFeaturedProducts(products, 5)).toHaveLength(5);
  });
});
