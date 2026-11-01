import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailTemplateSessionProvider } from './email-template-session';
import { useEmailTemplateRegistry } from './use-email-template-registry';

const mocks = vi.hoisted(() => ({
  roles: ['Admin'] as string[],
  settings: { revision: 3, active: null } as
    { revision: number; active: object | null } | undefined,
  settingsError: undefined as unknown,
  listError: undefined as unknown,
  create: vi.fn(),
  activate: vi.fn(),
  get: vi.fn(),
  refetch: vi.fn(),
}));
vi.mock('@admin/clients/data-access', () => ({
  useGetQuoteEmailTemplatesQuery: () => ({
    currentData: { rows: [], page: 1, pageSize: 25, totalPages: 0, total: 0 },
    error: mocks.listError,
    refetch: mocks.refetch,
  }),
  useGetQuoteEmailTemplateSettingsQuery: () => ({
    currentData: mocks.settings,
    error: mocks.settingsError,
    refetch: mocks.refetch,
  }),
  useLazyGetQuoteEmailTemplateQuery: () => [mocks.get],
  useCreateQuoteEmailTemplateMutation: () => [mocks.create],
  useActivateQuoteEmailTemplateMutation: () => [mocks.activate],
}));
const detail = {
  id: 'version-1',
  label: 'Лист',
  number: 1,
  subject: 'КП {quoteNumber}',
  body: 'Вітаємо {recipientName}',
  createdAt: '2026-11-01T12:00:00Z',
};
const draft = { name: 'Лист', subject: 'КП {quoteNumber}', body: 'Вітаємо {recipientName}' };
const failure = (status: number) => ({
  status,
  code: 'Failure',
  message: 'Помилка',
  fieldErrors: {},
});
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mocks.roles = ['Admin'];
  mocks.listError = undefined;
  mocks.settingsError = undefined;
  mocks.settings = { revision: 3, active: null };
  mocks.get.mockReturnValue({ unwrap: () => Promise.resolve(detail) });
  mocks.create.mockReturnValue({ unwrap: () => Promise.resolve(detail) });
  mocks.activate.mockReturnValue({
    unwrap: () => Promise.resolve({ revision: 4, active: detail }),
  });
});

function renderRegistry() {
  return renderHook(() => useEmailTemplateRegistry(), {
    wrapper: ({ children }) => (
      <EmailTemplateSessionProvider value={{ currentData: mocks.roles, refetch: mocks.refetch }}>
        {children}
      </EmailTemplateSessionProvider>
    ),
  });
}

describe('email registry orchestration', () => {
  it('fails closed when no app role provider is mounted', () => {
    const { result } = renderHook(() => useEmailTemplateRegistry());
    expect(result.current.canManage).toBe(false);
    act(() => result.current.save());
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it('allows Manager reads but blocks create and activate', async () => {
    mocks.roles = ['Manager'];
    const { result } = renderRegistry();
    await act(() => result.current.open('version-1'));
    expect(result.current.selected).toEqual(detail);
    act(() => {
      result.current.save();
      result.current.activate();
    });
    expect(result.current.canManage).toBe(false);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.activate).not.toHaveBeenCalled();
  });
  it('creates immutable content without automatically activating it', async () => {
    const { result } = renderRegistry();
    act(() => result.current.change(draft));
    act(() => {
      result.current.save();
      result.current.save();
    });
    await waitFor(() => expect(result.current.notice).toContain('Створено версію 1'));
    expect(mocks.create).toHaveBeenCalledTimes(1);
    expect(mocks.create).toHaveBeenCalledWith({ ...draft, requestId: expect.any(String) });
    expect(mocks.activate).not.toHaveBeenCalled();
  });
  it('locks edits after an unknown create and retries the identical captured intent', async () => {
    mocks.create
      .mockReturnValueOnce({ unwrap: () => Promise.reject(failure(408)) })
      .mockReturnValueOnce({ unwrap: () => Promise.resolve(detail) });
    const { result } = renderRegistry();
    act(() => result.current.change(draft));
    act(() => result.current.save());
    await waitFor(() => expect(result.current.action.uncertain).toBe(true));
    act(() => result.current.change({ ...draft, name: 'Змінено' }));
    expect(result.current.draft).toEqual(draft);
    await act(() => result.current.action.execute());
    expect(mocks.create.mock.calls[1]?.[0]).toEqual(mocks.create.mock.calls[0]?.[0]);
    expect(result.current.action.uncertain).toBe(false);
  });
  it('keeps the draft on activation conflict and refreshes its expected revision', async () => {
    mocks.activate.mockReturnValue({ unwrap: () => Promise.reject(failure(409)) });
    const { result } = renderRegistry();
    act(() => result.current.change(draft));
    await act(() => result.current.open('version-1'));
    act(() => result.current.activate());
    await waitFor(() => expect(mocks.refetch).toHaveBeenCalled());
    expect(mocks.activate).toHaveBeenCalledWith({
      versionId: 'version-1',
      expectedRevision: 3,
      requestId: expect.any(String),
    });
    expect(result.current.draft).toEqual(draft);
    expect(result.current.action.uncertain).toBe(false);
  });
  it('blocks activation while current settings are missing or unavailable', async () => {
    mocks.settings = undefined;
    const { result, rerender } = renderRegistry();
    await act(() => result.current.open('version-1'));
    act(() => result.current.activate());
    expect(mocks.activate).not.toHaveBeenCalled();
    mocks.settings = { revision: 3, active: null };
    mocks.settingsError = failure(503);
    rerender();
    act(() => result.current.activate());
    expect(mocks.activate).not.toHaveBeenCalled();
  });
  it('ignores a stale detail response after a newer selection', async () => {
    let resolveFirst!: (value: typeof detail) => void;
    mocks.get.mockReturnValueOnce({
      unwrap: () =>
        new Promise<typeof detail>((resolve) => {
          resolveFirst = resolve;
        }),
    });
    const { result } = renderRegistry();
    let first!: Promise<void>;
    act(() => {
      first = result.current.open('first');
    });
    await act(() => result.current.open('version-1'));
    await act(async () => {
      resolveFirst({ ...detail, id: 'first' });
      await first;
    });
    expect(result.current.selected?.id).toBe('version-1');
  });
  it('clears selected content and the draft when current access is denied', async () => {
    const { result, rerender } = renderRegistry();
    act(() => result.current.change(draft));
    await act(() => result.current.open('version-1'));
    mocks.listError = failure(403);
    rerender();
    await waitFor(() => expect(result.current.selected).toBeNull());
    expect(result.current.draft).toEqual({ name: '', subject: '', body: '' });
    expect(result.current.accessDenied).toBe(true);
  });
});

it('clears private registry content when a refreshed session loses both read roles', async () => {
  const { result, rerender } = renderRegistry();
  act(() => result.current.change(draft));
  await act(() => result.current.open('version-1'));
  expect(result.current.selected).toEqual(detail);
  mocks.roles = ['User'];
  rerender();
  await waitFor(() => expect(result.current.accessDenied).toBe(true));
  expect(result.current.selected).toBeNull();
  expect(result.current.draft).toEqual({ name: '', subject: '', body: '' });
});
