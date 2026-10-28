import { act, cleanup, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useQuotePreview } from './use-quote-preview';

import type { QuoteDraft, QuotePriceBasis } from '@admin/clients/model';

const api = vi.hoisted(() => ({ preview: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({
  usePreviewQuotePricesMutation: () => [api.preview],
}));
const draft: QuoteDraft = {
  customerId: null,
  contactId: null,
  recipientName: 'Synthetic',
  items: [
    {
      key: 'item',
      title: 'Позиція',
      included: true,
      publicDescription: '',
      publicComment: '',
      internalNote: '',
      variants: [
        {
          key: 'variant',
          title: 'Варіант',
          visible: true,
          selection: { kind: 'ppe', productId: 42 },
          basis: null,
          tierVisibility: { retail: true, wholesale: true, largeWholesale: true },
        },
      ],
    },
  ],
};
const basis: QuotePriceBasis = {
  token: 'token',
  expiresAt: 1000,
  selection: { kind: 'ppe', productId: 42 },
  retail: 120,
  wholesale: 100,
  largeWholesale: 80,
  currency: 'UAH',
  taxBasis: 'catalog_no_extra_vat',
  blockers: [],
};
function setup(onError = vi.fn()) {
  return renderHook(() => {
    const [current, setDraft] = useState(draft);
    return { ...useQuotePreview(undefined, setDraft, onError), draft: current, setDraft };
  });
}
describe('quote preview requests (SC-Q02/03/04)', () => {
  it('does not display a coherent server basis for a different requested selection', async () => {
    api.preview.mockReturnValue({
      unwrap: () => Promise.resolve({ ...basis, selection: { kind: 'ppe', productId: 43 } }),
    });
    const onError = vi.fn();
    const { result } = setup(onError);
    await act(async () => result.current.calculate(draft.items[0].variants[0]));
    expect(result.current.draft.items[0].variants[0].basis).toBeNull();
    expect(onError).toHaveBeenLastCalledWith(expect.stringContaining('не відповідає'));
  });
  afterEach(() => {
    cleanup();
    api.preview.mockReset();
  });
  it('ignores a stale response after its selection has changed', async () => {
    let complete!: (value: QuotePriceBasis) => void;
    api.preview.mockReturnValue({
      unwrap: () =>
        new Promise<QuotePriceBasis>((resolve) => {
          complete = resolve;
        }),
    });
    const { result } = setup();
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.calculate(draft.items[0].variants[0]);
    });
    act(() =>
      result.current.setDraft({
        ...draft,
        items: [
          {
            ...draft.items[0],
            variants: [
              { ...draft.items[0].variants[0], selection: { kind: 'ppe', productId: 43 } },
            ],
          },
        ],
      }),
    );
    await act(async () => {
      complete(basis);
      await pending;
    });
    expect(result.current.draft.items[0].variants[0].basis).toBeNull();
  });
  it('reuses a failed request ID, then makes a new ID for an explicit successful-preview refresh', async () => {
    const { result } = setup();
    api.preview
      .mockReturnValueOnce({ unwrap: () => Promise.reject(new Error('Network')) })
      .mockReturnValue({ unwrap: () => Promise.resolve(basis) });
    await act(async () => result.current.calculate(draft.items[0].variants[0]));
    await act(async () => result.current.calculate(draft.items[0].variants[0]));
    expect(api.preview.mock.calls[1][0].requestId).toBe(api.preview.mock.calls[0][0].requestId);
    await act(async () => result.current.calculate(draft.items[0].variants[0]));
    expect(api.preview.mock.calls[2][0].requestId).not.toBe(api.preview.mock.calls[1][0].requestId);
    expect(result.current.draft.items[0].variants[0].basis?.origin).toBe('preview');
  });
});
