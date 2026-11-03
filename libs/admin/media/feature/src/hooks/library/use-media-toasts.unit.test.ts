import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useMediaToasts } from './use-media-toasts';

afterEach(() => vi.useRealTimers());

describe('useMediaToasts', () => {
  it('picks the colour from the text and hides notices by themselves', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMediaToasts());

    act(() => {
      result.current.show('Фото збережено.');
      result.current.show('Не вдалося зберегти фото.');
      result.current.show('Папка не порожня.', 'warning');
    });
    expect(result.current.toasts.map((toast) => toast.tone)).toEqual([
      'success',
      'error',
      'warning',
    ]);

    act(() => vi.advanceTimersByTime(4000));
    expect(result.current.toasts).toHaveLength(2);
    act(() => vi.advanceTimersByTime(4000));
    expect(result.current.toasts).toHaveLength(0);
  });
});
