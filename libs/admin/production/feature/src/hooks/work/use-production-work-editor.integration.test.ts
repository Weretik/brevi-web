import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useProductionWorkEditor } from './use-production-work-editor';

import type { WorkChoices, WorkItemChoice } from '@admin/production/model';

const create = vi.hoisted(() => vi.fn());

vi.mock('@admin/production/data-access', () => ({
  useCreateProductionWorkMutation: () => [create, { isLoading: false }],
}));

vi.mock('@admin/production/model', async (original) => ({
  ...(await original<typeof import('@admin/production/model')>()),
  validateProductionWork: () => ({}),
}));

const item = { orderId: 3, itemId: 9, modelName: 'Костюм', quantity: 10 } as WorkItemChoice;

const sentIds = () =>
  create.mock.calls.map(([call]) => (call as { body: { requestId: string } }).body.requestId);

describe('useProductionWorkEditor', () => {
  it('repeats a failed save with the same request id and starts a new one after success', async () => {
    create
      .mockReturnValueOnce({ unwrap: () => Promise.reject(new Error('Мережа')) })
      .mockReturnValue({
        unwrap: () => Promise.resolve({ modelName: 'Костюм', sewn: 1, quantity: 10, cut: 0 }),
      });
    const { result } = renderHook(() =>
      useProductionWorkEditor({ items: [] } as unknown as WorkChoices, item, vi.fn()),
    );

    await act(() => result.current.save());
    await act(() => result.current.save());
    await act(() => result.current.save());

    const [failed, retried, next] = sentIds();
    expect(failed).toMatch(/^[0-9a-f-]{36}$/);
    expect(retried).toBe(failed);
    expect(next).not.toBe(retried);
  });
});
