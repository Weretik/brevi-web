import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePayrollPeriod } from './use-payroll-period';

const skips = vi.hoisted(() => ({ month: [] as boolean[], year: [] as boolean[] }));

vi.mock('@admin/production/data-access', () => ({
  useGetPayrollMonthQuery: (_month: string, options: { skip: boolean }) => {
    skips.month.push(options.skip);
    return { data: undefined };
  },
  useGetPayrollYearQuery: (_year: number, options: { skip: boolean }) => {
    skips.year.push(options.skip);
    return { data: undefined };
  },
}));

describe('usePayrollPeriod', () => {
  it('loads the month for the month tabs and steps by month up to the current one', () => {
    const { result } = renderHook(() => usePayrollPeriod('payments', '2026-11'));

    expect(skips.month.at(-1)).toBe(false);
    expect(skips.year.at(-1)).toBe(true);
    expect(result.current.canNext).toBe(false);
    act(() => result.current.move(-1));
    expect(result.current.month).toBe('2026-10');
    expect(result.current.canNext).toBe(true);
  });

  it('loads the year for «Рік» and steps by a year', () => {
    const { result } = renderHook(() => usePayrollPeriod('year', '2026-11'));

    expect(skips.year.at(-1)).toBe(false);
    expect(result.current.label).toBe('2026');
    act(() => result.current.move(-1));
    expect(result.current.month).toBe('2025-11');
  });

  it('loads nothing for the other tabs', () => {
    const { result } = renderHook(() => usePayrollPeriod('staff', '2026-11'));

    expect(result.current.active).toBeNull();
  });
});
