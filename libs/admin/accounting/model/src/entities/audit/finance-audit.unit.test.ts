import { describe, expect, it } from 'vitest';

import { financeAuditChanges } from './finance-audit';

import type { FinanceHistoryEntry } from '../history/finance-history-entry';

const entry = (overrides: Partial<FinanceHistoryEntry>): FinanceHistoryEntry => ({
  id: 1,
  entity: 'Transaction',
  entityId: 't1',
  action: 'Update',
  by: 'director@brevi.com.ua',
  at: '2026-11-05T08:00:00+00:00',
  beforeJson: null,
  afterJson: null,
  ...overrides,
});

describe('financeAuditChanges', () => {
  it('lists only the fields that differ, formatted for reading', () => {
    expect(
      financeAuditChanges(
        entry({
          beforeJson: JSON.stringify({
            amountMinor: 20_000,
            date: '2026-10-15',
            status: 'Active',
            counterparty: { name: 'ТОВ Ромашка' },
            version: 1,
          }),
          afterJson: JSON.stringify({
            amountMinor: 30_000,
            date: '2026-10-15',
            status: 'Void',
            counterparty: null,
            version: 2,
          }),
        }),
      ),
    ).toEqual(
      [
        { field: 'Дата', before: '15.10.2026', after: '15.10.2026' },
        { field: 'Сума', before: '200,00 ₴', after: '300,00 ₴' },
        { field: 'Контрагент', before: 'ТОВ Ромашка', after: '—' },
        { field: 'Стан', before: 'Діє', after: 'Анульовано' },
      ].filter((change) => change.before !== change.after),
    );
  });

  it('shows the filled fields of a new record and survives broken snapshots', () => {
    expect(
      financeAuditChanges(
        entry({
          action: 'Create',
          afterJson: JSON.stringify({ name: 'Каса', active: true, note: '' }),
        }),
      ),
    ).toEqual([
      { field: 'Назва', before: '—', after: 'Каса' },
      { field: 'Активний', before: '—', after: 'Так' },
    ]);
    expect(financeAuditChanges(entry({ beforeJson: '{', afterJson: '[]' }))).toEqual([]);
  });
});
