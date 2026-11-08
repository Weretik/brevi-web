import { describe, expect, it } from 'vitest';

import {
  defaultFinanceReportFilter,
  financeReportFilterProblem,
  financeReportParams,
  financeReportRoots,
} from './finance-report-filters';

import type { FinanceCategory } from '../../entities/categories/finance-category';

const category = (overrides: Partial<FinanceCategory>): FinanceCategory => ({
  id: 'c1',
  name: 'Матеріали',
  direction: 'Expense',
  scope: 'Current',
  parentId: null,
  note: '',
  active: true,
  sortOrder: 10,
  version: 1,
  ...overrides,
});

describe('report filters', () => {
  it('starts with this month of the current books, never before the cutover', () => {
    expect(defaultFinanceReportFilter('2026-11-05', '2026-10-01')).toMatchObject({
      kind: 'Summary',
      from: '2026-11-01',
      to: '2026-11-05',
      scope: 'Current',
    });
    expect(defaultFinanceReportFilter('2026-10-07', '2026-10-03').from).toBe('2026-10-03');
  });

  it('refuses an empty or reversed period', () => {
    const filter = defaultFinanceReportFilter('2026-11-05', '2026-10-01');
    expect(financeReportFilterProblem(filter)).toBeNull();
    expect(financeReportFilterProblem({ ...filter, from: '' })).toBe('Вкажіть період.');
    expect(financeReportFilterProblem({ ...filter, to: '2026-10-31' })).toBe(
      'Кінець періоду раніший за початок.',
    );
  });

  it('sends only the fields that narrow the report', () => {
    const filter = defaultFinanceReportFilter('2026-11-05', '2026-10-01');
    expect(
      financeReportParams({
        ...filter,
        scope: '',
        accountId: 'a1',
        type: 'Income',
        categoryId: 'c1',
        counterparty: {
          kind: 'Client',
          id: 'k1',
          name: 'Клієнт',
          hint: '',
          verified: true,
          defaultCategoryId: null,
        },
      }),
    ).toEqual({
      kind: 'Summary',
      from: '2026-11-01',
      to: '2026-11-05',
      accountId: 'a1',
      type: 'Income',
      counterpartyKind: 'Client',
      counterpartyId: 'k1',
    });
    expect(
      financeReportParams({
        ...filter,
        kind: 'ExpenseStructure',
        type: 'Income',
        categoryId: 'c1',
      }),
    ).toEqual({
      kind: 'ExpenseStructure',
      from: '2026-11-01',
      to: '2026-11-05',
      scope: 'Current',
      categoryId: 'c1',
    });
  });

  it('offers root categories of the area and type, switched-off ones marked', () => {
    const categories = [
      category({ id: 'c1', name: 'Оренда', sortOrder: 20 }),
      category({ id: 'c2', name: 'Матеріали', active: false }),
      category({ id: 'c3', name: 'Тканини', parentId: 'c2' }),
      category({ id: 'c4', name: 'Продажі', direction: 'Income' }),
      category({ id: 'c5', name: 'Старе', scope: 'LegacyArchive' }),
    ];
    const filter = defaultFinanceReportFilter('2026-11-05', '2026-10-01');
    expect(financeReportRoots(categories, filter)).toEqual([]);
    expect(financeReportRoots(categories, { ...filter, type: 'Expense' })).toEqual([
      { id: 'c2', name: 'Матеріали (вимкнена)' },
      { id: 'c1', name: 'Оренда' },
    ]);
    expect(
      financeReportRoots(categories, {
        ...filter,
        kind: 'ExpenseStructure',
        scope: 'LegacyArchive',
      }),
    ).toEqual([{ id: 'c5', name: 'Старе' }]);
  });
});
