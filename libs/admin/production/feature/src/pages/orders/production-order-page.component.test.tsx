import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ProductionOrderPage from './production-order-page';

const api = vi.hoisted(() => {
  const order = (seesPrices: boolean) => ({
    id: 5,
    number: 12,
    status: 'New',
    clientName: 'School 5',
    quoteId: 7,
    quoteNumber: 'КП-7',
    managerName: 'Олена',
    orderDate: '2026-11-04',
    comment: null,
    priceTier: 'Wholesale',
    isTransferred: false,
    copiedFromOrderId: null,
    createdAt: '2026-11-04T10:00:00Z',
    createdByName: 'Олена',
    updatedAt: '2026-11-04T10:00:00Z',
    version: 2,
    permissions: {
      canEdit: true,
      canCopy: true,
      canDelete: seesPrices,
      seesSewingRate: seesPrices,
      seesReportPrice: seesPrices,
    },
    items: [
      {
        id: 3,
        position: 1,
        modelCode: 'MOD-025',
        modelName: 'Куртка',
        fabricCode: 'FAB-1',
        fabricName: 'Оксфорд',
        quantity: 10,
        dueDate: '2026-11-20',
        mainColor: 'чорний',
        additionalColors: [],
        sizesText: null,
        technicalChanges: null,
        comment: null,
        applications: [],
        plannedFabricMeters: 15,
        sewingRate: seesPrices ? 120 : null,
        reportUnitPrice: seesPrices ? 800 : null,
      },
    ],
  });
  return { order, current: order(false), update: vi.fn() };
});

vi.mock('@admin/production/data-access', () => {
  const mutation = (fn: (arg: unknown) => unknown) => () => [
    (arg: unknown) => ({ unwrap: () => Promise.resolve(fn(arg)) }),
    { isLoading: false },
  ];
  return {
    useGetProductionOrderQuery: () => ({ data: api.current, isLoading: false, refetch: vi.fn() }),
    useGetProductionOrderHistoryQuery: () => ({
      data: [
        {
          id: 1,
          itemId: 3,
          itemName: 'Куртка',
          field: 'Кількість',
          before: '8',
          after: '10',
          actorName: 'Олена',
          at: '2026-11-04T11:00:00Z',
        },
      ],
      isLoading: false,
      isFetching: false,
    }),
    useUpdateProductionOrderMutation: mutation((arg) => {
      api.update(arg);
      return api.current;
    }),
    useCopyProductionOrderMutation: mutation(() => ({ id: 6, number: 13 })),
    useDeleteProductionOrderMutation: mutation(() => undefined),
  };
});

afterEach(cleanup);

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/production/orders/5']}>
      <Routes>
        <Route path="/production/orders/:id" element={<ProductionOrderPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('ProductionOrderPage', () => {
  it('hides prices and «Видалити» from a manager', () => {
    api.current = api.order(false);
    renderPage();
    expect(screen.getByRole('heading', { name: 'Завдання № 12' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Видалити' })).toBeNull();
    expect(screen.queryByText('Розцінка пошиття')).toBeNull();
    expect(screen.queryByText('Ціна для звіту')).toBeNull();
  });

  it('shows the owner the prices and lets them delete', () => {
    api.current = api.order(true);
    renderPage();
    expect(screen.getByRole('button', { name: 'Видалити' })).toBeTruthy();
    expect(screen.getByText('Ціна для звіту')).toBeTruthy();
  });

  it('saves an edited item and shows «Історія змін»', async () => {
    api.current = api.order(false);
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Змінити позицію/ }));
    fireEvent.change(await screen.findByLabelText(/Кількість, шт\./, {}, { timeout: 3000 }), {
      target: { value: '11' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Зміни збережено.', {}, { timeout: 3000 })).toBeTruthy();
    expect(api.update.mock.calls[0][0]).toMatchObject({
      id: 5,
      body: { version: 2, items: [{ id: 3, sewingRate: null, details: { quantity: 11 } }] },
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Історія змін' }));
    expect(await screen.findByText('Куртка: Кількість')).toBeTruthy();
  });
});
