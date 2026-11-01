import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIntroductionEditor } from './use-introduction-editor';

const mocks = vi.hoisted(() => ({
  listError: undefined as unknown,
  emailError: undefined as unknown,
  emailLoading: false,
  emailRows: [
    { id: 'email', label: 'Шаблон листа', number: 1, subject: 'КП', createdAt: '2026-11-01' },
  ],
  emailRefetch: vi.fn(),
  get: vi.fn(),
  check: vi.fn(),
  apply: vi.fn(),
  create: vi.fn(),
  revise: vi.fn(),
  archive: vi.fn(),
  navigate: vi.fn(),
  mapping: { versionId: 'mapping', summerProductId: 1, winterProductId: 10 },
}));
vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }));
vi.mock('@admin/clients/data-access', () => ({
  useGetIntroductionTemplatesQuery: () => ({
    currentData: { rows: [], totalPages: 1 },
    error: mocks.listError,
  }),
  useGetQuoteEmailTemplatesQuery: () => ({
    currentData: { rows: mocks.emailRows, page: 1, pageSize: 25, totalPages: 2, total: 26 },
    error: mocks.emailError,
    isError: !!mocks.emailError,
    isLoading: mocks.emailLoading,
    isFetching: mocks.emailLoading,
    refetch: mocks.emailRefetch,
  }),
  useGetIntroductionFeaturedMappingQuery: () => ({ currentData: mocks.mapping }),
  useLazyGetIntroductionTemplateQuery: () => [mocks.get],
  useLazyCheckIntroductionTemplateQuery: () => [mocks.check],
  useApplyIntroductionTemplateMutation: () => [mocks.apply],
  useCreateIntroductionTemplateMutation: () => [mocks.create],
  useReviseIntroductionTemplateMutation: () => [mocks.revise],
  useArchiveIntroductionTemplateMutation: () => [mocks.archive],
}));
const detail = {
  id: 'template',
  versionId: 'version',
  revision: 1,
  archived: false,
  ownerId: 7,
  versionNumber: 1,
  updatedAt: '2026-10-30',
  name: 'Літня добірка',
  format: 'summer',
  emailTemplateVersionId: 'email',
  mappingVersionId: 'mapping',
  selections: [100, 101, 102, 103].map((slotUid) => ({
    slotUid,
    productId: slotUid,
    articleId: slotUid + 10,
  })),
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.listError = undefined;
  mocks.emailError = undefined;
  mocks.emailLoading = false;
  mocks.emailRows = [
    { id: 'email', label: 'Шаблон листа', number: 1, subject: 'КП', createdAt: '2026-11-01' },
  ];
  mocks.create.mockReturnValue({ unwrap: () => Promise.resolve(detail) });
  mocks.revise.mockReturnValue({ unwrap: () => Promise.resolve(detail) });
  mocks.mapping.versionId = 'mapping';
  mocks.get.mockReturnValue({ unwrap: () => Promise.resolve(detail) });
  mocks.check.mockReturnValue({
    unwrap: () =>
      Promise.resolve({
        format: 'summer',
        slots: [],
        mappingVersionId: 'mapping',
        emailTemplateVersionId: 'email',
      }),
  });
});
afterEach(cleanup);

