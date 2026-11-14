import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuoteEditorPage } from './use-quote-editor-page';

import type { ReactNode } from 'react';

const save = vi.fn();
const navigate = vi.fn();
const run = vi.fn();
const openPreview = vi.fn();

vi.mock('react-router-dom', async (original) => ({
  ...(await original<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));
vi.mock('./use-quote-editor', () => ({
  useQuoteEditor: () => ({ quote: null, draft: { items: [] }, dirty: true, saving: false, save }),
}));
vi.mock('./use-quote-fabric-facts', () => ({ useQuoteFabricFacts: () => new Map() }));
vi.mock('./use-quote-save-first', () => ({ useQuoteSaveFirst: () => ({ run }) }));
vi.mock('../clients/use-client-suggestions', () => ({ useClientSuggestions: () => ({}) }));
vi.mock('../lifecycle/use-quote-delete', () => ({ useQuoteDelete: () => ({}) }));
vi.mock('../lifecycle/use-quote-lifecycle', () => ({ useQuoteLifecycle: () => ({}) }));
vi.mock('../lifecycle/use-route-notice', () => ({ useRouteNotice: () => ({}) }));
vi.mock('../preview/use-quote-preview', () => ({
  useQuotePreview: () => ({ preparing: false, open: openPreview }),
}));
vi.mock('../sending/use-gmail-return-notice', () => ({ useGmailReturnNotice: () => ({}) }));
vi.mock('../start/use-quote-start-prefill', () => ({ useQuoteStartPrefill: () => null }));

const wrapper =
  (path: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
  );

describe('useQuoteEditorPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('opens «Новий виріб» for an old «КП з нуля» link', () => {
    const { result } = renderHook(() => useQuoteEditorPage(undefined), {
      wrapper: wrapper('/crm/quotes/new?custom=1'),
    });
    expect(result.current.panel).toEqual({ kind: 'custom' });
    expect(result.current.openSupplier).toBeUndefined();
  });

  it('shows a notice after «Зберегти» and goes back to the list after «Зберегти і закрити»', async () => {
    save.mockResolvedValue({ id: 4 });
    const { result } = renderHook(() => useQuoteEditorPage(undefined), {
      wrapper: wrapper('/crm/quotes/new'),
    });
    await act(async () => result.current.actions.onSave());
    expect(result.current.sentNotice).toBe('КП збережено.');
    await act(async () => result.current.actions.onSaveAndClose());
    expect(navigate).toHaveBeenCalledWith('/crm/quotes', { state: { notice: 'КП збережено' } });
  });

  it('saves first and then opens the PDF to send, clearing the old notice', () => {
    const { result } = renderHook(() => useQuoteEditorPage(undefined), {
      wrapper: wrapper('/crm/quotes/new'),
    });
    act(() => result.current.setSentNotice('old'));
    act(() => result.current.actions.onSend());
    expect(result.current.sentNotice).toBeNull();
    run.mock.calls[0][0]({ id: 4 });
    expect(openPreview).toHaveBeenCalledWith({ id: 4 });
  });
});
