import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFinanceAccountsPage } from './use-finance-accounts-page';

import type { FinanceAccount } from '@admin/accounting/model';

const account = (patch: Partial<FinanceAccount>) =>
  ({
    id: 'a1',
    name: 'Каса',
    iban: '',
    note: '',
    active: true,
    cutoverConfirmed: true,
    sortOrder: 10,
    version: 1,
    balance: { legacyMinor: 0, currentMinor: 0, totalMinor: 0, hasHistory: false },
    ...patch,
  }) as FinanceAccount;

const rows = [
  account({ id: 'a1', name: 'Каса' }),
  account({
    id: 'a2',
    name: 'ПриватБанк',
    balance: { legacyMinor: 0, currentMinor: 0, totalMinor: 0, hasHistory: true },
  }),
  account({ id: 'a3', name: 'Старий', active: false }),
];

vi.mock('@admin/accounting/data-access', () => ({
  useGetFinanceAccountsQuery: () => ({ data: rows, isLoading: false, isFetching: false }),
  useDeleteFinanceAccountMutation: () => [vi.fn(), { isLoading: false }],
}));
vi.mock('./use-accounting-settings', () => ({
  useAccountingSettings: () => ({ cutoverDate: '2025-10-01', today: '2026-11-14' }),
}));

describe('useFinanceAccountsPage', () => {
  it('shows active accounts, then narrows them by the search and the archive chip', () => {
    const { result } = renderHook(() => useFinanceAccountsPage());
    expect(result.current.rows.map((row) => row.id)).toEqual(['a1', 'a2']);

    act(() => result.current.setSearch('прив'));
    expect(result.current.rows.map((row) => row.id)).toEqual(['a2']);

    act(() => {
      result.current.setSearch('');
      result.current.setFilter('archived');
    });
    expect(result.current.rows.map((row) => row.id)).toEqual(['a3']);
  });

  it('asks to confirm deleting an unused account and explains why a used one goes to the archive', () => {
    const { result } = renderHook(() => useFinanceAccountsPage());

    act(() => result.current.requestDelete('a1'));
    expect(result.current.deletion.pending?.id).toBe('a1');

    act(() => {
      result.current.deletion.cancel();
      result.current.requestDelete('a2');
    });
    expect(result.current.deletion.pending).toBeNull();
    expect(result.current.message).toContain('можна лише перенести в архів');
  });

  it('opens a panel and closes it with a message after a save', () => {
    const { result } = renderHook(() => useFinanceAccountsPage());

    act(() => result.current.open('edit', rows[0]));
    expect(result.current.active).toEqual({ mode: 'edit', account: rows[0] });

    act(() => result.current.saved('Рахунок збережено.'));
    expect(result.current.active).toBeNull();
    expect(result.current.message).toBe('Рахунок збережено.');
  });
});