describe('introduction editor server approval and request replay', () => {
  const prepareNew = (
    result: { current: ReturnType<typeof useIntroductionEditor> },
    email = 'email',
  ) => {
    act(() =>
      result.current.draft.change({
        name: 'Нова літня',
        format: 'summer',
        emailTemplateVersionId: email,
      }),
    );
    act(() => {
      for (const slot of result.current.draft.slots) {
        result.current.draft.selectProduct(slot.key, 10, 'Модель');
        result.current.draft.selectArticle(slot.key, 20, 'Тканина');
      }
    });
  };

  it('rejects an arbitrary email ID that was never read from the registry', () => {
    const { result } = renderHook(() => useIntroductionEditor());
    prepareNew(result, 'forged');
    act(() => result.current.save());
    expect(mocks.create).not.toHaveBeenCalled();
    expect(result.current.readError).toMatch(/версію шаблону листа/);
  });

  it('creates a new selection with the chosen real version and retries the same captured intent', async () => {
    mocks.create.mockReturnValueOnce({
      unwrap: () =>
        Promise.reject({ status: 408, code: 'Timeout', message: 'Timeout', fieldErrors: {} }),
    });
    mocks.create.mockReturnValueOnce({ unwrap: () => Promise.resolve(detail) });
    const { result } = renderHook(() => useIntroductionEditor());
    prepareNew(result);
    await act(async () => result.current.save());
    expect(result.current.action.uncertain).toBe(true);
    const request = mocks.create.mock.calls[0][0];
    expect(request.emailTemplateVersionId).toBe('email');
    await act(() => result.current.action.execute());
    expect(mocks.create.mock.calls[1][0]).toEqual(request);
  });

  it.each(['loading', 'empty', 'error'])(
    'blocks new creation while email registry is %s',
    (state) => {
      mocks.emailLoading = state === 'loading';
      mocks.emailRows = state === 'empty' ? [] : mocks.emailRows;
      mocks.emailError =
        state === 'error'
          ? { status: 503, code: 'Unavailable', message: 'Unavailable', fieldErrors: {} }
          : undefined;
      const { result } = renderHook(() => useIntroductionEditor());
      prepareNew(result);
      act(() => result.current.save());
      expect(mocks.create).not.toHaveBeenCalled();
    },
  );

  it('retains the explicitly chosen real version when paging the email registry', async () => {
    const { result, rerender } = renderHook(() => useIntroductionEditor());
    prepareNew(result);
    act(() => result.current.emailTemplates.setPage(2));
    mocks.emailRows = [
      {
        id: 'page-two-email',
        label: 'Інший лист',
        number: 2,
        subject: 'КП',
        createdAt: '2026-11-01',
      },
    ];
    rerender();
    expect(result.current.emailTemplates.page).toBe(2);
    expect(result.current.draft.values.emailTemplateVersionId).toBe('email');
    expect(result.current.emailTemplates.options.some((row) => row.id === 'email')).toBe(true);
    await act(async () => result.current.save());
    expect(mocks.create.mock.calls[0][0].emailTemplateVersionId).toBe('email');
  });

  it('preserves an unchanged historical reference while the registry is temporarily unavailable', async () => {
    const { result, rerender } = renderHook(() => useIntroductionEditor());
    await act(() => result.current.open('template'));
    mocks.emailError = {
      status: 503,
      code: 'Unavailable',
      message: 'Unavailable',
      fieldErrors: {},
    };
    rerender();
    act(() =>
      result.current.draft.change({ ...result.current.draft.values, name: 'Змінена назва' }),
    );
    await act(async () => result.current.save());
    expect(mocks.revise.mock.calls[0][0].emailTemplateVersionId).toBe('email');
  });

  it('clears private draft and email choices when registry access is denied', async () => {
    const { result, rerender } = renderHook(() => useIntroductionEditor());
    await act(() => result.current.open('template'));
    mocks.emailError = { status: 403, code: 'Forbidden', message: 'Denied', fieldErrors: {} };
    rerender();
    expect(result.current.accessDenied).toBe(true);
    expect(result.current.draft.source).toBeNull();
    expect(result.current.draft.values.emailTemplateVersionId).toBe('');
    expect(result.current.emailTemplates.options).toEqual([]);
  });

  it('preserves historical email references when a different registry version is available', async () => {
    mocks.emailRows = [
      { id: 'new-email', label: 'Новий лист', number: 2, subject: 'КП', createdAt: '2026-11-01' },
    ];
    const { result } = renderHook(() => useIntroductionEditor());
    await act(() => result.current.open('template'));
    expect(result.current.draft.values.emailTemplateVersionId).toBe('email');
    act(() =>
      result.current.draft.change({ ...result.current.draft.values, name: 'Змінена назва' }),
    );
    await act(async () => result.current.save());
    expect(mocks.revise.mock.calls[0][0].emailTemplateVersionId).toBe('email');
  });

  it('checks only the saved unchanged version and refuses local unsaved edits', async () => {
    const { result } = renderHook(() => useIntroductionEditor());
    await act(() => result.current.open('template'));
    let approved;
    await act(async () => {
      approved = await result.current.checkSelection(result.current.selectionToken);
    });
    expect(approved).toEqual({ approved: true, blockers: [] });
    expect(mocks.check).toHaveBeenCalledWith({ id: 'template', versionId: 'version' }, false);
    act(() =>
      result.current.draft.change({ ...result.current.draft.values, name: 'Змінена назва' }),
    );
    await act(async () => {
      approved = await result.current.checkSelection(result.current.selectionToken);
    });
    expect(approved).toMatchObject({ approved: false });
    expect(mocks.check).toHaveBeenCalledTimes(1);
  });

  it('invalidates approval identity after the active featured mapping changes', async () => {
    const { result, rerender } = renderHook(() => useIntroductionEditor());
    await act(() => result.current.open('template'));
    const token = result.current.selectionToken;
    mocks.mapping.versionId = 'changed-mapping';
    rerender();
    expect(result.current.selectionToken).not.toBe(token);
    await expect(
      result.current.checkSelection(result.current.selectionToken),
    ).resolves.toMatchObject({ approved: false });
    expect(mocks.check).not.toHaveBeenCalled();
  });

  it('clears the previous local template when protected detail access is lost', async () => {
    const { result } = renderHook(() => useIntroductionEditor());
    await act(() => result.current.open('template'));
    expect(result.current.draft.source?.id).toBe('template');
    mocks.get.mockReturnValueOnce({
      unwrap: () =>
        Promise.reject({
          status: 404,
          code: 'NotFound',
          message: 'Access changed',
          fieldErrors: {},
        }),
    });
    await act(() => result.current.open('missing'));
    expect(result.current.draft.source).toBeNull();
    expect(result.current.draft.values.name).toBe('');
    expect(result.current.readError).not.toBe('');
  });

  it('does not restore private template from a late read after list access is lost', async () => {
    let resolve!: (value: typeof detail) => void;
    const response = new Promise<typeof detail>((done) => {
      resolve = done;
    });
    mocks.get.mockReturnValueOnce({ unwrap: () => response });
    const { result, rerender } = renderHook(() => useIntroductionEditor());
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.open('template');
    });
    mocks.listError = {
      status: 403,
      code: 'Forbidden',
      message: 'Access changed',
      fieldErrors: {},
    };
    rerender();
    await act(async () => {
      resolve(detail);
      await pending;
    });
    expect(result.current.accessDenied).toBe(true);
    expect(result.current.draft.source).toBeNull();
    expect(result.current.draft.values.name).toBe('');
  });

  it('retries uncertain apply with the exact captured request and opens the new quote', async () => {
    mocks.apply.mockReturnValueOnce({
      unwrap: () =>
        Promise.reject({ status: 408, code: 'Timeout', message: 'Timeout', fieldErrors: {} }),
    });
    mocks.apply.mockReturnValueOnce({
      unwrap: () => Promise.resolve({ publicId: 'created-quote' }),
    });
    const { result } = renderHook(() => useIntroductionEditor());
    await act(() => result.current.open('template'));
    act(() => result.current.setRecipientName('ТОВ Замовник'));
    await act(() => result.current.applySelection());
    expect(result.current.action.uncertain).toBe(true);
    const request = mocks.apply.mock.calls[0][0];
    await act(() => result.current.action.execute());
    expect(mocks.apply.mock.calls[1][0]).toEqual(request);
    expect(mocks.navigate).toHaveBeenCalledWith('/crm/quotes/created-quote');
  });
});
