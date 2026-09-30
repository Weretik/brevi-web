import { describe, expect, it } from 'vitest';

import { mapGarmentAccessories } from './garment-accessories.mapper';

describe('mapGarmentAccessories', () => {
  it('rejects a damaged list row before it reaches the page', () => {
    expect(() =>
      mapGarmentAccessories([{ id: 3, name: 'Блискавка', price: 'bad', supplierName: 'Тест' }]),
    ).toThrow();
  });

  it('maps valid rows and the empty list', () => {
    expect(
      mapGarmentAccessories([{ id: 3, name: 'Блискавка', price: 12.5, supplierName: 'Тест' }]),
    ).toEqual([{ id: 3, name: 'Блискавка', price: 12.5, supplierName: 'Тест' }]);
    expect(mapGarmentAccessories([])).toEqual([]);
  });
});
