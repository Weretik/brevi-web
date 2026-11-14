import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSalesDesk } from './use-sales-desk';

const calls = vi.hoisted(() => ({ skips: {} as Record<string, boolean> }));
const failed = { data: undefined, error: new Error('Помилка мережі') };
const empty = { data: undefined, error: undefined };

vi.mock('@admin/leads/data-access', () => ({
  useGetLeadMyDayQuery: (_: unknown, options: { skip: boolean }) => {
    calls.skips['day'] = options.skip;
    return empty;
  },
}));
vi.mock('@admin/tasks/data-access', () => ({
  useGetTaskOverviewQuery: (_: unknown, options: { skip: boolean }) => {
    calls.skips['overview'] = options.skip;
    return empty;
  },
  useListTasksQuery: (_: unknown, options: { skip: boolean }) => {
    calls.skips['tasks'] = options.skip;
    return empty;
  },
}));
vi.mock('@admin/quotes/data-access', () => ({
  useListQuotesQuery: (_: unknown, options: { skip: boolean }) => {
    calls.skips['quotes'] = options.skip;
    return options.skip ? empty : failed;
  },
}));
vi.mock('@admin/production/data-access', () => ({
  useGetProductionOrdersQuery: (_: unknown, options: { skip: boolean }) => {
    calls.skips['orders'] = options.skip;
    return empty;
  },
}));

const viewer = (pages: string[], userId: number | null = 5) => ({
  canSee: (page: string) => pages.includes(page),
  userId,
});

describe('useSalesDesk', () => {
  it('asks only for the blocks the person may see', () => {
    renderHook(() => useSalesDesk(viewer(['quotes', 'production-orders'], null), '2026-11-14'));

    expect(calls.skips).toEqual({
      day: true,
      overview: true,
      tasks: true,
      quotes: false,
      orders: true,
    });
  });

  it('is blocked without any of its pages', () => {
    const { result } = renderHook(() => useSalesDesk(viewer(['clients']), '2026-11-14'));

    expect(result.current.blocked).toBe(true);
  });

  it('names the block that failed to load', () => {
    const { result } = renderHook(() => useSalesDesk(viewer(['quotes']), '2026-11-14'));

    expect(result.current.blocked).toBe(false);
    expect(result.current.errors).toEqual(['Помилка мережі']);
  });
});
