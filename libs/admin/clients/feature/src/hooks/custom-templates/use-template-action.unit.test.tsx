import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useTemplateAction } from './use-template-action';

describe('template write lifecycle', () => {
  it('retains the exact captured operation after HTTP 408', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce({ status: 408, code: 'Timeout', message: 'Timeout', fieldErrors: {} })
      .mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useTemplateAction());
    await act(() => result.current.execute(operation));
    expect(result.current.uncertain).toBe(true);
    await act(() => result.current.execute());
    expect(operation).toHaveBeenCalledTimes(2);
    expect(result.current.uncertain).toBe(false);
  });
});
