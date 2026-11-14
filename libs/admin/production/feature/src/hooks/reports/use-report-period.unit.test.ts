import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useReportPeriod } from './use-report-period';

describe('useReportPeriod', () => {
  it('starts on the current month without a comparison', () => {
    const { result } = renderHook(() => useReportPeriod('2026-11'));

    expect(result.current.query).toEqual({ from: '2026-11', to: '2026-11' });
    expect(result.current.problem).toBeNull();
  });

  it('moves the comparison to the months right before a new period', () => {
    const { result } = renderHook(() => useReportPeriod('2026-11'));

    act(() => result.current.setFrom('2026-09'));
    act(() => result.current.setCompare(true));

    expect(result.current.query).toEqual({
      from: '2026-09',
      to: '2026-11',
      compareFrom: '2026-06',
      compareTo: '2026-08',
    });
  });

  it('reports a wrong period and a wrong comparison', () => {
    const { result } = renderHook(() => useReportPeriod('2026-11'));

    act(() => result.current.setTo('2026-12'));
    expect(result.current.problem).toBe('Місяць ще не почався.');
    act(() => result.current.setTo('2026-11'));
    act(() => result.current.setCompare(true));
    act(() => result.current.setCompareFrom('2026-11'));
    act(() => result.current.setCompareTo('2026-10'));
    expect(result.current.problem).toBe('Початок періоду не може бути пізніше кінця.');
  });
});
