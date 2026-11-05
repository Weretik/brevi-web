import { describe, expect, it } from 'vitest';

import { parseProductionReportPriceImportFile } from './production-report-price-import-file';

describe('КП prices transfer file', () => {
  it('sends only the order id, positions and prices', () => {
    const result = parseProductionReportPriceImportFile(
      JSON.stringify([
        {
          legacyId: 'old-1',
          number: 1,
          quoteNumber: '27-10-2026',
          items: [{ position: 1, unitPrice: 1282.54, tier: 'Wholesale' }],
        },
      ]),
    );
    expect(result.error).toBeNull();
    expect(result.rows).toEqual([
      { legacyId: 'old-1', items: [{ position: 1, unitPrice: 1282.54 }] },
    ]);
  });

  it('names the row without a price', () => {
    expect(
      parseProductionReportPriceImportFile(
        JSON.stringify([{ legacyId: 'old-1', items: [{ position: 1, unitPrice: 0 }] }]),
      ).error,
    ).toBe('Рядок 1: кожна позиція має position і ціну більшу за нуль.');
    expect(parseProductionReportPriceImportFile('[]').error).toBe('У файлі немає завдань.');
  });
});
