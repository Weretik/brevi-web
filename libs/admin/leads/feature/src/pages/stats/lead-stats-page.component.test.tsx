import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import LeadStatsPage from './lead-stats-page';

import type { LeadStats } from '@admin/leads/model';

const stats: LeadStats = {
  from: '2026-11-03',
  to: '2026-11-09',
  total: 70,
  free: 38,
  inWork: 30,
  offer: 2,
  clients: 0,
  closed: 0,
  overdue: 2,
  callsInPeriod: 46,
  addedInPeriod: 12,
  managers: [
    {
      manager: { userId: 5, name: 'Анастасія' },
      inWork: 18,
      calls: 27,
      reachedPercent: 41,
      offers: 5,
      clients: 0,
      overdue: 0,
    },
  ],
  results: [{ name: 'Не дозвонились', count: 14 }],
  industries: [{ industry: 'Склади', categories: [{ name: 'A', count: 9 }], total: 9 }],
  categories: ['A'],
  sync: {
    lastRunAt: null,
    lastSuccessAt: '2026-11-09T07:00:00Z',
    rows: 70,
    error: 'Немає доступу до таблиці',
    warning: null,
  },
};

const statsQuery = vi.hoisted(() => vi.fn());
const idle = vi.hoisted(() => () => [vi.fn(), { isLoading: false }]);

vi.mock('@admin/leads/data-access', () => ({
  useGetLeadStatsQuery: statsQuery,
  useSyncLeadsMutation: idle,
  useGetLeadStatsCallResultsQuery: () => ({ data: [], isLoading: false, isError: false }),
  useGetLeadCategoriesQuery: () => ({ data: [], isLoading: false, isError: false }),
  useSaveLeadCallResultMutation: idle,
  useSaveLeadCategoryMutation: idle,
}));

afterEach(() => {
  cleanup();
  statsQuery.mockReset();
});

function renderPage(canSync: boolean, data: LeadStats = stats) {
  statsQuery.mockReturnValue({ data, isLoading: false, isError: false });
  return render(
    <MemoryRouter>
      <LeadStatsPage viewer={{ canEdit: canSync, canSync }} />
    </MemoryRouter>,
  );
}

describe('«Статистика лідів»', () => {
  it('shows managers, results and only a failed sync as a problem', () => {
    renderPage(true);
    expect(screen.getByRole('cell', { name: 'Анастасія' })).toBeVisible();
    expect(screen.getByText('41%')).toBeVisible();
    expect(screen.getByText(/Немає доступу до таблиці/)).toBeVisible();
    expect(statsQuery).toHaveBeenCalledWith(expect.objectContaining({ from: expect.any(String) }));
  });

  it('shows what a successful sync left out, such as a company written twice', () => {
    const warning =
      'Підприємство записано в таблиці кілька разів, взято перший рядок: «Сокіл» — рядки 3, 4.';
    renderPage(true, { ...stats, sync: { ...stats.sync!, error: null, warning } });
    expect(screen.getByText(warning)).toBeVisible();
  });

  it('shows «Синхронізувати зараз» only with the right to it', () => {
    renderPage(true);
    expect(screen.getByRole('button', { name: 'Синхронізувати зараз' })).toBeVisible();
    cleanup();
    renderPage(false);
    expect(screen.queryByRole('button', { name: 'Синхронізувати зараз' })).toBeNull();
  });
});
