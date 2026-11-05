import { describe, expect, it } from 'vitest';

import {
  countFinanceCategories,
  financeCategoryParents,
  financeCategoryRows,
} from './finance-category-tree';

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

const rows = [
  category({ id: 'rent', name: 'Оренда', sortOrder: 20 }),
  category({ id: 'materials' }),
  category({ id: 'fabric', name: 'Тканини', parentId: 'materials' }),
  category({ id: 'thread', name: 'Нитки', parentId: 'materials', sortOrder: 5 }),
  category({ id: 'sales', name: 'Продажі', direction: 'Income' }),
  category({ id: 'old', name: 'Старі', scope: 'LegacyArchive' }),
];

describe('finance category tree', () => {
  it('puts subcategories right under their root in order', () => {
    expect(financeCategoryRows(rows, 'Current', 'Expense', '').map((row) => row.id)).toEqual([
      'materials',
      'thread',
      'fabric',
      'rent',
    ]);
  });

  it('keeps the root of a matching subcategory', () => {
    const found = financeCategoryRows(rows, 'Current', 'Expense', 'ткан');
    expect(found.map((row) => [row.id, row.parentName])).toEqual([
      ['materials', null],
      ['fabric', 'Матеріали'],
    ]);
  });

  it('counts per direction inside one area and offers roots as parents', () => {
    expect(countFinanceCategories(rows, 'Current')).toEqual({ Expense: 4, Income: 1 });
    expect(financeCategoryParents(rows, 'Current', 'Expense').map((row) => row.id)).toEqual([
      'materials',
      'rent',
    ]);
  });
});
