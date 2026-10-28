import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CustomerDetailPage from './customer-detail-page';

const fixture = vi.hoisted(() => ({
  customer: {
    publicId: '11111111-1111-4111-8111-111111111111',
    kind: 'person',
    displayName: 'Synthetic',
    legalName: null,
    taxIdentity: null,
    ownerId: 22,
    active: true,
    revision: 1,
    updatedAt: '2026-10-26T12:00:00Z',
    canEdit: true,
    canMerge: false,
    contacts: [],
    externalIdentities: [],
  },
  stale: false,
  revise: vi.fn(),
  refetch: vi.fn(),
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

describe('customer detail conflicts', () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    fixture.stale = false;
    fixture.revise.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Conflict', status: 409, message: 'conflict', fieldErrors: {} }),
    });
  });
  it('retains input after 409 and requires confirmation before refreshing a dirty form', async () => {
    const router = createMemoryRouter(
      [{ path: '/crm/clients/:customerId', element: <CustomerDetailPage /> }],
      { initialEntries: [`/crm/clients/${fixture.customer.publicId}`] },
    );
    render(<RouterProvider router={router} />);
    fireEvent.change(screen.getByRole('textbox', { name: /Назва клієнта/ }), {
      target: { value: 'Edited synthetic' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти клієнта' }));
    expect(await screen.findByText(/Дані змінилися або запит конфліктує/)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Назва клієнта/ })).toHaveValue('Edited synthetic');
    fireEvent.click(screen.getByRole('button', { name: 'Оновити дані із сервера' }));
    expect(fixture.refetch).not.toHaveBeenCalled();
    expect(
      screen.getByRole('dialog', { name: 'Відхилити зміни й оновити клієнта?' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Продовжити редагування' }));
    expect(await screen.findByRole('textbox', { name: /Назва клієнта/ })).toHaveValue(
      'Edited synthetic',
    );
    expect(
      screen.queryByRole('button', { name: 'Об’єднати з перевіреним дублем' }),
    ).not.toBeInTheDocument();
  });
  it('does not expose a cached previous customer while the new route is loading', () => {
    fixture.stale = true;
    const router = createMemoryRouter(
      [{ path: '/crm/clients/:customerId', element: <CustomerDetailPage /> }],
      { initialEntries: ['/crm/clients/22222222-2222-4222-8222-222222222222'] },
    );
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('progressbar', { name: 'Завантаження клієнта' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /Назва клієнта/ })).not.toBeInTheDocument();
    expect(screen.queryByText('Synthetic')).not.toBeInTheDocument();
  });
  it('blocks leaving a dirty client until the user explicitly discards the changes', async () => {
    const router = createMemoryRouter(
      [
        { path: '/crm/clients/:customerId', element: <CustomerDetailPage /> },
        { path: '/crm/clients', element: <div>Клієнтський список</div> },
      ],
      { initialEntries: [`/crm/clients/${fixture.customer.publicId}`] },
    );
    render(<RouterProvider router={router} />);
    fireEvent.change(screen.getByRole('textbox', { name: /Назва клієнта/ }), {
      target: { value: 'Unsaved' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'До списку клієнтів' }));
    expect(screen.getByRole('dialog', { name: 'Незбережені зміни' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Продовжити редагування' }));
    expect(await screen.findByRole('textbox', { name: /Назва клієнта/ })).toHaveValue('Unsaved');
    fireEvent.click(screen.getByRole('button', { name: 'До списку клієнтів' }));
    fireEvent.click(screen.getByRole('button', { name: 'Відхилити й вийти' }));
    expect(await screen.findByText('Клієнтський список')).toBeInTheDocument();
  });
});
