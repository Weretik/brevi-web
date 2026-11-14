import { describe, expect, it } from 'vitest';

import { share } from './finance-report-cell-columns';

import type { FinanceReportGridRow } from './finance-report-cell-columns';

const row = (expenseMinor: number, currency = 'UAH') =>
  ({ key: 0, currency, expenseMinor }) as FinanceReportGridRow;

describe('share', () => {
  it('gives the share of the row in the expenses of its currency with one decimal', () => {
    expect(share(row(1240), new Map([['UAH', 10000]]))).toMatch(/^12,4\s%$/);
  });

  it('is empty when the currency has no expenses', () => {
    expect(share(row(500, 'EUR'), new Map([['UAH', 10000]]))).toBe('');
  });
});
