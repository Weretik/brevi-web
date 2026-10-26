import { describe, expect, it } from 'vitest';

import { mapProductDetail } from '../product-detail.mapper';
import { mapProduct } from '../product.mapper';

const product = {
  id: 1,
  name: 'Куртка',
  slug: 'jacket',
  type: 'Sewing',
  categoryIds: [],
  mainPhoto: null,
  minimumWholesalePrice: 999,
  createdAtUtc: '2026-10-25T10:00:00Z',
  updatedAtUtc: null,
};

describe('published Sewing price cutover', () => {
  it('does not expose the legacy formula amount as a Sewing price', () => {
    expect(mapProduct(product).minimumWholesalePrice).toBe(0);
  });

  it('does not expose old PPE metadata amounts as current prices', () => {
    expect(mapProduct({ ...product, type: 'Ppe' })).toMatchObject({
      minimumWholesalePrice: 0,
      ppePriceStatus: 'loading',
    });
  });

  it('accepts imported Sewing Products without legacy manufacturing details', () => {
    expect(() =>
      mapProductDetail({
        ...product,
        ruName: 'Куртка',
        descriptionUk: '',
        descriptionRu: '',
        categories: [],
        photos: [],
        informationBlocks: [],
        characteristicTables: [],
        sewing: null,
        ppe: null,
      }),
    ).not.toThrow();
  });
});
