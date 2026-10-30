import { useGetQuoteVersionQuery } from '@admin/clients/data-access';
import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import QuoteEditorPage from './quote-editor-page';
import QuotesPage from '../list/quotes-page';

vi.mock('@admin/shared/config', () => ({ appConfig: { apiBaseUrl: 'http://brevi.test' } }));
const quoteId = '11111111-1111-4111-8111-111111111111';
const versionId = '22222222-2222-4222-8222-222222222222';
const at = '2026-10-28T12:00:00Z';
let store: ReturnType<typeof createAdminApiStore> | undefined;
function PrivateHistoryProbe() {
  const query = useGetQuoteVersionQuery({ quoteId, versionId });
  return <output data-testid="cached-history">{query.currentData?.publicId ?? 'empty'}</output>;
}
describe('P3 editor transfer with real RTK Query state (SC-Q05)', () => {
  afterEach(() => {
    cleanup();
    store?.dispatch(adminApi.util.resetApiState());
    vi.unstubAllGlobals();
  });
  it('confirms transfer, purges loaded history and navigates to the scoped list', async () => {
    let transferred = false;
    let posted: unknown;
    const version = {
      publicId: versionId,
      versionNumber: 1,
      action: 'created',
      recipientName: 'Synthetic',
      currency: 'UAH',
      taxBasis: 'no_extra_vat',
      actorId: 17,
      createdAt: at,
      items: [],
    };
    const detail = {
      publicId: quoteId,
      recipientName: 'Synthetic',
      revision: 1,
      state: 'draft',
      archived: false,
      number: null,
      ownerId: 17,
      createdAt: at,
      updatedAt: at,
      canEdit: true,
      version,
    };
    const page = (value: unknown[]) => ({
      value,
      pagedInfo: {
        pageNumber: 1,
        pageSize: 25,
        totalPages: value.length ? 1 : 0,
        totalRecords: value.length,
      },
    });
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = new Request(input, init);
      const path = new URL(request.url).pathname;
      if (path.endsWith('/transfer')) {
        posted = await request.json();
        transferred = true;
        return Response.json({ ...detail, ownerId: 18, canEdit: false, revision: 2 });
      }
      if (path === '/api/crm/quote-assignees')
        return Response.json(page([{ userId: 18, displayName: 'Другий менеджер' }]));
      if (path === '/api/crm/quotes') return Response.json(page([]));
      if (
        path === '/api/crm/quotes/' + quoteId ||
        path === '/api/crm/quotes/' + quoteId + '/versions/' + versionId
      ) {
        if (transferred) return Response.json({ title: 'Not Found' }, { status: 404 });
        return Response.json(path.endsWith(versionId) ? version : detail);
      }
      throw new Error('Unexpected request: ' + request.method + ' ' + path);
    });
    vi.stubGlobal('fetch', fetchMock);
    store = createAdminApiStore();
    const router = createMemoryRouter(
      [
        { path: '/crm/quotes/:quoteId', element: <QuoteEditorPage /> },
        { path: '/crm/quotes', element: <QuotesPage /> },
      ],
      { initialEntries: ['/crm/quotes/' + quoteId] },
    );
    render(
      <Provider store={store}>
        <PrivateHistoryProbe />
        <RouterProvider router={router} />
      </Provider>,
    );
    await screen.findByText('КП · версія 1');
    await waitFor(() => expect(screen.getByTestId('cached-history')).toHaveTextContent(versionId));
    fireEvent.click(screen.getByRole('button', { name: 'Передати КП' }));
    const dialog = screen.getByRole('dialog', { name: 'Передати КП' });
    fireEvent.change(within(dialog).getByLabelText(/Причина/), {
      target: { value: 'Перерозподіл' },
    });
    fireEvent.mouseDown(within(dialog).getByRole('combobox', { name: 'Відповідальний' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Другий менеджер' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Передати КП' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/crm/quotes'));
    expect(router.state.location.search).toBe('?notice=transferred');
    await waitFor(() => expect(screen.getByTestId('cached-history')).toHaveTextContent('empty'));
    expect(
      await screen.findByText('КП передано. Список оновлено відповідно до вашого доступу.'),
    ).toBeInTheDocument();
    expect(posted).toMatchObject({ expectedRevision: 1, ownerId: 18, reason: 'Перерозподіл' });
  });
});
