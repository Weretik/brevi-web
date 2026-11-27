import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SupplierCardPage from './supplier-card-page';

import type { SupplierCardAccess } from '../../references.routes';

const fixture = vi.hoisted(() => ({
  receipts: [] as unknown[],
  supplier: {
    id: 7,
    name: 'Атлас',
    link: null,
    contactPerson: 'Ігор',
    phoneNumber: '+380670000000',
    email: null,
    purchaseCategories: 'Тканини',
    tags: null,
    isActive: true,
    notes: null,
    keepinCrmId: null,
    keepinSyncedAt: null,
  },
}));
vi.mock('@admin/references/data-access', () => ({
  useListSuppliersQuery: () => ({
    data: [fixture.supplier],
    isLoading: false,
    isError: false,
    isSuccess: true,
  }),
  useListFabricsQuery: () => ({
    data: [
      {
        id: 1,
        code: 'FAB-001',
        name: 'Саржа',
        providerName: 'інший',
        providerId: 7,
        price: 180,
        isActive: true,
      },
      {
        id: 2,
        code: 'FAB-002',
        name: 'Льон',
        providerName: ' атлас ',
        providerId: null,
        price: 200,
        isActive: true,
      },
      {
        id: 3,
        code: 'FAB-003',
        name: 'Чужа',
        providerName: 'Інший',
        providerId: 9,
        price: 10,
        isActive: true,
      },
    ],
    isFetching: false,
    isError: false,
  }),
  useListGarmentAccessoriesQuery: () => ({
    data: [
      {
        id: 5,
        code: 'FUR-001',
        name: 'Блискавка',
        supplierName: 'Атлас',
        price: 4,
        unit: 'шт.',
        isActive: false,
      },
    ],
    isFetching: false,
    isError: false,
  }),
}));
vi.mock('@admin/products/data-access', () => ({
  useListProductsQuery: () => ({
    data: { value: [], pagedInfo: { totalRecords: 4 } },
    isFetching: false,
    isError: false,
  }),
}));
vi.mock('@admin/purchasing/data-access', () => ({
  useGetPurchaseInvoicesQuery: () => ({ data: { items: [], total: 2 } }),
}));
vi.mock('@admin/warehouse/data-access', () => ({
  useGetFabricMovementsQuery: (query: unknown) => {
    fixture.receipts.push(query);
    return { data: { rows: [], total: 6, hasMore: false }, isFetching: false, isError: false };
  },
}));
vi.mock('@admin/warehouse/ui', () => ({
  FabricMovementsTable: () => <p>Приходи</p>,
  FabricMovementPager: () => null,
}));
vi.mock('@admin/purchasing/feature', () => ({
  SupplierPurchaseInvoices: (props: object) => <p>Рахунки {JSON.stringify(props)}</p>,
}));
vi.mock('@admin/accounting/feature', () => ({
  CounterpartyFinance: ({ kind, id }: { kind: string; id: string }) => (
    <p>
      Фінанси {kind} {id}
    </p>
  ),
}));

const all: SupplierCardAccess = {
  materials: true,
  products: true,
  fabricStock: true,
  purchaseInvoices: true,
  finance: true,
};

function openCard(access: SupplierCardAccess = all, query = '') {
  const router = createMemoryRouter(
    [
      {
        path: '/references/counterparties/suppliers/:supplierId',
        element: <SupplierCardPage access={access} />,
      },
      { path: '/references/counterparties', element: <p>Список постачальників</p> },
    ],
    { initialEntries: [`/references/counterparties/suppliers/7${query}`] },
  );
  render(<RouterProvider router={router} />);
}

afterEach(() => {
  cleanup();
  fixture.receipts = [];
});

describe('supplier card (CARD-001)', () => {
  it('looks like a client card: header, period, «Огляд» with counts and contacts', () => {
    openCard();
    expect(screen.getByRole('heading', { level: 1, name: 'Атлас' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Період' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Тканини: відкрити список' })).toHaveTextContent('2');
    expect(screen.getByRole('button', { name: 'Фурнітура: відкрити список' })).toHaveTextContent(
      '1',
    );
    expect(screen.getByRole('button', { name: 'Товари: відкрити список' })).toHaveTextContent('4');
    expect(
      screen.getByRole('button', { name: 'Приходи за період: відкрити список' }),
    ).toHaveTextContent('6');
    expect(screen.getByText('Зв’язок')).toBeInTheDocument();
  });

  it('lists the fabrics linked to the supplier or named after it', () => {
    openCard(all, '?tab=fabrics');
    expect(screen.getByText('Саржа')).toBeInTheDocument();
    expect(screen.getByText('Льон')).toBeInTheDocument();
    expect(screen.queryByText('Чужа')).not.toBeInTheDocument();
  });

  it('passes the period to receipts and invoices', () => {
    openCard(all, '?tab=invoices&period=custom&from=2026-10-01&to=2026-10-31');
    expect(
      screen.getByText('Рахунки {"supplierId":7,"from":"2026-10-01","to":"2026-10-31"}'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Прихід на склад' }));
    expect(fixture.receipts.at(-1)).toEqual(
      expect.objectContaining({
        supplierId: 7,
        kind: 'Receipt',
        from: '2026-10-01',
        to: '2026-10-31',
      }),
    );
  });

  it('shows only the tabs the user may open', () => {
    openCard({ ...all, purchaseInvoices: false, finance: false }, '?tab=finance');
    expect(screen.queryByRole('tab', { name: 'Рахунки на закупку' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Фінанси' })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Огляд' })).toHaveAttribute('aria-selected', 'true');
  });

  it('leads back to the supplier list', async () => {
    openCard();
    fireEvent.click(screen.getByRole('button', { name: /Контрагенти · Постачальники/ }));
    expect(await screen.findByText('Список постачальників')).toBeInTheDocument();
  });
});
