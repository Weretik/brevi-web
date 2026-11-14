import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomersReferenceContent } from './customers-reference-content';

const fixture = vi.hoisted(() => ({
  queries: [] as Record<string, unknown>[],
  sync: vi.fn(),
  create: vi.fn(),
}));
const row = {
  publicId: '11111111-1111-4111-8111-111111111111',
  kind: 'organization',
  displayName: 'ТОВ Нове',
  legalName: null,
  taxIdentity: null,
  ownerId: 1,
  active: true,
  revision: 2,
  updatedAt: '2026-11-02T12:00:00Z',
  keepinCrmId: '10',
  contactName: 'Олена',
  phones: ['+380671234567'],
  keepinSyncedAt: '2026-11-03T07:00:00Z',
};
vi.mock('@admin/clients/data-access', () => ({
  useListCustomersQuery: (query: Record<string, unknown>) => {
    fixture.queries.push(query);
    const total = query['active'] === false ? 3 : query['active'] === true ? 1 : 4;
    return {
      currentData: {
        rows: query['pageSize'] === 1 ? [] : [row],
        page: 1,
        pageSize: query['pageSize'],
        total,
        totalPages: 1,
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    };
  },
  useSyncCustomersFromKeepinCrmMutation: () => [fixture.sync, { isLoading: false }],
  useCreateCustomerMutation: () => [fixture.create, { isLoading: false }],
}));

afterEach(() => {
  cleanup();
  fixture.queries = [];
  fixture.sync.mockReset();
});

function renderContent(url = '/references/counterparties?tab=clients') {
  const router = createMemoryRouter(
    [
      { path: '/references/counterparties', element: <CustomersReferenceContent /> },
      { path: '/crm/clients/:customerId', element: <h1>Картка клієнта</h1> },
    ],
    { initialEntries: [url] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('«Контрагенти → Клієнти»', () => {
  it('adds a client in the side panel and stays on the list', async () => {
    const user = userEvent.setup();
    fixture.create.mockReturnValue({
      unwrap: () => Promise.resolve({ ...row, displayName: 'ТОВ Старт' }),
    });
    const router = renderContent();

    await user.click(screen.getByRole('button', { name: 'Додати клієнта' }));
    const panel = screen.getByRole('dialog', { name: 'Новий клієнт' });
    expect(panel).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(fixture.create).not.toHaveBeenCalled();

    await user.type(screen.getAllByRole('textbox')[0]!, 'ТОВ Старт');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Клієнта «ТОВ Старт» створено.')).toBeVisible();
    expect(screen.queryByRole('dialog', { name: 'Новий клієнт' })).not.toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/references/counterparties');
  });

  it('shows KeepinCRM clients with activity counts and opens the card on a row', async () => {
    const user = userEvent.setup();
    const router = renderContent();

    expect(screen.getByRole('heading', { name: 'Клієнти' })).toBeVisible();
    expect(await screen.findByText('ТОВ Нове')).toBeVisible();
    expect(screen.getByText('KeepinCRM 10')).toBeVisible();
    expect(screen.getByText(/Останнє оновлення:/)).toHaveTextContent(
      new Date(row.keepinSyncedAt).toLocaleString('uk-UA', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    );
    expect(screen.getByText('Олена')).toBeVisible();
    expect(screen.getByRole('button', { name: /Активні/ })).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: /Не використовуються/ })).toHaveTextContent('3');
    expect(fixture.queries).toContainEqual({ search: '', active: true, page: 1, pageSize: 25 });

    await user.click(screen.getByText('ТОВ Нове'));
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/crm/clients/${row.publicId}`),
    );
  });

  it('sends the search to the server and reports the KeepinCRM refresh', async () => {
    const user = userEvent.setup();
    fixture.sync.mockReturnValue({
      unwrap: async () => ({
        applied: true,
        received: 4,
        created: 1,
        updated: 2,
        unchanged: 1,
        deactivated: [],
        deleted: [],
        hiddenInUse: [],
      }),
    });
    renderContent();

    await user.type(screen.getByRole('textbox', { name: 'Пошук клієнтів' }), 'Нове');
    await waitFor(() =>
      expect(fixture.queries).toContainEqual({
        search: 'Нове',
        active: true,
        page: 1,
        pageSize: 25,
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Оновити з KeepinCRM' }));
    expect(
      await screen.findByText('Оновлено з KeepinCRM: отримано 4, нових 1, оновлено 2, без змін 1.'),
    ).toBeVisible();
  });
});
