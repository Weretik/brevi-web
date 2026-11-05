import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomerQuotes } from './customer-quotes';

const fixture = vi.hoisted(() => ({ queries: [] as Record<string, unknown>[] }));

vi.mock('@admin/quotes/data-access', () => ({
  useListQuotesQuery: (query: Record<string, unknown>) => {
    fixture.queries.push(query);
    return {
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
      data: {
        items: [
          {
            id: 12,
            number: '3-11-2026',
            kind: 'Request',
            status: 'Sent',
            internalName: 'Школа №5',
            companyName: null,
            responsible: { userId: 17, name: 'Олена' },
            itemsCount: 2,
            updatedAt: '2026-11-04T10:00:00Z',
            lastSentAt: '2026-11-04T10:00:00Z',
            archivedAt: '2026-11-05T10:00:00Z',
          },
        ],
        page: 1,
        pageSize: 25,
        total: 1,
      },
    };
  },
}));

afterEach(() => {
  cleanup();
  fixture.queries = [];
});

describe('CustomerQuotes', () => {
  it("lists the client's КП with archived ones marked and opens the editor", async () => {
    const router = createMemoryRouter(
      [{ path: '/crm/clients/:id', element: <CustomerQuotes customerId={40} /> }],
      { initialEntries: ['/crm/clients/40'] },
    );
    render(<RouterProvider router={router} />);

    expect(fixture.queries[0]).toEqual(expect.objectContaining({ customerId: 40, page: 1 }));
    expect(await screen.findByText('Школа №5')).toBeVisible();
    expect(screen.getByText('В архіві')).toBeVisible();

    await userEvent.click(screen.getByText('Школа №5'));
    expect(router.state.location.pathname).toBe('/crm/quotes/12');
  });
});
