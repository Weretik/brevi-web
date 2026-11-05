import { describe, expect, it } from 'vitest';

import {
  defaultFinanceJournalFilter,
  financeJournalFilterProblem,
  financeTransactionParams,
  financeTransferParams,
  previousDay,
} from './finance-journal-filters';

describe('finance journal filters', () => {
  it('opens each area on its whole period', () => {
    expect(defaultFinanceJournalFilter('Current', '2026-10-01', '2026-11-05')).toMatchObject({
      from: '2026-10-01',
      to: '2026-11-05',
    });
    expect(defaultFinanceJournalFilter('LegacyArchive', '2026-10-01', '2026-11-05')).toMatchObject({
      from: '2010-01-01',
      to: '2026-09-30',
    });
    expect(previousDay('2024-03-01')).toBe('2024-02-29');
  });

  it('sends only the filled filters, amounts in kopecks, a subcategory over its root', () => {
    const filter = {
      ...defaultFinanceJournalFilter('Current', '2026-10-01', '2026-11-05'),
      type: 'Expense' as const,
      categoryId: 'root',
      subcategoryId: 'child',
      min: '1 250,40',
      search: '  нитки ',
    };
    expect(financeTransactionParams('Current', filter, 'Date', 'Desc', 2)).toEqual({
      scope: 'Current',
      sort: 'Date',
      direction: 'Desc',
      page: 2,
      from: '2026-10-01',
      to: '2026-11-05',
      type: 'Expense',
      subcategoryId: 'child',
      minMinor: 125_040,
      search: 'нитки',
    });
    expect(financeTransferParams('LegacyArchive', filter, 'Amount', 'Asc', 1)).not.toHaveProperty(
      'type',
    );
  });

  it('explains filters that cannot be applied', () => {
    const base = defaultFinanceJournalFilter('Current', '2026-10-01', '2026-11-05');
    expect(financeJournalFilterProblem({ ...base, from: '2026-11-06' })).toMatch(/раніший/);
    expect(financeJournalFilterProblem({ ...base, min: 'сто' })).toMatch(/числом/);
    expect(financeJournalFilterProblem({ ...base, min: '10', max: '5' })).toMatch(/менша/);
    expect(financeJournalFilterProblem(base)).toBeNull();
  });
});
