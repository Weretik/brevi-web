import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFinanceTransferVoid } from './use-finance-transfer-void';

import type { FinanceTransfer } from '@admin/accounting/model';

const voidTransfer = vi.hoisted(() => vi.fn());

vi.mock('@admin/accounting/data-access', () => ({
  useVoidFinanceTransferMutation: () => [voidTransfer, { isLoading: false }],
}));

const transfer = (patch: Partial<FinanceTransfer> = {}) =>
  ({ id: 't1', version: 3, status: 'Active', source: 'Manual', ...patch }) as FinanceTransfer;

describe('useFinanceTransferVoid', () => {
  it('asks to confirm, then voids the transfer with its version', async () => {
    voidTransfer.mockReturnValue({ unwrap: () => Promise.resolve() });
    const onMessage = vi.fn();
    const { result } = renderHook(() => useFinanceTransferVoid(onMessage));

    act(() => result.current.request(transfer()));
    expect(result.current.pending?.id).toBe('t1');
    await act(() => result.current.confirm());

    expect(voidTransfer).toHaveBeenCalledWith({ id: 't1', version: 3 });
    expect(onMessage).toHaveBeenCalledWith('Переказ анульовано.');
    expect(result.current.pending).toBeNull();
  });

  it('explains why a voided or bank transfer cannot be voided', () => {
    const onMessage = vi.fn();
    const { result } = renderHook(() => useFinanceTransferVoid(onMessage));

    act(() => result.current.request(transfer({ status: 'Void' })));

    expect(result.current.pending).toBeNull();
    expect(onMessage).toHaveBeenCalledWith(
      'Цей переказ уже анульовано або він з банківської виписки.',
    );
  });

  it('reports a failed void', async () => {
    voidTransfer.mockReturnValue({ unwrap: () => Promise.reject(new Error('Конфлікт версій')) });
    const onMessage = vi.fn();
    const { result } = renderHook(() => useFinanceTransferVoid(onMessage));

    act(() => result.current.request(transfer()));
    await act(() => result.current.confirm());

    expect(onMessage).toHaveBeenCalledWith('Не вдалося анулювати переказ. Конфлікт версій');
  });
});
