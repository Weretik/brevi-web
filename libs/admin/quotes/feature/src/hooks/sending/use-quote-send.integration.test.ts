import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useQuoteSend } from './use-quote-send';

import type { Quote } from '@admin/quotes/model';

const send = vi.hoisted(() => vi.fn());
// One object for every render, as the query cache gives it; a new one each time would loop the effects.
const draft = vi.hoisted(() => ({
  data: { to: 'client@agro.ua', letters: [{ subject: 'КП № 1', body: 'Добрий день' }] },
  isLoading: false,
  isError: false,
}));

vi.mock('@admin/quotes/data-access', () => ({
  useGetQuoteSendDraftQuery: () => draft,
  useSendQuoteMutation: () => [send, { isLoading: false }],
}));

const quote = { id: 4, version: 4 } as Quote;
const sentIds = () => send.mock.calls.map(([call]) => (call as { requestId: string }).requestId);

describe('useQuoteSend', () => {
  it('repeats a failed send with the same request id, so the client gets one letter', async () => {
    send
      .mockReturnValueOnce({ unwrap: () => Promise.reject(new Error('Мережа')) })
      .mockReturnValue({ unwrap: () => Promise.resolve(quote) });
    const onSent = vi.fn();
    const { result } = renderHook(() => useQuoteSend(quote, onSent));

    await act(() => result.current.send());
    await act(() => result.current.send());
    await act(() => result.current.send());

    const [failed, retried, next] = sentIds();
    expect(failed).toMatch(/^[0-9a-f-]{36}$/);
    expect(retried).toBe(failed);
    expect(next).not.toBe(retried);
    expect(onSent).toHaveBeenCalledTimes(2);
  });
});
