import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useFinanceOverviewPeriod } from './use-finance-overview-period';

const render = () => renderHook(() => useFinanceOverviewPeriod('2026-10-01', '2026-11-14'));

describe('useFinanceOverviewPeriod', () => {
  it('starts on the current books and this month', () => {
    const { result } = render();

    expect(result.current.scope).toBe('Current');
    expect(result.current.key).toBe('month');
    expect(result.current.period.to).toBe('2026-11-14');
  });

  it('switches to the home books for all time and back to this month', () => {
    const { result } = render();

    act(() => result.current.switchScope());
    expect(result.current.scope).toBe('LegacyArchive');
    expect(result.current.key).toBe('all');
    act(() => result.current.switchScope());
    expect(result.current.key).toBe('month');
  });

  it('uses an applied custom period and its caption', () => {
    const { result } = render();

    act(() => result.current.choose('custom'));
    act(() => result.current.applyCustom({ from: '2026-10-05', to: '2026-10-20' }));

    expect(result.current.period).toEqual({ from: '2026-10-05', to: '2026-10-20' });
    expect(result.current.caption).not.toBe('');
  });
});
