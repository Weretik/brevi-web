import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useContentProductVisibility } from './use-content-product-visibility';

import type { ContentProductRow } from '@admin/content/model';

const setVisibility = vi.hoisted(() => vi.fn());

vi.mock('@admin/content/data-access', () => ({
  useSetContentProductVisibilityMutation: () => [setVisibility],
}));

const row = { productId: 9, name: 'Куртка' } as ContentProductRow;

describe('useContentProductVisibility', () => {
  it('warns when a product shown on the site is switched off in «Товари»', async () => {
    setVisibility.mockReturnValue({
      unwrap: () => Promise.resolve({ showOnSite: true, onSite: false }),
    });
    const { result } = renderHook(() => useContentProductVisibility());

    await act(() => result.current.toggle(row, true));

    expect(setVisibility).toHaveBeenCalledWith({ productId: 9, showOnSite: true });
    expect(result.current.notice?.text).toContain('вимкнено в «Товари»');
    expect(result.current.savingId).toBeNull();
  });

  it('reports a failure', async () => {
    setVisibility.mockReturnValue({ unwrap: () => Promise.reject(new Error('Немає прав.')) });
    const { result } = renderHook(() => useContentProductVisibility());

    await act(() => result.current.toggle(row, false));

    expect(result.current.notice).toEqual({ text: 'Немає прав.', ok: false });
  });
});
