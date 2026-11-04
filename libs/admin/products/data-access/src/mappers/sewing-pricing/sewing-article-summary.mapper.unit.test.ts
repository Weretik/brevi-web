import { describe, expect, it } from 'vitest';

import { mapSewingArticleSummary } from './sewing-article-summary.mapper';

const tiers = { retail: 900, wholesale: 820, largeWholesale: 780 };
const costs = {
  materials: 300,
  otherCosts: 0,
  totalMinutes: 54,
  minuteCost: 2,
  seamstress: 120,
  cutting: 10,
  master: 5,
  manager: 5,
  bonus: 2,
  overhead: 40,
  materialsTotal: 300,
  fullCost: 482,
};

const summary = {
  productId: 7,
  modelCode: 'MOD-025',
  version: 3,
  calculatedAt: '2026-11-03T10:00:00Z',
  articles: [
    {
      id: 11,
      saleSku: '602',
      active: true,
      sortOrder: 0,
      fabricId: 59,
      fabricName: 'Габардин',
      fabricPrice: 210,
      fabricQuantity: 2.5,
      isCalculated: true,
      blockers: [],
      costs,
      prices: tiers,
      published: { publishedAt: '2026-11-01T08:00:00Z', prices: tiers },
    },
    {
      id: 12,
      saleSku: '603',
      active: true,
      sortOrder: 1,
      fabricId: null,
      fabricName: null,
      fabricPrice: null,
      fabricQuantity: null,
      isCalculated: false,
      blockers: [{ code: 'MissingFabric', inputKey: null, message: 'No fabric.' }],
      costs: null,
      prices: null,
      published: null,
    },
  ],
  materials: [
    {
      id: 1,
      kind: 'Accessory',
      referenceId: 10,
      costCode: null,
      name: 'Ґудзик',
      unitPrice: 1.5,
      quantity: 4,
      unit: 'Piece',
      sortOrder: 0,
      comment: null,
    },
  ],
  operations: [
    {
      id: 3,
      operationId: 7,
      name: 'Комір',
      normMinutes: 7.3,
      quantity: 2,
      manualMinutes: null,
      sortOrder: 0,
      comment: null,
    },
  ],
};

describe('sewing article summary mapper', () => {
  it('maps live costs, prices, blockers and the published price of every Article', () => {
    const result = mapSewingArticleSummary(summary, 7);

    expect(result.materials[0]).toMatchObject({ name: 'Ґудзик', unitPrice: 1.5, comment: '' });
    expect(result.operations[0]).toMatchObject({ name: 'Комір', normMinutes: 7.3 });
    expect(result.articles[0]).toMatchObject({
      fabricName: 'Габардин',
      fabricPrice: 210,
      saleSku: '602',
      calculated: true,
      minutes: 54,
      fullCost: 482,
      prices: tiers,
      published: { prices: tiers },
    });
    expect(result.articles[0].costs).toContainEqual({ kind: 'seamstress', amount: 120 });
    expect(result.articles[1]).toMatchObject({
      calculated: false,
      costs: [],
      prices: null,
      blockers: [{ code: 'MissingFabric', inputKey: null }],
    });
  });

  it('rejects another product or a calculated row without prices', () => {
    expect(() => mapSewingArticleSummary(summary, 8)).toThrow();
    const broken = { ...summary, articles: [{ ...summary.articles[0], prices: null }] };
    expect(() => mapSewingArticleSummary(broken, 7)).toThrow();
  });
});
