import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuoteDelivery } from './use-quote-delivery';
import { quoteDetailFixture } from '../../../testing/quotes/quote-detail.fixture';

import type { QuoteDeliveryView } from '@admin/clients/model';

const api = vi.hoisted(() => ({
  historyError: undefined as unknown,
  templateError: undefined as unknown,
  historyOptions: undefined as { skip?: boolean } | undefined,
  resolve: vi.fn(),
  get: vi.fn(),
  enqueue: vi.fn(),
  refresh: vi.fn(),
  dispatch: vi.fn(),
}));
vi.mock('@admin/clients/data-access', () => ({
  useGetActiveQuoteEmailTemplateQuery: () => ({
    currentData: null,
    isError: true,
    error: api.templateError,
  }),
  useGetQuoteDeliveriesQuery: (_args: unknown, options: { skip?: boolean }) => {
    api.historyOptions = options;
    return { refetch: api.refresh, error: api.historyError };
  },
  useResolveQuoteDeliveryMutation: () => [api.resolve],
  useLazyGetQuoteDeliveryQuery: () => [api.get],
  useEnqueueQuoteDeliveryMutation: () => [api.enqueue],
}));
vi.mock('react-redux', () => ({ useDispatch: () => api.dispatch }));
const detail = quoteDetailFixture();
const row: QuoteDeliveryView = {
  id: 'delivery',
  quoteId: detail.publicId,
  versionId: detail.versionId,
  pdfId: 'pdf',
  templateId: 'template',
  recipient: 'sandbox@example.test',
  state: 'unknown',
  attempt: 1,
  error: null,
  confirmedAt: null,
  createdAt: '2026-11-01T12:00:00Z',
  updatedAt: '2026-11-01T12:00:00Z',
  canResolveManually: true,
};
const completed: QuoteDeliveryView = {
  ...row,
  state: 'succeeded',
  canResolveManually: false,
  manualResolution: {
    outcome: 'sent',
    attempt: 1,
    actorId: 18,
    evidenceNote: 'Перевірено точний лист',
    createdAt: row.createdAt,
  },
};
const failure = (status: number) => ({
  status,
  code: 'Failure',
  message: 'Перевірка не вдалася',
  fieldErrors: {},
});
const show = (onLock = vi.fn()) => renderHook(() => useQuoteDelivery(detail, null, false, onLock));
function prepare(result: ReturnType<typeof show>['result']) {
  act(() => result.current.resolution.open(row));
  act(() =>
    result.current.resolution.change({
      outcome: 'sent',
      evidenceNote: '  Перевірено точний лист  ',
    }),
  );
}
beforeEach(() => {
  vi.clearAllMocks();
  api.historyError = undefined;
  api.templateError = undefined;
  api.resolve.mockReturnValue({ unwrap: async () => completed });
  api.get.mockReturnValue({ unwrap: async () => row });
});
afterEach(cleanup);
describe('manual result orchestration', () => {
  it('requires eligible server data, decision and note without PDF/template/provider setup', async () => {
    const { result } = show();
    expect(api.resolve).not.toHaveBeenCalled();
    act(() => result.current.resolution.open({ ...row, canResolveManually: false }));
    expect(result.current.resolution.target).toBeNull();
    act(() => result.current.resolution.open(row));
    expect(result.current.resolution.canConfirm).toBe(false);
    act(() => result.current.resolution.confirm());
    expect(api.resolve).not.toHaveBeenCalled();
    act(() =>
      result.current.resolution.change({ outcome: 'sent', evidenceNote: 'Перевірено точний лист' }),
    );
    act(() => result.current.resolution.confirm());
    await waitFor(() => expect(result.current.accepted?.manualResolution?.actorId).toBe(18));
    expect(result.current.resolution.target).toBeNull();
    expect(api.enqueue).not.toHaveBeenCalled();
    expect(api.refresh).toHaveBeenCalledOnce();
  });
  it('keeps the exact captured request through a network failure and suppresses double clicks', async () => {
    api.resolve.mockReturnValueOnce({
      unwrap: async () => {
        throw failure(0);
      },
    });
    const { result } = show();
    prepare(result);
    act(() => {
      result.current.resolution.confirm();
      result.current.resolution.confirm();
    });
    await waitFor(() => expect(result.current.action.uncertain).toBe(true));
    expect(api.resolve).toHaveBeenCalledOnce();
    act(() => {
      result.current.resolution.change({ outcome: 'not_sent', evidenceNote: 'Changed' });
      result.current.resolution.close();
    });
    expect(result.current.resolution.draft.outcome).toBe('sent');
    expect(result.current.fieldsLocked).toBe(true);
    await act(() => result.current.action.execute());
    expect(api.resolve).toHaveBeenCalledTimes(2);
    expect(api.resolve.mock.calls[1]![0]).toEqual(api.resolve.mock.calls[0]![0]);
    expect(api.resolve.mock.calls[0]![0]).toMatchObject({
      expectedAttempt: 1,
      outcome: 'sent',
      evidenceNote: 'Перевірено точний лист',
    });
  });
  it('preserves evidence on409 and requires a fresh attempt before a new explicit write', async () => {
    api.resolve.mockReturnValueOnce({
      unwrap: async () => {
        throw failure(409);
      },
    });
    api.get.mockReturnValue({ unwrap: async () => ({ ...row, attempt: 2 }) });
    const { result } = show();
    prepare(result);
    act(() => result.current.resolution.confirm());
    await waitFor(() => expect(result.current.action.error).toBeTruthy());
    expect(result.current.resolution.canConfirm).toBe(false);
    expect(result.current.resolution.draft.evidenceNote).toContain('Перевірено');
    act(() => result.current.resolution.refresh());
    await waitFor(() => expect(result.current.resolution.canConfirm).toBe(true));
    expect(api.resolve).toHaveBeenCalledOnce();
    act(() => result.current.resolution.confirm());
    await waitFor(() => expect(api.resolve).toHaveBeenCalledTimes(2));
    expect(api.resolve.mock.calls[1]![0].expectedAttempt).toBe(2);
    expect(api.resolve.mock.calls[1]![0].requestId).not.toBe(
      api.resolve.mock.calls[0]![0].requestId,
    );
  });
  it('clears evidence and private state on denied mutation', async () => {
    api.resolve.mockReturnValue({
      unwrap: async () => {
        throw failure(403);
      },
    });
    const { result } = show();
    prepare(result);
    act(() => result.current.resolution.confirm());
    await waitFor(() => expect(result.current.action.forbidden).toBe(true));
    expect(result.current.resolution.target).toBeNull();
    expect(result.current.resolution.draft.evidenceNote).toBe('');
    expect(api.dispatch).toHaveBeenCalled();
  });
  it('ignores a late write after the quote/version scope is unmounted', async () => {
    let done!: (value: QuoteDeliveryView) => void;
    api.resolve.mockReturnValue({
      unwrap: () =>
        new Promise<QuoteDeliveryView>((resolve) => {
          done = resolve;
        }),
    });
    const hook = show();
    prepare(hook.result);
    act(() => hook.result.current.resolution.confirm());
    hook.unmount();
    await act(async () => {
      done(completed);
    });
    expect(api.refresh).not.toHaveBeenCalled();
  });
  it('keeps a failed history refresh separate from uncertain writes', async () => {
    api.resolve.mockReturnValue({
      unwrap: async () => {
        throw failure(409);
      },
    });
    api.get.mockReturnValueOnce({
      unwrap: async () => {
        throw failure(0);
      },
    });
    const { result } = show();
    prepare(result);
    act(() => result.current.resolution.confirm());
    await waitFor(() => expect(result.current.action.error).toBeTruthy());
    act(() => result.current.resolution.refresh());
    await waitFor(() => expect(result.current.resolution.error).toContain('Не вдалося оновити'));
    expect(result.current.action.uncertain).toBe(false);
    expect(result.current.resolution.canConfirm).toBe(false);
    act(() => result.current.resolution.refresh());
    await waitFor(() => expect(result.current.resolution.canConfirm).toBe(true));
    expect(api.resolve).toHaveBeenCalledOnce();
  });
  it('clears the dialog when refreshed attempt access is denied', async () => {
    api.resolve.mockReturnValue({
      unwrap: async () => {
        throw failure(409);
      },
    });
    api.get.mockReturnValue({
      unwrap: async () => {
        throw failure(404);
      },
    });
    const { result } = show();
    prepare(result);
    act(() => result.current.resolution.confirm());
    await waitFor(() => expect(result.current.action.error).toBeTruthy());
    act(() => result.current.resolution.refresh());
    await waitFor(() => expect(result.current.action.forbidden).toBe(true));
    expect(result.current.resolution.target).toBeNull();
    expect(result.current.resolution.draft.evidenceNote).toBe('');
  });
  it('blocks confirmation after another actor has already resolved the attempt', async () => {
    api.resolve.mockReturnValue({
      unwrap: async () => {
        throw failure(409);
      },
    });
    api.get.mockReturnValue({ unwrap: async () => completed });
    const { result } = show();
    prepare(result);
    act(() => result.current.resolution.confirm());
    await waitFor(() => expect(result.current.action.error).toBeTruthy());
    act(() => result.current.resolution.refresh());
    await waitFor(() => expect(result.current.resolution.error).toContain('Спроба вже оброблена'));
    expect(result.current.resolution.canConfirm).toBe(false);
    expect(result.current.resolution.draft.evidenceNote).toContain('Перевірено');
  });
  it('parks denied history reads, clears manual evidence and ignores a late resolution response', async () => {
    let done!: (value: QuoteDeliveryView) => void;
    api.resolve.mockReturnValue({
      unwrap: () =>
        new Promise<QuoteDeliveryView>((resolve) => {
          done = resolve;
        }),
    });
    const lock = vi.fn();
    const hook = show(lock);
    prepare(hook.result);
    act(() => hook.result.current.resolution.confirm());
    api.historyError = failure(403);
    hook.rerender();
    await waitFor(() => expect(hook.result.current.action.forbidden).toBe(true));
    expect(hook.result.current.resolution.target).toBeNull();
    expect(hook.result.current.resolution.draft.evidenceNote).toBe('');
    expect(api.historyOptions?.skip).toBe(true);
    expect(lock).toHaveBeenLastCalledWith(false, false);
    api.historyError = undefined;
    hook.rerender();
    expect(hook.result.current.action.forbidden).toBe(true);
    await act(async () => done(completed));
    expect(hook.result.current.accepted).toBeNull();
    expect(api.refresh).not.toHaveBeenCalled();
    expect(lock).toHaveBeenLastCalledWith(false, false);
  });

  it('clears a selected review and parks reads when email-template access is denied', async () => {
    const hook = show();
    prepare(hook.result);
    act(() => {
      hook.result.current.setRecipient('sandbox@example.test');
      hook.result.current.setManager('Manager');
    });
    api.templateError = failure(401);
    hook.rerender();
    await waitFor(() => expect(hook.result.current.action.forbidden).toBe(true));
    expect(hook.result.current.resolution.target).toBeNull();
    expect(hook.result.current.recipient).toBe('');
    expect(hook.result.current.manager).toBe('');
    expect(api.historyOptions?.skip).toBe(true);
    expect(api.resolve).not.toHaveBeenCalled();
  });
});
