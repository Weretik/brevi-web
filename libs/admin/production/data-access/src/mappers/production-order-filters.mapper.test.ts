import { describe, expect, it } from 'vitest';

import {
  mapProductionModelSummary,
  mapProductionOrderFilterOptions,
} from './production-order-filters.mapper';

describe('production order filters mappers', () => {
  it('maps filter options', () => {
    expect(
      mapProductionOrderFilterOptions({
        clients: ['Школа'],
        models: [{ code: 'MOD-052', name: 'Куртка «Віол»' }],
        fabrics: [{ code: 'FAB-023', name: 'Грета' }],
        colors: ['Червоний'],
        seasons: ['Зима'],
      }),
    ).toEqual({
      clients: ['Школа'],
      models: [{ code: 'MOD-052', name: 'Куртка «Віол»' }],
      fabrics: [{ code: 'FAB-023', name: 'Грета' }],
      colors: ['Червоний'],
      seasons: ['Зима'],
    });
  });

  it('maps the model summary and rejects a row without category', () => {
    const row = {
      modelCode: null,
      modelName: 'Жилет',
      season: null,
      category: 'Жилет',
      quantity: 4,
      ordersCount: 1,
    };
    expect(mapProductionModelSummary({ rows: [row], totalQuantity: 4 })).toEqual({
      rows: [row],
      totalQuantity: 4,
    });
    expect(() =>
      mapProductionModelSummary({ rows: [{ ...row, category: '' }], totalQuantity: 4 }),
    ).toThrow();
  });
});
