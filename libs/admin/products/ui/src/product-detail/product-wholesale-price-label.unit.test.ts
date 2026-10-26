import { describe, expect, it } from 'vitest';

import { productWholesalePriceLabel } from './product-wholesale-price-label';

import type { Product } from '@admin/products/model';

const product: Product = {
  id: 42,
  type: 'Sewing',
  name: 'Куртка',
  slug: 'jacket',
  categoryIds: [],
  minimumWholesalePrice: 999,
  createdAtUtc: '',
  updatedAtUtc: null,
};

describe('published price labels', () => {
  it('never labels an unpublished legacy Sewing amount as a current price', () => {
    expect(productWholesalePriceLabel(product)).toBe('Не опубліковано');
    expect(productWholesalePriceLabel({ ...product, sewingPriceStatus: 'error' })).toBe(
      'Ціна недоступна',
    );
    expect(productWholesalePriceLabel({ ...product, sewingPriceStatus: 'loading' })).toBe(
      'Завантаження ціни…',
    );
  });
  it('keeps published zero distinct from missing publication and rejects unverified PPE amounts', () => {
    expect(
      productWholesalePriceLabel({
        ...product,
        minimumWholesalePrice: 0,
        sewingPriceStatus: 'published',
      }),
    ).toBe('0');
    expect(
      productWholesalePriceLabel({ ...product, type: 'Ppe', minimumWholesalePrice: 100 }),
    ).toBe('Потрібна перевірка даних');
  });
});

it('uses explicit PPE status instead of old amounts for enrolled Products', () => {
  const ppe = {
    id: 42,
    type: 'Ppe' as const,
    name: 'ЗІЗ',
    slug: 'ppe',
    categoryIds: [],
    minimumWholesalePrice: 999,
    createdAtUtc: '',
    updatedAtUtc: null,
  };
  expect(productWholesalePriceLabel({ ...ppe, ppePriceStatus: 'blocked' })).toBe(
    'Потрібна перевірка даних',
  );
  expect(productWholesalePriceLabel({ ...ppe, ppePriceStatus: 'loading' })).toBe(
    'Завантаження ціни…',
  );
  expect(productWholesalePriceLabel({ ...ppe, ppePriceStatus: 'error' })).toBe('Ціна недоступна');
  expect(
    productWholesalePriceLabel({
      ...ppe,
      ppePriceStatus: 'calculated',
      minimumWholesalePrice: 136,
    }),
  ).toBe('136');
});
