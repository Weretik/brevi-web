import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CustomerDetailPage from './customer-detail-page';

import type { CustomerCardAccess } from '../../clients.routes';

const fixture = vi.hoisted(() => ({
  customer: {
    publicId: '11111111-1111-4111-8111-111111111111',
    kind: 'organization',
    displayName: 'Synthetic',
    legalName: 'ТОВ «Synthetic»',
    taxIdentity: '12345678',
    ownerId: 22,
    active: true,
    revision: 1,
    updatedAt: '2026-10-26T12:00:00Z',
    keepinCrmId: null,
    contactName: 'Марина',
    phones: [],
    keepinSyncedAt: null,
    canEdit: true,
    canMerge: false,
    contacts: [],
    externalIdentities: [],
  },
  stale: false,
  revise: vi.fn(),
  refetch: vi.fn(),
  quoteQueries: [] as unknown[],
}));
vi.mock('@admin/clients/data-access', () => ({
  useGetCustomerQuery: () => ({
    data: fixture.customer,
    currentData: fixture.stale ? undefined : fixture.customer,
    isFetching: fixture.stale,
    isLoading: false,
    error: undefined,
    refetch: fixture.refetch,
  }),
  useReviseCustomerMutation: () => [fixture.revise, { isLoading: false }],
  useSaveCustomerContactMutation: () => [vi.fn(), { isLoading: false }],
  useMergeCustomersMutation: () => [vi.fn(), { isLoading: false }],
  useListCustomersQuery: () => ({ data: undefined, isLoading: false }),
}));
vi.mock('@admin/quotes/data-access', () => ({
  useListQuotesQuery: (query: unknown) => {
    fixture.quoteQueries.push(query);
    return {
      data: {
        items: [
          {
            id: 12,
            number: 'КП-1048',
            kind: 'Request',
            status: 'Sent',
            internalName: 'Фартухи для кухні',
            companyName: null,
            responsible: { userId: 1, name: 'Оля' },
            itemsCount: 2,
            updatedAt: '2026-11-20T10:00:00Z',
            lastSentAt: '2026-11-20T10:00:00Z',
            version: 1,
          },
        ],
        total: 7,
      },
      isFetching: false,
      isError: false,
    };
  },
}));
vi.mock('@admin/production/data-access', () => ({
  useGetProductionOrdersQuery: () => ({ data: { items: [], total: 3 } }),
}));
vi.mock('@admin/tasks/data-access', () => ({
  useListTasksQuery: () => ({ data: { items: [], total: 2 } }),
}));
vi.mock('@admin/embroidery/data-access', () => ({
  useGetEmbroideryCalculationsQuery: () => ({ data: { items: [], total: 1 } }),
}));
vi.mock('@admin/quotes/feature', () => ({
  CustomerQuotes: (props: { customerPublicId: string; from?: string; to?: string }) => (
    <p>КП клієнта {JSON.stringify(props)}</p>
  ),
}));
vi.mock('@admin/production/feature', () => ({ CustomerProductionOrders: () => <p>Цех</p> }));
vi.mock('@admin/tasks/feature', () => ({ CustomerTasks: () => <p>Завдання</p> }));
vi.mock('@admin/embroidery/feature', () => ({ CustomerEmbroidery: () => <p>Вишивка</p> }));
vi.mock('@admin/accounting/feature', () => ({
  CounterpartyFinance: ({ kind, id }: { kind: string; id: string }) => (
    <p>
      Фінанси {kind} {id}
    </p>
  ),
}));

const all: CustomerCardAccess = {
  quotes: true,
  productionOrders: true,
  tasks: true,
  embroidery: true,
  finance: true,
};

function Where() {
  const location = useLocation();
  return <p>{`${location.pathname} ${JSON.stringify(location.state)}`}</p>;
}

