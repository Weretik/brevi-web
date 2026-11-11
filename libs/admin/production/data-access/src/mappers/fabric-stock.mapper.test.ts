import { describe, expect, it } from 'vitest';

import { mapFabricStockChoices, mapProductionItemFabric } from './fabric-stock.mapper';

describe('fabric stock mappers', () => {
  it('rejects an unknown issue purpose', () => {
    expect(() =>
      mapProductionItemFabric({
        orderId: 1,
        itemId: 2,
        orderVersion: 1,
        fabricCode: null,
        fabricName: null,
        quantity: 1,
        hasNorm: false,
        plan: [],
        issued: 1,
        canIssue: false,
        issues: [
          {
            id: 1,
            issuedOn: '2026-11-04',
            note: null,
            createdByName: 'Іван',
            createdAt: '2026-11-04T10:00:00Z',
            isReversed: false,
            reversedAt: null,
            reversedByName: null,
            reverseReason: null,
            lines: [
              {
                id: 1,
                purpose: 'Other',
                planColorKey: null,
                plannedMeters: null,
                stockId: 1,
                fabricCode: 'FAB-1',
                fabricName: 'Оксфорд',
                color: 'чорний',
                meters: 1,
                coveredMeters: 0,
              },
            ],
          },
        ],
      }),
    ).toThrow();
  });

  it('maps the issue form choices with the colours of «Кольори»', () => {
    const choices = mapFabricStockChoices({
      fabrics: [{ id: 23, code: 'FAB-023', name: 'Грета' }],
      suppliers: [],
      colors: ['Чорний', 'Темно-синій кол.1076'],
    });
    expect(choices.colors).toEqual(['Чорний', 'Темно-синій кол.1076']);
    expect(() => mapFabricStockChoices({ fabrics: [], suppliers: [] })).toThrow();
  });
});
