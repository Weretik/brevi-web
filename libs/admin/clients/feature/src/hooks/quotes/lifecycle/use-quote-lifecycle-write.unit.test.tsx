import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuoteLifecycleWrite } from './use-quote-lifecycle-write';

import type { QuoteDetail, QuoteLifecycleIntent } from '@admin/clients/model';

const api = vi.hoisted(() => ({
  copy: vi.fn(),
  transfer: vi.fn(),
  archive: vi.fn(),
  reprice: vi.fn(),
}));
vi.mock('@admin/clients/data-access', () => ({
  useCopyQuoteMutation: () => [api.copy],
  useTransferQuoteMutation: () => [api.transfer],
  useArchiveQuoteMutation: () => [api.archive],
  useRepriceQuoteMutation: () => [api.reprice],
}));
const detail: QuoteDetail = {
  publicId: 'quote',
  versionId: 'version',
  sourceQuoteId: null,
  sourceVersionId: null,
  revision: 2,
  versionNumber: 1,
  state: 'draft',
  archived: true,
  number: null,
  ownerId: 17,
  versionActorId: 17,
  updatedAt: '2026-10-28T12:00:00Z',
  canEdit: true,
  draft: { customerId: null, contactId: null, recipientName: 'Synthetic', items: [] },
};
const intent: QuoteLifecycleIntent = {
  action: 'archive',
  quoteId: 'quote',
  revision: 1,
  archived: true,
  reason: 'Original',
};
const failure = (status: number) => ({
  code: status === 409 ? 'Conflict' : status === 404 ? 'NotFound' : 'Network',
  status,
  message: 'Failure',
  fieldErrors: {},
});

describe('quote lifecycle writes (SC-Q04/05)', () => {
  beforeEach(() => {
    Object.values(api).forEach((mock) => mock.mockReset());
  });
  afterEach(cleanup);
  it('freezes and replays the captured original request after an unknown outcome', async () => {
    api.archive
      .mockReturnValueOnce({ unwrap: () => Promise.reject(failure(0)) })
      .mockReturnValueOnce({ unwrap: () => Promise.resolve(detail) });
    const onLock = vi.fn();
    const { result } = renderHook(() => useQuoteLifecycleWrite(onLock));
    await act(async () => {
      await result.current.run(intent);
    });
    expect(result.current.uncertain).toBe(true);
    await act(async () => {
      await result.current.run({ ...intent, reason: 'Changed', archived: false });
    });
    expect(api.archive).toHaveBeenCalledTimes(2);
    expect(api.archive.mock.calls[1][0]).toEqual(api.archive.mock.calls[0][0]);
    expect(api.archive.mock.calls[0][0].requestId).toMatch(/^[a-f0-9-]{36}$/);
    expect(result.current.uncertain).toBe(false);
    expect(onLock).toHaveBeenCalledWith(true, false);
  });
  it('rejects concurrent submits synchronously', async () => {
    let resolve!: (value: QuoteDetail) => void;
    api.archive.mockReturnValue({
      unwrap: () =>
        new Promise<QuoteDetail>((done) => {
          resolve = done;
        }),
    });
    const { result } = renderHook(() => useQuoteLifecycleWrite(vi.fn()));
    let first!: ReturnType<typeof result.current.run>;
    act(() => {
      first = result.current.run(intent);
      void result.current.run(intent);
    });
    expect(api.archive).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolve(detail);
      await first;
    });
    expect(result.current.pending).toBe(false);
  });
  it('retains the form on 409 and allows an explicitly reloaded revision', async () => {
    api.archive
      .mockReturnValueOnce({ unwrap: () => Promise.reject(failure(409)) })
      .mockReturnValueOnce({ unwrap: () => Promise.resolve(detail) });
    const { result } = renderHook(() => useQuoteLifecycleWrite(vi.fn()));
    await act(async () => {
      await result.current.run(intent);
    });
    expect(result.current.error).toContain('КП або джерело');
    expect(result.current.uncertain).toBe(false);
    await act(async () => {
      await result.current.run({ ...intent, revision: 2 });
    });
    expect(api.archive.mock.calls[1][0].revision).toBe(2);
    expect(api.archive.mock.calls[1][0].requestId).not.toBe(api.archive.mock.calls[0][0].requestId);
  });
  it('reports lost access truthfully after a transfer replay returns 404', async () => {
    api.transfer.mockReturnValue({ unwrap: () => Promise.reject(failure(404)) });
    const { result } = renderHook(() => useQuoteLifecycleWrite(vi.fn()));
    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.run({
        action: 'transfer',
        quoteId: 'quote',
        revision: 1,
        ownerId: 18,
        reason: 'Transfer',
      });
    });
    expect(outcome).toBe('accessLost');
    expect(result.current.uncertain).toBe(false);
  });
});