function openCard(access: CustomerCardAccess = all, query = '') {
  const router = createMemoryRouter(
    [
      { path: '/crm/clients/:customerId', element: <CustomerDetailPage access={access} /> },
      { path: '/references/counterparties', element: <p>Клієнтський список</p> },
      { path: '/crm/quotes/:id', element: <Where /> },
    ],
    { initialEntries: [`/crm/clients/${fixture.customer.publicId}${query}`] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

afterEach(() => {
  cleanup();
  fixture.quoteQueries = [];
});
beforeEach(() => {
  vi.clearAllMocks();
  fixture.stale = false;
});

describe('client card (CARD-001)', () => {
  it('shows the header, the counts of every linked list and the latest КП', () => {
    openCard();
    expect(screen.getByRole('heading', { level: 1, name: 'Synthetic' })).toBeInTheDocument();
    expect(screen.getByText(/ТОВ «Synthetic» · Код 12345678/)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Огляд' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'КП: відкрити список' })).toHaveTextContent('7');
    expect(
      screen.getByRole('button', { name: 'Завдання в цех: відкрити список' }),
    ).toHaveTextContent('3');
    expect(screen.getByText('Фартухи для кухні')).toBeInTheDocument();
    expect(screen.queryByText('До списку клієнтів')).not.toBeInTheDocument();
  });

  it('applies one period to every tab and keeps it in the address', () => {
    openCard(all, '?period=custom&from=2026-11-01&to=2026-11-27');
    expect(fixture.quoteQueries[0]).toEqual(
      expect.objectContaining({ from: '2026-11-01', to: '2026-11-27', pageSize: 5 }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'КП: відкрити список' }));
    expect(screen.getByRole('tab', { name: 'КП' })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByText(
        `КП клієнта {"customerPublicId":"${fixture.customer.publicId}","from":"2026-11-01","to":"2026-11-27"}`,
      ),
    ).toBeInTheDocument();
  });

  it('shows only the tabs the user may open, even from a link', () => {
    openCard({ ...all, finance: false, tasks: false }, '?tab=finance');
    expect(screen.queryByRole('tab', { name: 'Фінанси' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Завдання менеджерам' })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Огляд' })).toHaveAttribute('aria-selected', 'true');
  });

  it('opens «Фінанси» with its own period', () => {
    openCard(all, '?tab=finance');
    expect(screen.getByText(`Фінанси Client ${fixture.customer.publicId}`)).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Період' })).not.toBeInTheDocument();
  });

  it('starts a new КП linked to this client', () => {
    openCard();
    fireEvent.click(screen.getByRole('button', { name: 'Нова КП' }));
    expect(
      screen.getByText(/"customerPublicId":"11111111-1111-4111-8111-111111111111"/),
    ).toBeInTheDocument();
  });

  it('leads back to the client list', async () => {
    openCard();
    fireEvent.click(screen.getByRole('button', { name: /Контрагенти · Клієнти/ }));
    expect(await screen.findByText('Клієнтський список')).toBeInTheDocument();
  });

  it('edits in the side panel and keeps the input after a 409', async () => {
    fixture.revise.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Conflict', status: 409, message: 'conflict', fieldErrors: {} }),
    });
    openCard();
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));
    const panel = screen.getByRole('dialog', { name: 'Редагувати клієнта' });
    fireEvent.change(within(panel).getByRole('textbox', { name: /Назва клієнта/ }), {
      target: { value: 'Edited synthetic' },
    });
    fireEvent.click(within(panel).getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText(/Дані змінилися або запит конфліктує/)).toBeInTheDocument();
    expect(within(panel).getByRole('textbox', { name: /Назва клієнта/ })).toHaveValue(
      'Edited synthetic',
    );
  });

  it('does not expose a cached previous customer while the new route is loading', () => {
    fixture.stale = true;
    openCard();
    expect(screen.getByRole('progressbar', { name: 'Завантаження клієнта' })).toBeInTheDocument();
    expect(screen.queryByText('Synthetic')).not.toBeInTheDocument();
  });
});
