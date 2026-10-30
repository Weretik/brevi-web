import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuoteReprice } from './use-quote-reprice';

import type { QuoteDetail, QuotePriceBasis } from '@admin/clients/model';

const api = vi.hoisted(() => ({ preview: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({
  usePreviewQuotePricesMutation: () => [api.preview],
}));
const basis = (amount = 100): QuotePriceBasis => ({
  token: 'old',
  expiresAt: 1,
  selection: { kind: 'ppe', productId: 42 },
  retail: amount,
  wholesale: amount,
  largeWholesale: amount,
  blockers: [],
  currency: 'UAH',
  taxBasis: 'catalog_no_extra_vat',
  source: null,
});
const detail: QuoteDetail = {
  publicId: 'quote',
  versionId: 'version',
  sourceQuoteId: null,
  sourceVersionId: null,
  revision: 1,
  versionNumber: 1,
  state: 'draft',
  archived: false,
  number: null,
  ownerId: 17,
  versionActorId: 17,
  updatedAt: '2026-10-28T12:00:00Z',
  canEdit: true,
  draft: {
    customerId: null,
    contactId: null,
    recipientName: 'Synthetic',
    items: [
      {
        key: 'item',
        publicId: 'item',
        title: 'Item',
        publicDescription: '',
        publicComment: '',
        internalNote: '',
        included: true,
        variants: [
          {
            key: 'variant',
            publicId: 'variant',
            title: 'Variant',
            visible: true,
            selection: basis().selection,
            tierVisibility: { retail: true, wholesale: true, largeWholesale: true },
            basis: { origin: 'saved', value: basis() },
          },
        ],
      },
    ],
  },
};
const fresh = (): QuotePriceBasis => ({
  ...basis(150),
  token: 'new',
  expiresAt: Date.now() + 60000,
});
const ok = (value = fresh()) => ({ unwrap: () => Promise.resolve(value), abort: vi.fn() });

describe('explicit saved quote reprice preparation (SC-Q02)', () => {
  beforeEach(() => api.preview.mockReset());
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });
  it('does not price on read and builds a comparison only after explicit request', async () => {
    api.preview.mockReturnValue(ok());
    const { result } = renderHook(() => useQuoteReprice(detail));
    expect(api.preview).not.toHaveBeenCalled();
    expect(result.current.ready).toBe(false);
    await act(async () => {
      await result.current.run();
    });
    expect(result.current.ready).toBe(true);
    expect(result.current.rows[0]).toMatchObject({
      variantId: 'variant',
      previous: { retail: 100 },
      next: { retail: 150 },
    });
    expect(detail.draft.items[0].variants[0].basis!.value.retail).toBe(100);
    expect(api.preview.mock.calls[0][0]).toMatchObject({
      quoteId: 'quote',
      selection: { kind: 'ppe', productId: 42 },
    });
  });
  it('rejects a response for another selection', async () => {
    api.preview.mockReturnValue(ok({ ...fresh(), selection: { kind: 'ppe', productId: 99 } }));
    const { result } = renderHook(() => useQuoteReprice(detail));
    await act(async () => {
      await result.current.run();
    });
    expect(result.current.ready).toBe(false);
    expect(result.current.rows).toHaveLength(0);
    expect(result.current.error).toContain('не відповідає');
  });
  it('invalidates prepared prices when the saved quote version changes', async () => {
    api.preview.mockReturnValue(ok());
    const { result, rerender } = renderHook(({ value }) => useQuoteReprice(value), {
      initialProps: { value: detail },
    });
    await act(async () => {
      await result.current.run();
    });
    expect(result.current.ready).toBe(true);
    rerender({ value: { ...detail, versionId: 'new-version', revision: 2 } });
    expect(result.current.ready).toBe(false);
    expect(result.current.rows).toHaveLength(0);
    expect(api.preview).toHaveBeenCalledTimes(1);
  });
  it('aborts an obsolete preview and ignores its late result after a version change', async () => {
    let finish!: (value: QuotePriceBasis) => void;
    const waiting = new Promise<QuotePriceBasis>((resolve) => {
      finish = resolve;
    });
    const abort = vi.fn();
    api.preview.mockReturnValueOnce({ unwrap: () => waiting, abort }).mockReturnValue(ok());
    const { result, rerender } = renderHook(({ value }) => useQuoteReprice(value), {
      initialProps: { value: detail },
    });
    let oldRun!: Promise<void>;
    act(() => {
      oldRun = result.current.run();
    });
    rerender({ value: { ...detail, versionId: 'new-version', revision: 2 } });
    expect(abort).toHaveBeenCalledOnce();
    expect(result.current.pending).toBe(false);
    await act(async () => {
      await result.current.run();
    });
    await act(async () => {
      finish({ ...fresh(), token: 'obsolete' });
      await oldRun;
    });
    expect(result.current.ready).toBe(true);
    expect(result.current.rows[0].next.token).toBe('new');
  });
  it('keeps blocked null prices readable but prevents confirmation', async () => {
    api.preview.mockReturnValue(ok({ ...fresh(), retail: null, blockers: ['Unavailable'] }));
    const { result } = renderHook(() => useQuoteReprice(detail));
    await act(async () => {
      await result.current.run();
    });
    expect(result.current.rows[0].next.retail).toBeNull();
    expect(result.current.ready).toBe(false);
  });
  it('rejects a comparison at its exact expiry instant', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1000);
    api.preview.mockReturnValue(ok({ ...fresh(), expiresAt: 1000 }));
    const { result } = renderHook(() => useQuoteReprice(detail));
    await act(async () => {
      await result.current.run();
    });
    expect(result.current.ready).toBe(false);
  });
  it('reuses a failed preview request key and allocates a new key after success', async () => {
    api.preview
      .mockReturnValueOnce({
        unwrap: () =>
          Promise.reject({ code: 'Network', status: 0, message: 'Network', fieldErrors: {} }),
        abort: vi.fn(),
      })
      .mockReturnValue(ok());
    const { result } = renderHook(() => useQuoteReprice(detail));
    await act(async () => {
      await result.current.run();
    });
    await act(async () => {
      await result.current.run();
    });
    expect(api.preview.mock.calls[1][0].requestId).toBe(api.preview.mock.calls[0][0].requestId);
    await act(async () => {
      await result.current.run();
    });
    expect(api.preview.mock.calls[2][0].requestId).not.toBe(api.preview.mock.calls[0][0].requestId);
  });
});
