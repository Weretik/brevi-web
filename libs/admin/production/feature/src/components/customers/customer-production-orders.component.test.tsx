import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomerProductionOrders } from './customer-production-orders';

const fixture = vi.hoisted(() => ({ queries: [] as Record<string, unknown>[] }));

vi.mock('@admin/production/data-access', () => ({
  useGetProductionOrdersQuery: (query: Record<string, unknown>) => {
    fixture.queries.push(query);
    return {
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
      data: {
        items: [
          {
            id: 5,
            number: 31,
            status: 'New',
            clientName: 'Геофізика',
            quoteId: 10,
            quoteNumber: '12-11-2026',
            managerName: 'Анастасія',
            orderDate: '2026-11-04',
            itemsCount: 1,
            totalQuantity: 40,
            nearestDueDate: '2099-01-01',
            isTransferred: false,
            updatedAt: '2026-11-04T10:00:00Z',
            stage: 'Cutting',
            shippedQuantity: 0,
            items: [{ modelName: 'Куртка', quantity: 40, stage: 'Cutting' }],
          },
        ],
        page: 1,
        pageSize: 25,
        total: 1,
        counts: { all: 1, new: 1, closed: 0, cancelled: 0 },
        managers: ['Анастасія'],
        stages: [],
        attention: { overdue: 0, dueSoon: 0 },
      },
    };
  },
}));

afterEach(() => {
  cleanup();
  fixture.queries = [];
});

describe('CustomerProductionOrders', () => {
  it("lists the client's workshop orders and opens one", async () => {
    const router = createMemoryRouter(
      [{ path: '/crm/clients/:id', element: <CustomerProductionOrders customerId={40} /> }],
      { initialEntries: ['/crm/clients/40'] },
    );
    render(<RouterProvider router={router} />);

    expect(fixture.queries[0]).toEqual(expect.objectContaining({ customerId: 40, page: 1 }));
    expect(await screen.findByText('12-11-2026')).toBeVisible();

    await userEvent.click(screen.getByText('12-11-2026'));
    expect(router.state.location.pathname).toBe('/production/orders/5');
  });
});
