import { describe, expect, it } from 'vitest';

import { mapLegacyFinanceImportReport } from './accounting-import.mapper';

const report = {
  applied: false,
  canApply: true,
  exportedAt: '2026-11-05T07:52:48.933+00:00',
  counts: [{ kind: 'Transactions', inFile: 41046, toAdd: 41046, alreadyMoved: 0, skipped: 0 }],
  parties: {
    clientsLinked: 45,
    clientsAsFinancial: 3,
    suppliersLinked: 20,
    suppliersAsFinancial: 3,
    unused: 847,
  },
  totals: [
    {
      scope: 'LegacyArchive',
      movement: 'Income',
      status: 'Active',
      currency: 'UAH',
      count: 7950,
      amountMinor: 9_243_620_381,
    },
  ],
  balances: [
    {
      accountId: 'f0000000-0000-4000-8000-000000000004',
      name: 'касса',
      currency: 'UAH',
      active: true,
      archiveMinor: 3_252_902,
      cutoverMinor: 3_250_000,
      currentMinor: 8_261_000,
      differenceMinor: -2_902,
    },
  ],
  errorCount: 0,
  errors: [],
  warnings: ['Рахунок «касса»: різниця'],
};

describe('accounting import mapper', () => {
  it('reads the report of the archive move', () => {
    expect(mapLegacyFinanceImportReport(report)).toEqual(report);
  });

  it('rejects a kind the server never sends', () => {
    expect(() =>
      mapLegacyFinanceImportReport({
        ...report,
        counts: [{ ...report.counts[0], kind: 'Photos' }],
      }),
    ).toThrow(/вид записів/);
  });
});
