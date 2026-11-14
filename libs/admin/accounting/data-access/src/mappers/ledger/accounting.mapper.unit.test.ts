import { describe, expect, it } from 'vitest';

import { mapFinanceAccounts, mapFinanceCategory } from './accounting.mapper';

const account = {
  id: '0190a1aa-0000-7000-8000-000000000001',
  name: 'ПриватБанк ФОП',
  type: 'Bank',
  currency: 'UAH',
  iban: 'UA213052990000026007000000001',
  openingMinor: -1500,
  openingDate: '2024-01-01',
  cutoverBalanceMinor: null,
  cutoverConfirmed: false,
  cutoverConfirmedAt: null,
  cutoverConfirmedBy: null,
  note: '',
  active: true,
  sortOrder: 10,
  version: 1,
  createdAt: '2026-11-05T08:00:00+00:00',
  updatedAt: '2026-11-05T08:00:00+00:00',
};

describe('accounting mapper', () => {
  it('reads accounts with negative kopecks', () => {
    expect(mapFinanceAccounts([account])[0]).toMatchObject({ openingMinor: -1500, type: 'Bank' });
  });

  it('rejects an unknown account type or a wrong date', () => {
    expect(() => mapFinanceAccounts([{ ...account, type: 'Crypto' }])).toThrow('тип рахунку');
    expect(() => mapFinanceAccounts([{ ...account, openingDate: '01.01.2024' }])).toThrow();
  });

  it('reads a subcategory', () => {
    expect(
      mapFinanceCategory({
        id: 'c2',
        name: 'Тканини',
        direction: 'Expense',
        scope: 'Current',
        parentId: 'c1',
        note: '',
        active: true,
        sortOrder: 10,
        version: 1,
      }).parentId,
    ).toBe('c1');
  });
});
