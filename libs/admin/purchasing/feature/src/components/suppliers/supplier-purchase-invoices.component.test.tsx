import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SupplierPurchaseInvoices } from './supplier-purchase-invoices';

const fixture = vi.hoisted(() => ({
  queries: [] as Record<string, unknown>[],
  total: 1,
}));

const invoice = {
  messageId: 'm1',
  sourceUid: '391813915',
  messageAt: '2026-11-04T21:39:54.000Z',
  markedPaid: false,
  supplierId: 7,
  supplierName: 'ФОП Бистров',
  issues: [],
  links: [
    {
      id: 'f1',
      url: 'https://www.dropbox.com/s/a.pdf',
      safe: true,
      recognition: null,
      document: {
        documentNumber: '1102',
        documentDate: '2026-11-02',
        totalPayable: '1250.00',
        vat: 'WithoutVat',
      },
    },
  ],
};

vi.mock('@admin/purchasing/data-access', () => ({
  useGetPurchaseInvoicesQuery: (query: Record<string, unknown>) => {
    fixture.queries.push(query);
    return {
      isLoading: false,
      isError: false,
      data: {
        items: fixture.total ? [invoice] : [],
        total: fixture.total,
        page: 1,
        pageSize: 25,
      },
      refetch: vi.fn(),
    };
  },
}));

afterEach(() => {
  cleanup();
  fixture.queries = [];
  fixture.total = 1;
});

function renderTab() {
  const router = createMemoryRouter(
    [
      { path: '/references/counterparties', element: <SupplierPurchaseInvoices supplierId={7} /> },
    ],
    { initialEntries: ['/references/counterparties'] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('SupplierPurchaseInvoices', () => {
  it('lists the supplier invoices and opens one in the register', async () => {
    const router = renderTab();

    expect(fixture.queries[0]).toEqual(
      expect.objectContaining({ supplierId: 7, filter: 'All', page: 1 }),
    );
    expect(screen.getByText('№ 1102 · 02.11.2026')).toBeVisible();
    expect(screen.getByText('1 250,00 грн')).toBeVisible();
    expect(screen.getByText('Без ПДВ')).toBeVisible();

    await userEvent.click(
      screen.getByRole('row', { name: /Відкрити рахунок UID 391813915 у реєстрі/ }),
    );
    expect(router.state.location.search).toBe('?tab=purchases&search=391813915');
  });

  it('explains how invoices get linked when there are none', () => {
    fixture.total = 0;
    renderTab();
    expect(screen.getByText(/Рахунків цього постачальника ще немає/)).toBeVisible();
  });
});
