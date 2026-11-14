import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useVersionedDeletion } from './use-versioned-deletion';

type Row = { id: string; version: number; name?: string };

const texts = { done: 'Рахунок видалено.', failed: 'Не вдалося видалити рахунок.' };

describe('useVersionedDeletion', () => {
  it('deletes the confirmed row with its version', async () => {
    const remove = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
    const onMessage = vi.fn();
    const { result } = renderHook(() => useVersionedDeletion<Row>(remove, texts, onMessage));

    act(() => result.current.request({ id: 'a1', version: 2, name: 'Каса' }));
    expect(result.current.pending?.name).toBe('Каса');
    await act(() => result.current.confirm());

    expect(remove).toHaveBeenCalledWith({ id: 'a1', version: 2 });
    expect(onMessage).toHaveBeenCalledWith('Рахунок видалено.');
    expect(result.current.pending).toBeNull();
  });

  it('adds the server reason to a failure', async () => {
    const remove = vi.fn(() => ({ unwrap: () => Promise.reject(new Error('Є операції.')) }));
    const onMessage = vi.fn();
    const { result } = renderHook(() => useVersionedDeletion<Row>(remove, texts, onMessage));

    act(() => result.current.request({ id: 'a1', version: 2 }));
    await act(() => result.current.confirm());

    expect(onMessage).toHaveBeenCalledWith('Не вдалося видалити рахунок. Є операції.');
  });

  it('cancels without deleting', () => {
    const remove = vi.fn();
    const { result } = renderHook(() => useVersionedDeletion<Row>(remove, texts, vi.fn()));

    act(() => result.current.request({ id: 'a1', version: 2 }));
    act(() => result.current.cancel());

    expect(result.current.pending).toBeNull();
    expect(remove).not.toHaveBeenCalled();
  });
});
