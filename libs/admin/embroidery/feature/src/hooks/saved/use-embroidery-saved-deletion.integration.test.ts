import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useEmbroiderySavedDeletion } from './use-embroidery-saved-deletion';

const api = vi.hoisted(() => ({ remove: vi.fn(), state: { isLoading: false, isError: false } }));

vi.mock('@admin/embroidery/data-access', () => ({
  useDeleteEmbroideryCalculationMutation: () => [api.remove, api.state],
}));

describe('useEmbroiderySavedDeletion', () => {
  it('deletes after confirmation and closes the drawer', async () => {
    api.remove.mockResolvedValue({ data: undefined });
    const onDeleted = vi.fn();
    const { result } = renderHook(() => useEmbroiderySavedDeletion(12, onDeleted));

    act(() => result.current.ask());
    expect(result.current.confirming).toBe(true);
    await act(() => result.current.confirm());

    expect(api.remove).toHaveBeenCalledWith(12);
    expect(onDeleted).toHaveBeenCalled();
    expect(result.current.confirming).toBe(false);
  });

  it('stays open when the server refuses', async () => {
    api.remove.mockResolvedValue({ error: { message: 'Є в КП.' } });
    const onDeleted = vi.fn();
    const { result } = renderHook(() => useEmbroiderySavedDeletion(12, onDeleted));

    act(() => result.current.ask());
    await act(() => result.current.confirm());

    expect(onDeleted).not.toHaveBeenCalled();
    expect(result.current.confirming).toBe(false);
  });
});
