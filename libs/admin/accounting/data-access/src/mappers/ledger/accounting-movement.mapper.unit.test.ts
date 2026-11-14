import { describe, expect, it } from 'vitest';

import { mapFinanceOverview, mapFinanceTransactionPage } from './accounting-movement.mapper';

const operation = {
  id: 't1',
  date: '2026-10-15',
  type: 'Expense',
  accountId: 'a1',
  accountName: 'Банк',
  amountMinor: 30_000,
  currency: 'UAH',
  categoryId: 'c2',
  categoryRootId: 'c1',
  categoryRootName: 'Матеріали',
  subcategoryName: 'Тканини',
  counterparty: {
    kind: 'Financial',
    id: 'f1',
    name: 'ФОП Іваненко',
    active: true,
    verified: false,
    missing: false,
  },
  oneoffName: '',
  description: 'Нитки',
  comment: '',
  source: 'Manual',
  verification: 'Verified',
  scope: 'Current',
  status: 'Void',
  version: 2,
  createdBy: 'director@brevi.com.ua',
  createdAt: '2026-11-05T08:00:00+00:00',
  updatedAt: '2026-11-05T08:00:00+00:00',
};

describe('movement mapper', () => {
  it('reads a journal page with its totals', () => {
    const page = mapFinanceTransactionPage({
      items: [operation],
      total: 1,
      page: 1,
      pageSize: 50,
      totals: [{ currency: 'UAH', incomeMinor: 0, expenseMinor: 0, differenceMinor: 0 }],
    });
    expect(page.items[0]).toMatchObject({ status: 'Void', subcategoryName: 'Тканини' });
    expect(page.items[0]?.counterparty).toMatchObject({ kind: 'Financial', verified: false });
    expect(page.totals[0]?.currency).toBe('UAH');
  });

  it('rejects an unknown status and reads an overview of both areas', () => {
    expect(() =>
      mapFinanceTransactionPage({
        ...{ total: 1, page: 1, pageSize: 50, totals: [] },
        items: [{ ...operation, status: 'Deleted' }],
      }),
    ).toThrow(/стан/);
    expect(
      mapFinanceOverview({
        scope: null,
        from: '2026-10-01',
        to: '2026-11-05',
        needsReviewCount: 0,
        needsCategoryCount: 0,
        needsCounterpartyCount: 0,
        currencies: [],
      }).scope,
    ).toBeNull();
    const [uah] = mapFinanceOverview({
      scope: 'Current',
      from: '2026-11-01',
      to: '2026-11-05',
      needsReviewCount: 3,
      needsCategoryCount: 2,
      needsCounterpartyCount: 1,
      currencies: [
        {
          currency: 'UAH',
          balanceMinor: 1,
          unconfirmedCutoverCount: 0,
          incomeMinor: 0,
          expenseMinor: 500,
          differenceMinor: -500,
          accountCount: 1,
          incomeCount: 0,
          expenseCount: 2,
          topExpenses: [{ categoryId: null, name: 'Без категорії', amountMinor: 500 }],
          otherExpenseMinor: 0,
          otherExpenseCategoryCount: 0,
        },
      ],
    }).currencies;
    expect(uah?.topExpenses).toEqual([
      { categoryId: null, name: 'Без категорії', amountMinor: 500 },
    ]);
  });
});
