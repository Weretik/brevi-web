import { emptyCustomConfiguration } from '@admin/clients/model';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCustomEditor } from './use-custom-editor';

import type { CustomDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({
  create: vi.fn(),
  save: vi.fn(),
  calculate: vi.fn(),
  version: vi.fn(),
}));
vi.mock('@admin/clients/data-access', () => ({
  useCreateCustomSewingMutation: () => [api.create],
  useSaveCustomSewingMutation: () => [api.save],
  useCalculateCustomSewingMutation: () => [api.calculate],
  useSaveCustomSewingVersionMutation: () => [api.version],
}));
const configuration = {
  ...emptyCustomConfiguration(),
  name: 'Куртка',
  productType: 'Куртка',
  fabrics: [{ referenceId: 1, quantity: 1, unit: 'Metre' }],
  operations: [{ referenceId: 2, quantity: 1, manualMinutes: null }],
};
const initial: CustomDetail = {
  id: 'root',
  revision: 1,
  ownerId: 17,
  customerId: null,
  quoteId: null,
  configuration,
  currentVersion: null,
  preview: null,
  updatedAt: '2026-10-28T10:00:00Z',
  canEdit: true,
};
beforeEach(() => Object.values(api).forEach((mock) => mock.mockReset()));
afterEach(cleanup);
describe('custom editor request and calculation state', () => {
  it.each([403, 404])(
    'clears local private input when explicit refresh loses access (%s)',
    async (status) => {
      const { result } = renderHook(() => useCustomEditor(initial));
      act(() =>
        result.current.setConfiguration({ ...configuration, internalNote: 'Private unsaved note' }),
      );
      await act(async () =>
        result.current.refresh(async () => {
          throw {
            status,
            code: status === 403 ? 'Forbidden' : 'NotFound',
            message: 'Denied',
            fieldErrors: {},
          };
        }),
      );
      expect(result.current.forbidden).toBe(true);
      expect(result.current.detail).toBeNull();
      expect(result.current.configuration.internalNote).toBe('');
      expect(result.current.configuration.name).toBe('');
    },
  );
  it('retains private unsaved input on an ordinary transient refresh failure', async () => {
    const { result } = renderHook(() => useCustomEditor(initial));
    act(() =>
      result.current.setConfiguration({ ...configuration, internalNote: 'Keep private note' }),
    );
    await act(async () =>
      result.current.refresh(async () => {
        throw { status: 503, code: 'Unknown', message: 'Unavailable', fieldErrors: {} };
      }),
    );
    expect(result.current.forbidden).toBe(false);
    expect(result.current.detail?.id).toBe(initial.id);
    expect(result.current.configuration.internalNote).toBe('Keep private note');
  });
  it('blocks Calculate/SaveVersion for dirty inputs and never calculates on draft save', async () => {
    const { result } = renderHook(() => useCustomEditor(initial));
    act(() => result.current.setConfiguration({ ...configuration, name: 'Changed' }));
    await act(async () => {
      await result.current.act('calculate');
      await result.current.act('version');
    });
    expect(api.calculate).not.toHaveBeenCalled();
    expect(api.version).not.toHaveBeenCalled();
    api.save.mockReturnValue({
      unwrap: () =>
        Promise.resolve({ ...initial, revision: 2, configuration: result.current.configuration }),
    });
    await act(async () => result.current.act('save'));
    expect(result.current.detail?.revision).toBe(2);
    expect(api.calculate).not.toHaveBeenCalled();
  });
  it('captures unknown writes and prevents edits/reloads until the exact request is replayed', async () => {
    const { result } = renderHook(() => useCustomEditor(initial));
    api.save
      .mockReturnValueOnce({
        unwrap: () =>
          Promise.reject({ status: 0, code: 'Network', message: 'Unknown', fieldErrors: {} }),
      })
      .mockReturnValueOnce({ unwrap: () => Promise.resolve({ ...initial, revision: 2 }) });
    await act(async () => result.current.act('save'));
    expect(result.current.uncertain).toBe(true);
    const loader = vi.fn(async () => initial);
    act(() => result.current.setConfiguration({ ...configuration, name: 'Forbidden edit' }));
    await act(async () => {
      await result.current.refresh(loader);
      await result.current.act('calculate');
      await result.current.act('save');
    });
    expect(loader).not.toHaveBeenCalled();
    expect(api.calculate).not.toHaveBeenCalled();
    expect(api.save.mock.calls[1][0]).toEqual(api.save.mock.calls[0][0]);
    expect(result.current.configuration.name).toBe('Куртка');
    expect(result.current.uncertain).toBe(false);
  });
  it('serializes writes and ignores edits while a late server result is pending', async () => {
    const { result } = renderHook(() => useCustomEditor(initial));
    let complete!: (detail: CustomDetail) => void;
    api.save.mockReturnValue({
      unwrap: () =>
        new Promise<CustomDetail>((resolve) => {
          complete = resolve;
        }),
    });
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.act('save');
    });
    act(() => result.current.setConfiguration({ ...configuration, name: 'Race' }));
    await act(async () => result.current.act('save'));
    expect(api.save).toHaveBeenCalledTimes(1);
    await act(async () => {
      complete({ ...initial, revision: 2 });
      await pending;
    });
    expect(result.current.configuration.name).toBe('Куртка');
  });
  it('retains editable configuration after source blockers or revision conflicts', async () => {
    const { result } = renderHook(() => useCustomEditor(initial));
    api.calculate.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          ...initial,
          preview: {
            token: 'token',
            calculatedAt: initial.updatedAt,
            expiresAt: Date.now() + 60000,
            formulaVersion: 'custom-sewing-sheet-v1',
            internalCost: null,
            retail: null,
            wholesale: null,
            largeWholesale: null,
            blockers: ['missing_fabric_price'],
            isCalculated: false,
          },
        }),
    });
    await act(async () => result.current.act('calculate'));
    expect(result.current.configuration).toEqual(configuration);
    expect(result.current.locked).toBe(false);
    api.save.mockReturnValue({
      unwrap: () =>
        Promise.reject({ status: 409, code: 'Conflict', message: 'Conflict', fieldErrors: {} }),
    });
    act(() => result.current.setConfiguration({ ...configuration, description: 'Keep input' }));
    await act(async () => result.current.act('save'));
    expect(result.current.configuration.description).toBe('Keep input');
    expect(result.current.locked).toBe(false);
  });
});
