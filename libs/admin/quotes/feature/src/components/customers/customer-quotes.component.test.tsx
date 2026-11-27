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
            version: 2,
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
  it("lists the client's КП of the period, 20 per page, and opens the editor", async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/crm/clients/:id',
          element: <CustomerQuotes customerPublicId="c-40" from="2026-11-01" to="2026-11-27" />,
        },
      ],
      { initialEntries: ['/crm/clients/c-40'] },
    );
    render(<RouterProvider router={router} />);

    expect(fixture.queries[0]).toEqual(
      expect.objectContaining({
        customerPublicId: 'c-40',
        from: '2026-11-01',
        to: '2026-11-27',
        page: 1,
        pageSize: 20,
      }),
    );
    expect(await screen.findByText('Школа №5')).toBeVisible();

    await userEvent.click(screen.getByText('Школа №5'));
    expect(router.state.location.pathname).toBe('/crm/quotes/12');
  });
});
