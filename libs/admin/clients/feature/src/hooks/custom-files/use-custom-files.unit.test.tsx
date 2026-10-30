import { emptyCustomConfiguration } from '@admin/clients/model';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCustomFiles } from './use-custom-files';

import type { CustomDetail, CustomPrivateFile } from '@admin/clients/model';

const api = vi.hoisted(() => ({
  upload: vi.fn(),
  save: vi.fn(),
  query: vi.fn(),
  refetch: vi.fn(),
}));
vi.mock('@admin/clients/data-access', () => ({
  useGetCustomFilesQuery: (...args: unknown[]) => api.query(...args),
  useUploadCustomFileMutation: () => [api.upload],
  useSetCustomFilesMutation: () => [api.save],
}));
const file: CustomPrivateFile = {
  id: 'file-a',
  draftId: 'root',
  contentType: 'image/png',
  length: 10,
  sha256: 'A'.repeat(64),
  state: 'Uploaded',
  expiresAt: '2026-10-29T10:00:00Z',
  showInQuote: false,
  production: true,
  isFinalized: true,
};
const detail: CustomDetail = {
  id: 'root',
  revision: 7,
  ownerId: 17,
  customerId: null,
  quoteId: null,
  configuration: emptyCustomConfiguration(),
  currentVersion: null,
  preview: null,
  updatedAt: '2026-10-28T10:00:00Z',
  canEdit: true,
};
const failure = (status: number) => ({
  status,
  code: 'Unknown',
  message: 'Unavailable',
  fieldErrors: {},
});
const resolve = (value: unknown) => ({ unwrap: () => Promise.resolve(value) });
const reject = (status: number) => ({ unwrap: () => Promise.reject(failure(status)) });
beforeEach(() => {
  Object.values(api).forEach((mock) => mock.mockReset());
  api.query.mockReturnValue({ currentData: [file], refetch: api.refetch });
  api.refetch.mockResolvedValue({ data: [file] });
});
afterEach(cleanup);
describe('private file selection lifecycle', () => {
  it('does not replace another active editor with a late file write after unmount', async () => {
    const accepted = vi.fn();
    const { result, unmount } = renderHook(() =>
      useCustomFiles({ detail, disabled: false, onAccepted: accepted }),
    );
    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    act(() => result.current.change('file-a', { showInQuote: true, production: true }));
    let resolve!: (value: CustomDetail) => void;
    api.save.mockReturnValue({
      unwrap: () =>
        new Promise<CustomDetail>((done) => {
          resolve = done;
        }),
    });
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.save();
    });
    unmount();
    resolve({ ...detail, revision: 8 });
    await pending;
    expect(accepted).not.toHaveBeenCalled();
  });
  it('requires explicit discard after a revision conflict and ignores stale metadata during edits', async () => {
    const { result, rerender } = renderHook(() =>
      useCustomFiles({ detail, disabled: false, onAccepted: vi.fn() }),
    );
    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    act(() => result.current.change('file-a', { showInQuote: true, production: true }));
    api.query.mockReturnValue({
      currentData: [{ ...file, production: false }],
      refetch: api.refetch,
    });
    rerender();
    expect(result.current.rows[0].production).toBe(true);
    api.save.mockReturnValue(reject(409));
    await act(async () => result.current.save());
    expect(result.current.dirty).toBe(true);
    expect(result.current.error).toContain('оновіть конфігурацію');
    act(() => result.current.discard());
    expect(result.current.rows[0].production).toBe(false);
    expect(result.current.dirty).toBe(false);
  });
  it('stages actual bytes then explicitly finalizes independent flags with the server revision', async () => {
    const accepted = vi.fn();
    const { result } = renderHook(() =>
      useCustomFiles({ detail, disabled: false, onAccepted: accepted }),
    );
    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    const bytes = new File(['png'], 'new.png', { type: 'image/png' });
    api.upload.mockReturnValue(
      resolve({ ...file, id: 'file-b', production: false, isFinalized: false }),
    );
    await act(async () => result.current.stage(bytes));
    expect(api.upload.mock.calls[0][0].file).toBe(bytes);
    expect(api.save).not.toHaveBeenCalled();
    act(() => result.current.change('file-b', { showInQuote: true, production: false }));
    api.save.mockReturnValue(resolve({ ...detail, revision: 8 }));
    await act(async () => result.current.save());
    expect(api.save.mock.calls[0][0]).toMatchObject({
      id: 'root',
      revision: 7,
      files: [
        { fileId: 'file-a', showInQuote: false, production: true },
        { fileId: 'file-b', showInQuote: true, production: false },
      ],
    });
    expect(accepted).toHaveBeenCalledWith(expect.objectContaining({ revision: 8 }));
  });
  it('replays an uncertain upload with the same requestId and exact bytes', async () => {
    const { result } = renderHook(() =>
      useCustomFiles({ detail, disabled: false, onAccepted: vi.fn() }),
    );
    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    api.upload
      .mockReturnValueOnce(reject(0))
      .mockReturnValueOnce(resolve({ ...file, id: 'file-b', isFinalized: false }));
    const bytes = new File(['png'], 'new.png', { type: 'image/png' });
    await act(async () => result.current.stage(bytes));
    expect(result.current.uncertain).toBe(true);
    act(() => result.current.remove('file-a'));
    await act(async () => result.current.save());
    expect(api.save).not.toHaveBeenCalled();
    expect(result.current.rows).toHaveLength(1);
    await act(async () => result.current.retry());
    expect(api.upload.mock.calls[1][0]).toEqual(api.upload.mock.calls[0][0]);
    expect(api.upload.mock.calls[1][0].file).toBe(bytes);
    expect(result.current.uncertain).toBe(false);
    expect(result.current.rows).toHaveLength(2);
  });
  it('freezes unknown finalize intent until the same revision/requestId/flags are replayed', async () => {
    const { result } = renderHook(() =>
      useCustomFiles({ detail, disabled: false, onAccepted: vi.fn() }),
    );
    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    act(() => result.current.change('file-a', { showInQuote: true, production: false }));
    api.save
      .mockReturnValueOnce(reject(503))
      .mockReturnValueOnce(resolve({ ...detail, revision: 8 }));
    await act(async () => result.current.save());
    act(() => result.current.change('file-a', { showInQuote: false, production: true }));
    await act(async () => result.current.retry());
    expect(api.save.mock.calls[1][0]).toEqual(api.save.mock.calls[0][0]);
    expect(api.save.mock.calls[1][0].files[0]).toEqual({
      fileId: 'file-a',
      showInQuote: true,
      production: false,
    });
  });
  it('read-only version preserves historical flags and cannot upload or finalize', async () => {
    const { result } = renderHook(() =>
      useCustomFiles({
        detail,
        versionId: 'v1',
        quoteId: 'q1',
        disabled: false,
        onAccepted: vi.fn(),
      }),
    );
    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    expect(api.query.mock.calls[0][0]).toEqual({ id: 'root', versionId: 'v1', quoteId: 'q1' });
    act(() => result.current.remove('file-a'));
    await act(async () => {
      await result.current.stage(new File(['x'], 'a.png', { type: 'image/png' }));
      await result.current.save();
    });
    expect(result.current.rows[0].production).toBe(true);
    expect(api.upload).not.toHaveBeenCalled();
    expect(api.save).not.toHaveBeenCalled();
  });
  it.each([403, 404])(
    'denied metadata query hides cached files and clears protected editor state (%s)',
    async (status) => {
      api.query.mockReturnValue({
        currentData: [file],
        error: failure(status),
        refetch: api.refetch,
      });
      const denied = vi.fn();
      const { result } = renderHook(() =>
        useCustomFiles({ detail, disabled: false, onAccepted: vi.fn(), onAccessLost: denied }),
      );
      expect(result.current.rows).toEqual([]);
      expect(result.current.forbidden).toBe(true);
      expect(denied).toHaveBeenCalled();
    },
  );
  it('keeps local flags on a known validation failure and allows correction', async () => {
    const { result } = renderHook(() =>
      useCustomFiles({ detail, disabled: false, onAccepted: vi.fn() }),
    );
    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    act(() => result.current.change('file-a', { showInQuote: true, production: true }));
    api.save.mockReturnValue(reject(400));
    await act(async () => result.current.save());
    expect(result.current.uncertain).toBe(false);
    expect(result.current.rows[0].showInQuote).toBe(true);
    act(() => result.current.change('file-a', { showInQuote: false, production: true }));
    expect(result.current.rows[0].showInQuote).toBe(false);
  });
});
