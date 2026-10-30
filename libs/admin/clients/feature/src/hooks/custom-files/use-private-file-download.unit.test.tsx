import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePrivateFileDownload } from './use-private-file-download';

const api = vi.hoisted(() => ({ content: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({
  getCustomFileContent: (...args: unknown[]) => api.content(...args),
}));
beforeEach(() => {
  api.content.mockReset();
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = vi.fn(() => 'blob:private');
      static revokeObjectURL = vi.fn();
    },
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe('private file download', () => {
  it('fetches exact historical bytes on demand and immediately revokes the temporary URL', async () => {
    const create = vi.spyOn(URL, 'createObjectURL');
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const blob = new Blob(['%PDF'], { type: 'application/pdf' });
    api.content.mockResolvedValue(blob);
    const { result } = renderHook(() => usePrivateFileDownload(vi.fn()));
    expect(api.content).not.toHaveBeenCalled();
    await act(async () => result.current.download('file', 'v1', 'q1'));
    expect(api.content).toHaveBeenCalledWith({ fileId: 'file', versionId: 'v1', quoteId: 'q1' });
    expect(create).toHaveBeenCalledWith(blob);
    expect(revoke).toHaveBeenCalledWith('blob:private');
  });
  it('shows missing content without mistaking metadata for available bytes', async () => {
    api.content.mockRejectedValue({
      status: 404,
      code: 'NotFound',
      message: 'Missing',
      fieldErrors: {},
    });
    const { result } = renderHook(() => usePrivateFileDownload(vi.fn()));
    await act(async () => result.current.download('missing'));
    expect(result.current.error).toContain('Метадані не підтверджують');
  });
  it('clears protected state after denied content access', async () => {
    api.content.mockRejectedValue({
      status: 403,
      code: 'Forbidden',
      message: 'Denied',
      fieldErrors: {},
    });
    const denied = vi.fn();
    const { result } = renderHook(() => usePrivateFileDownload(denied));
    await act(async () => result.current.download('file'));
    expect(denied).toHaveBeenCalled();
  });
  it('does not expose late private bytes after the panel was unmounted', async () => {
    let resolve!: (value: Blob) => void;
    api.content.mockImplementation(
      () =>
        new Promise<Blob>((done) => {
          resolve = done;
        }),
    );
    const create = vi.spyOn(URL, 'createObjectURL');
    const { result, unmount } = renderHook(() => usePrivateFileDownload(vi.fn()));
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.download('file');
    });
    unmount();
    resolve(new Blob(['private'], { type: 'image/png' }));
    await pending;
    expect(create).not.toHaveBeenCalled();
  });
});
