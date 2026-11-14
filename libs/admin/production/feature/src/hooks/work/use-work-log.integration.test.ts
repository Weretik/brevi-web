import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useWorkLog } from './use-work-log';

const fixture = vi.hoisted(() => ({ queries: [] as unknown[] }));

vi.mock('@admin/production/data-access', () => ({
  useGetWorkLogQuery: (query: unknown) => {
    fixture.queries.push(query);
    return {
      data: {
        month: '2026-11',
        rows: [{ orderId: 3, orderNumber: 30, clientName: 'Школа' }],
        totals: { sewn: 0, cut: 0, records: 1 },
      },
    };
  },
  useGetWorkChoicesQuery: () => ({
    data: {
      employees: [],
      items: [{ orderId: 1, orderNumber: 10, clientName: 'Нива' }],
      overPlanReasons: [],
    },
  }),
}));

describe('useWorkLog', () => {
  it('starts on the current month and asks again for a chosen employee', () => {
    const { result } = renderHook(() => useWorkLog('2026-11-14'));

    expect(fixture.queries.at(-1)).toEqual({ month: '2026-11', employeeId: null, orderId: null });
    act(() => result.current.setEmployeeId(4));
    expect(fixture.queries.at(-1)).toEqual({ month: '2026-11', employeeId: 4, orderId: null });
  });

  it('cannot move past the current month', () => {
    const { result } = renderHook(() => useWorkLog('2026-11-14'));

    expect(result.current.canGoForward).toBe(false);
    act(() => result.current.shiftMonth(-1));
    expect(result.current.month).toBe('2026-10');
    expect(result.current.canGoForward).toBe(true);
  });

  it('lets a work be voided only in an open order and lists both log and open orders', () => {
    const { result } = renderHook(() => useWorkLog('2026-11-14'));

    expect(result.current.isOpenOrder(1)).toBe(true);
    expect(result.current.isOpenOrder(3)).toBe(false);
    expect(result.current.orders.map((x) => x.id)).toEqual([1, 3]);
  });
});
