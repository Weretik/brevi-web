import { describe, expect, it } from 'vitest';

import { mapFinanceAuditPage, mapFinanceReport } from './accounting-report.mapper';

const row = {
  rowType: 'Operation',
  currency: 'UAH',
  operations: 1,
  incomeMinor: 0,
  expenseMinor: 30_000,
  resultMinor: -30_000,
  account: 'Банк',
  type: 'Expense',
  category: 'Матеріали',
  subcategory: null,
  counterparty: 'Без контрагента',
  incomingTransfersMinor: null,
  outgoingTransfersMinor: null,
  date: '2026-10-15',
  amountMinor: 30_000,
  note: 'Нитки',
  source: 'Manual',
  id: 't1',
};

describe('report mappers', () => {
  it('reads a report with nullable row fields', () => {
    const report = mapFinanceReport({
      kind: 'Operations',
      from: '2026-10-01',
      to: '2026-10-31',
      totals: [
        {
          currency: 'UAH',
          operations: 1,
          incomeMinor: 0,
          expenseMinor: 30_000,
          resultMinor: -30_000,
        },
      ],
      rows: [row, { ...row, type: null, date: null, source: null, id: null }],
      totalRows: 150,
      limited: true,
    });
    expect(report.rows[0]).toMatchObject({ type: 'Expense', date: '2026-10-15', source: 'Manual' });
    expect(report.rows[1]).toMatchObject({ type: null, date: null, source: null, id: null });
    expect(report.limited).toBe(true);
  });

  it('refuses an unknown report kind', () => {
    expect(() =>
      mapFinanceReport({
        kind: 'Weird',
        from: '2026-10-01',
        to: '2026-10-31',
        totals: [],
        rows: [],
        totalRows: 0,
        limited: false,
      }),
    ).toThrow();
  });

  it('reads a page of the change log', () => {
    const page = mapFinanceAuditPage({
      items: [
        {
          id: 3,
          entity: 'Account',
          entityId: 'a1',
          action: 'Create',
          by: 'director@brevi.com.ua',
          at: '2026-11-05T08:00:00+00:00',
          title: 'Каса',
          beforeJson: null,
          afterJson: '{"name":"Каса"}',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 50,
    });
    expect(page.items[0]).toMatchObject({ title: 'Каса', action: 'Create' });
  });
});
