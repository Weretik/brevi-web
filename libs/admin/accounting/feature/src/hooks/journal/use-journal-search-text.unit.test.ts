import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useJournalSearchText } from './use-journal-search-text';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useJournalSearchText', () => {
  it('applies typed text after a pause, once', () => {
    const apply = vi.fn();
    const { result } = renderHook(() => useJournalSearchText('', apply));

    act(() => result.current.setText('ткан'));
    act(() => result.current.setText('тканина'));
    expect(apply).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(350));
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith({ search: 'тканина' });
  });

  it('follows an applied search changed elsewhere without applying it again', () => {
    const apply = vi.fn();
    const { result, rerender } = renderHook(({ search }) => useJournalSearchText(search, apply), {
      initialProps: { search: '' },
    });

    rerender({ search: 'оренда' });
    act(() => vi.advanceTimersByTime(350));

    expect(result.current.text).toBe('оренда');
    expect(apply).not.toHaveBeenCalled();
  });
});
