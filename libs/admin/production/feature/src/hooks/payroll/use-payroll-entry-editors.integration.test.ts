import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePayrollAdjustmentEditor, usePayrollPaymentEditor } from './use-payroll-entry-editors';

const createPayment = vi.hoisted(() => vi.fn());
const createAdjustment = vi.hoisted(() => vi.fn());

vi.mock('@admin/production/data-access', () => ({
  useCreatePayrollPaymentMutation: () => [createPayment, { isLoading: false }],
  useCreatePayrollAdjustmentMutation: () => [createAdjustment, { isLoading: false }],
}));

const failsOnceThenSaves = (create: ReturnType<typeof vi.fn>) =>
  create
    .mockReturnValueOnce({ unwrap: () => Promise.reject(new Error('Мережа')) })
    .mockReturnValue({ unwrap: () => Promise.resolve() });

const sentIds = (create: ReturnType<typeof vi.fn>) =>
  create.mock.calls.map(([call]) => (call as { body: { requestId: string } }).body.requestId);

describe('payroll entry editors', () => {
  it('send a payment again with the same request id after a failure, a new one after success', async () => {
    failsOnceThenSaves(createPayment);
    const { result } = renderHook(() => usePayrollPaymentEditor('2026-11', vi.fn()));
    act(() => result.current.change({ ...result.current.values, employeeId: 7, amount: '100' }));

    await act(() => result.current.save());
    await act(() => result.current.save());
    await act(() => result.current.save());

    const [failed, retried, next] = sentIds(createPayment);
    expect(failed).toMatch(/^[0-9a-f-]{36}$/);
    expect(retried).toBe(failed);
    expect(next).not.toBe(retried);
  });

  it('send an adjustment again with the same request id after a failure', async () => {
    failsOnceThenSaves(createAdjustment);
    const { result } = renderHook(() => usePayrollAdjustmentEditor('2026-11', vi.fn()));
    act(() =>
      result.current.change({
        ...result.current.values,
        employeeId: 7,
        amount: '50',
        reason: 'Премія',
      }),
    );

    await act(() => result.current.save());
    await act(() => result.current.save());

    const [failed, retried] = sentIds(createAdjustment);
    expect(retried).toBe(failed);
  });
});
