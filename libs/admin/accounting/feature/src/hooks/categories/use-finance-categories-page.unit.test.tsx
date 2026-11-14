import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { useFinanceCategoriesPage } from './use-finance-categories-page';

import type { ReactNode } from 'react';

const category = (patch: Record<string, unknown>) => ({
  id: 'materials',
  name: 'Матеріали',
  direction: 'Expense',
  scope: 'Current',
  parentId: null,
  note: '',
  active: true,
  sortOrder: 10,
  version: 1,
  ...patch,
});

const categories = [
  category({}),
  category({ id: 'rent', name: 'Оренда', sortOrder: 20 }),
  category({ id: 'sales', name: 'Продажі', direction: 'Income' }),
  category({ id: 'old', name: 'Побутові витрати', scope: 'LegacyArchive' }),
];

vi.mock('@admin/accounting/data-access', () => ({
  useGetFinanceCategoriesQuery: () => ({ data: categories, isLoading: false, isFetching: false }),
  useDeleteFinanceCategoryMutation: () => [vi.fn(), { isLoading: false }],
}));
vi.mock('../accounts/use-accounting-settings', () => ({
  useAccountingSettings: () => ({ cutoverDate: '2026-10-01', today: '2026-11-14' }),
}));

const names = (rows: readonly { name?: string; category?: { name: string } }[]) =>
  rows.map((row) => row.category?.name ?? row.name);

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('useFinanceCategoriesPage', () => {
  it('lists current expense categories, then income, then narrows by the search', () => {
    const { result } = renderHook(() => useFinanceCategoriesPage(), { wrapper });
    expect(names(result.current.rows)).toEqual(['Матеріали', 'Оренда']);

    act(() => result.current.setDirection('Income'));
    expect(names(result.current.rows)).toEqual(['Продажі']);

    act(() => {
      result.current.setDirection('Expense');
      result.current.setSearch('орен');
    });
    expect(names(result.current.rows)).toEqual(['Оренда']);
  });

  it('opens a side panel and keeps a message', () => {
    const { result } = renderHook(() => useFinanceCategoriesPage(), { wrapper });

    act(() => {
      result.current.setActive({ mode: 'create', category: null, parentId: 'materials' });
      result.current.setActionMessage('Категорію збережено.');
    });

    expect(result.current.active?.parentId).toBe('materials');
    expect(result.current.actionMessage).toBe('Категорію збережено.');
  });
});
