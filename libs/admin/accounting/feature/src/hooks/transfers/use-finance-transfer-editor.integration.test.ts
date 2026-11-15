import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFinanceTransferEditor } from './use-finance-transfer-editor';

const create = vi.hoisted(() => vi.fn());

vi.mock('@admin/accounting/data-access', () => ({
  useCreateFinanceTransferMutation: () => [create, { isLoading: false }],
  useUpdateFinanceTransferMutation: () => [vi.fn(), { isLoading: false }],
  useGetFinanceTransferHistoryQuery: () => ({ data: [], isLoading: false, error: undefined }),
}));

vi.mock('@admin/accounting/model', async (original) => ({
  ...(await original<typeof import('@admin/accounting/model')>()),
  validateFinanceTransfer: () => ({}),
}));

const render = () =>
  renderHook(() =>
    useFinanceTransferEditor({
      mode: 'create',
      transfer: null,
      scope: 'Current',
      cutoverDate: '2026-01-01',
      date: '2026-11-15',
      currencyOf: () => 'UAH',
      onSaved: vi.fn(),
    }),
  );

const sentIds = () => create.mock.calls.map(([body]) => (body as { requestId: string }).requestId);

describe('useFinanceTransferEditor', () => {
  it('repeats a failed save with the same request id, so the server never adds a second one', async () => {
    create
      .mockReturnValueOnce({ unwrap: () => Promise.reject(new Error('Мережа')) })
      .mockReturnValueOnce({ unwrap: () => Promise.resolve() });
    const { result } = render();

    await act(() => result.current.save());
    await act(() => result.current.save());

    const [first, second] = sentIds();
    expect(first).toMatch(/^[0-9a-f-]{36}$/);
    expect(second).toBe(first);
  });

  it('starts a new request id after a successful save', async () => {
    create.mockReset().mockReturnValue({ unwrap: () => Promise.resolve() });
    const { result } = render();

    await act(() => result.current.save());
    await act(() => result.current.save());

    const [first, second] = sentIds();
    expect(second).not.toBe(first);
  });
});
