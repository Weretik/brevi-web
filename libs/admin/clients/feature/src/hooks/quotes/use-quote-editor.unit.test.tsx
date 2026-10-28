import { act, cleanup, render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuoteEditor } from './use-quote-editor';

import type { QuoteDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({ create: vi.fn(), save: vi.fn(), preview: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({
  useCreateQuoteMutation: () => [api.create],
  useSaveQuoteVersionMutation: () => [api.save],
  usePreviewQuotePricesMutation: () => [api.preview],
}));
const initial: QuoteDetail = {
  publicId: 'quote',
  revision: 1,
  versionNumber: 1,
  state: 'draft',
  archived: false,
  number: null,
  ownerId: 17,
  versionActorId: 17,
  updatedAt: '2026-10-27T12:00:00Z',
  canEdit: true,
  draft: {
    customerId: null,
    contactId: null,
    recipientName: 'Synthetic',
    items: [
      {
        key: 'item',
        publicId: 'item',
        title: 'Позиція',
        included: true,
        publicDescription: '',
        publicComment: '',
        internalNote: '',
        variants: [
          {
            key: 'variant',
            publicId: 'variant',
            title: 'Варіант',
            visible: true,
            selection: { kind: 'ppe', productId: 42 },
            tierVisibility: { retail: true, wholesale: true, largeWholesale: true },
            basis: {
              origin: 'saved',
              value: {
                token: 'old',
                expiresAt: 0,
                selection: { kind: 'ppe', productId: 42 },
                retail: 120,
                wholesale: 100,
                largeWholesale: 80,
                blockers: [],
                currency: 'UAH',
                taxBasis: 'catalog_no_extra_vat',
              },
            },
          },
        ],
      },
    ],
  },
};
let current: ReturnType<typeof useQuoteEditor>;
function setup(detail: QuoteDetail | null = initial) {
  function Probe() {
    current = useQuoteEditor(detail, undefined, vi.fn());
    return null;
  }
  const router = createMemoryRouter([{ path: '*', element: <Probe /> }], {
    initialEntries: ['/crm/quotes/quote'],
  });
  render(<RouterProvider router={router} />);
}
describe('quote editor writes (SC-Q01/02/04)', () => {
  it('allows correction after a definite HTTP 400 even without field-specific errors', async () => {
    setup();
    act(() => current.setDraft({ ...initial.draft, items: [] }));
    api.save.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Unknown', status: 400, message: 'Bad request', fieldErrors: {} }),
    });
    await act(async () => current.save());
    expect(current.uncertain).toBe(false);
    act(() => current.setDraft({ ...initial.draft, items: [], recipientName: 'Виправлено' }));
    await act(async () => current.save());
    expect(api.save.mock.calls[1][0].requestId).not.toBe(api.save.mock.calls[0][0].requestId);
  });
  beforeEach(() => {
    api.create.mockReset();
    api.save.mockReset();
    api.preview.mockReset();
  });
  afterEach(cleanup);
  it('saves text as a new version without requesting prices', async () => {
    setup();
    act(() =>
      current.setDraft({
        ...initial.draft,
        items: [{ ...initial.draft.items[0], publicDescription: 'Змінено' }],
      }),
    );
    api.save.mockImplementation((args) => ({
      unwrap: () =>
        Promise.resolve({ ...initial, revision: 2, versionNumber: 2, draft: args.draft }),
    }));
    await act(async () => current.save());
    expect(api.preview).not.toHaveBeenCalled();
    expect(current.detail?.versionNumber).toBe(2);
    expect(current.dirty).toBe(false);
    expect(api.save.mock.calls[0][0]).toMatchObject({ quoteId: 'quote', revision: 1 });
  });
  it('retains input and request identity after a conflict or unknown result', async () => {
    setup();
    const draft = {
      ...initial.draft,
      items: [{ ...initial.draft.items[0], internalNote: 'Залишити введення' }],
    };
    act(() => current.setDraft(draft));
    api.save.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Conflict', status: 409, message: 'Conflict', fieldErrors: {} }),
    });
    await act(async () => current.save());
    await act(async () => current.save());
    expect(current.draft).toEqual(draft);
    expect(current.error).toContain('Введення збережене');
    expect(api.save.mock.calls[1][0].requestId).toBe(api.save.mock.calls[0][0].requestId);
    act(() => current.setDraft({ ...draft, items: [] }));
    await act(async () => current.save());
    expect(api.save.mock.calls[2][0].requestId).not.toBe(api.save.mock.calls[0][0].requestId);
  });
  it('prevents a double submit before the first result returns', async () => {
    setup();
    act(() => current.setDraft({ ...initial.draft, items: [] }));
    let complete!: (value: QuoteDetail) => void;
    api.save.mockReturnValue({
      unwrap: () =>
        new Promise<QuoteDetail>((resolve) => {
          complete = resolve;
        }),
    });
    let pending!: Promise<void>;
    act(() => {
      pending = current.save();
      void current.save();
    });
    expect(api.save).toHaveBeenCalledTimes(1);
    await act(async () => {
      complete({ ...initial, revision: 2, versionNumber: 2 });
      await pending;
    });
  });
  it('replays the original payload after a timeout instead of creating a changed write', async () => {
    setup();
    const sent = { ...initial.draft, items: [] };
    act(() => current.setDraft(sent));
    api.save.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Timeout', status: 0, message: 'Timeout', fieldErrors: {} }),
    });
    await act(async () => current.save());
    act(() => current.setDraft({ ...sent, recipientName: 'Інше введення' }));
    await act(async () => current.save());
    expect(api.save.mock.calls[1][0]).toEqual(api.save.mock.calls[0][0]);
  });
});
