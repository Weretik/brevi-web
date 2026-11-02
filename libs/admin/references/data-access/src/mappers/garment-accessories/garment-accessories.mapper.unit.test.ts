import { describe, expect, it } from 'vitest';

import { mapGarmentAccessories } from './garment-accessories.mapper';
import { parseGarmentAccessoriesResponse } from '../../validators/garment-accessories/garment-accessories-response';

const row = {
  id: 3,
  code: 'FUR-005',
  name: 'Блискавка',
  price: 12.5,
  supplierName: 'Тест',
  unit: 'шт.',
  priceUpdatedAt: null,
  isActive: true,
  comment: null,
};

describe('mapGarmentAccessories', () => {
  it('rejects a damaged row or an unknown unit before it reaches the page', () => {
    expect(() => parseGarmentAccessoriesResponse([{ ...row, price: 'bad' }])).toThrow();
    expect(() => parseGarmentAccessoriesResponse([{ ...row, unit: 'кг' }])).toThrow(
      'Некоректний запис фурнітури.',
    );
  });

  it('maps valid rows and the empty list', () => {
    expect(mapGarmentAccessories(parseGarmentAccessoriesResponse([row]))).toEqual([row]);
    expect(mapGarmentAccessories(parseGarmentAccessoriesResponse([]))).toEqual([]);
  });
});
