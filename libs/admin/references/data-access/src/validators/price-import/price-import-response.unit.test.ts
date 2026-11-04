import { describe, expect, it } from 'vitest';

import { parsePriceImportResponse, parsePriceSourcesResponse } from './price-import-response';

describe('price import responses', () => {
  it('accepts the list with a last run and rejects a broken row', () => {
    const list = {
      canChangeDiscounts: true,
      sources: [
        {
          key: 'insight',
          title: 'Insight',
          method: 'SupplierCabinet',
          schedule: 'Щодня',
          logic: 'Дилерська ціна.',
          discountPercent: 0,
          defaultDiscountPercent: 0,
          supplierId: 2,
          supplierName: 'Інсайт',
          productCount: 26,
          manualPriceCount: 0,
          fileKind: 'InsightYml',
          fileCount: 3,
          automaticUpdateConnected: false,
          settingsUpdatedAt: null,
          settingsUpdatedBy: null,
          lastRun: {
            sourceKey: 'insight',
            trigger: 'Файл',
            actor: 'manager@brevi',
            finishedAt: '2026-11-04T09:00:00Z',
            checked: 26,
            changed: 3,
            unchanged: 23,
            skipped: 0,
            problems: [{ productCode: null, productName: null, message: 'x' }],
          },
        },
      ],
    };
    expect(parsePriceSourcesResponse(list)).toBe(list);
    expect(() => parsePriceSourcesResponse({ ...list, sources: [{ key: 'insight' }] })).toThrow();
    expect(() => parsePriceSourcesResponse([])).toThrow();
  });

  it('checks import rows', () => {
    const result = {
      applied: false,
      discountPercent: 0,
      checked: 0,
      changed: 0,
      unchanged: 0,
      skipped: 0,
      rows: [],
    };
    expect(parsePriceImportResponse(result)).toBe(result);
    expect(() =>
      parsePriceImportResponse({
        ...result,
        rows: [{ productId: 1, name: 'x', status: 'Changed', oldPrice: '1' }],
      }),
    ).toThrow();
  });
});
