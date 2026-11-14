import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useMovementFilters } from './use-movement-filters';

import type { ReactNode } from 'react';

const render = (url = '/warehouse/movements') =>
  renderHook(() => useMovementFilters(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    ),
  });

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useMovementFilters', () => {
  it('takes the kind and the search from the address', () => {
    const { result } = render('/warehouse/movements?kind=Opening&search=%20габардин%20');

    expect(result.current.query.kind).toBe('Opening');
    expect(result.current.query.search).toBe('габардин');
    expect(result.current.filtered).toBe(true);
  });

  it('applies a typed search after a pause, from the first page', () => {
    const { result } = render();

    act(() => result.current.setPage(3));
    act(() => result.current.setSearch('синій '));
    expect(result.current.query.search).toBe('');
    act(() => vi.advanceTimersByTime(400));

    expect(result.current.query).toMatchObject({ search: 'синій', page: 1 });
  });

  it('a chosen period sets the dates; a custom period waits for them', () => {
    const { result } = render();

    act(() => result.current.choosePeriod('custom'));
    expect(result.current.query.from).toBeNull();
    act(() => result.current.choosePeriod('month'));

    expect(result.current.period).toBe('month');
    expect(result.current.query.from).not.toBeNull();
  });
});
