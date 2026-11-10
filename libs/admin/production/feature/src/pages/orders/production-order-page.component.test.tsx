import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ProductionOrderPage from './production-order-page';

const api = vi.hoisted(() => {
  const order = (seesPrices: boolean, extra: Record<string, unknown> = {}) => ({
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
      canTrack: seesPrices,
      canClose: false,
      canCancel: true,
      canReopen: false,
      canManageFiles: true,
      canSendTelegram: true,
    },
    cancelReason: null,
    files: [],
    telegram: { status: 'NotSent', sentAt: null, sentByName: null, error: null, ready: true },
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
        stages: ['FabricAvailable'],
        currentStage: 'FabricAvailable',
        shippedQuantity: 4,
        shipments: [],
      },
    ],
    ...extra,
  });
  return {
    order,
    current: order(false),
    update: vi.fn(),
    stages: vi.fn(),
    ship: vi.fn(),
    status: vi.fn(),
  };
});

vi.mock('@admin/production/data-access', () => {
  const mutation = (fn: (arg: unknown) => unknown) => () => [
    (arg: unknown) => ({ unwrap: () => Promise.resolve(fn(arg)) }),
    { isLoading: false },
  ];
  return {
    useGetProductionColorsQuery: () => ({ data: ['Чорний'] }),
    useGetProductionEmbroideriesQuery: () => ({ data: [], isFetching: false }),
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
    useSetProductionItemStagesMutation: mutation((arg) => {
      api.stages(arg);
      return api.current;
    }),
    useCreateProductionShipmentMutation: mutation((arg) => {
      api.ship(arg);
      return api.current;
    }),
    useCancelProductionShipmentMutation: mutation(() => api.current),
    useChangeProductionOrderStatusMutation: mutation((arg) => {
      api.status(arg);
      return api.current;
    }),
    useUploadProductionOrderFileMutation: mutation(() => api.current),
    useDeleteProductionOrderFileMutation: mutation(() => api.current),
    useSendProductionOrderTelegramMutation: mutation(() => api.current),
    useGetProductionItemFabricQuery: () => ({
      data: {
        orderId: 5,
        itemId: 3,
        orderVersion: 2,
        fabricCode: 'FAB-1',
        fabricName: 'Оксфорд',
        quantity: 10,
        hasNorm: true,
        plan: [
          {
            fabricCode: 'FAB-1',
            color: 'чорний',
            colorKey: 'чорний',
            planned: 15,
            covered: 0,
            issued: 0,
            reserved: 15,
            stockId: 1,
            stockMeters: 10,
            stockAvailable: -5,
          },
        ],
        issued: 0,
        issues: [],
        canIssue: api.current.permissions.canTrack,
      },
      isLoading: false,
    }),
    useGetFabricStockChoicesQuery: () => ({ data: undefined, isFetching: false }),
    useCreateFabricIssueMutation: mutation(() => undefined),
    useReverseFabricIssueMutation: mutation(() => undefined),
    useGetProductionItemWorkQuery: () => ({
      data: {
        orderId: 5,
        itemId: 3,
        orderNumber: 12,
        modelName: 'Куртка',
        quantity: 10,
        sewingRate: 120,
        sewn: 4,
        cut: 10,
        rows: [
          {
            id: 9,
            orderId: 5,
            orderNumber: 12,
            clientName: 'School 5',
            itemId: 3,
            modelName: 'Куртка',
            employeeId: 2,
            employeeName: 'Андреева',
            kind: 'Sewing',
            quantity: 4,
            workDate: '2026-11-04',
            overPlan: false,
            reason: null,
            comment: null,
            rate: 120,
            isVoided: false,
            voidedAt: null,
            voidedByName: null,
            voidReason: null,
            createdByName: 'Начальник',
            createdAt: '2026-11-04T10:00:00Z',
          },
        ],
        canRecord: true,
        cannotRecord: null,
      },
      isLoading: false,
    }),
    useGetWorkChoicesQuery: () => ({ data: undefined, isFetching: false }),
    useVoidProductionWorkMutation: mutation(() => undefined),
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

  it('lets the head of the workshop tick a stage and ship the rest', async () => {
    api.current = api.order(true);
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Крій' }));
    expect(api.stages).toHaveBeenCalledWith({
      id: 5,
      itemId: 3,
      version: 2,
      stages: ['FabricAvailable', 'Cutting'],
    });

    fireEvent.click(screen.getByRole('button', { name: /Відвантажити позицію 1/ }));
    expect(await screen.findByDisplayValue('6', {}, { timeout: 3000 })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Відвантаження записано.', {}, { timeout: 3000 })).toBeTruthy();
    expect(api.ship.mock.calls[0][0]).toMatchObject({
      id: 5,
      itemId: 3,
      body: { version: 2, quantity: 6, comment: null },
    });
  });

  it('shows stages to a manager without letting them tick', () => {
    api.current = api.order(false);
    renderPage();
    expect(screen.getByRole('group', { name: 'Етапи: Куртка' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Крій' })).toBeNull();
    expect(screen.queryByRole('button', { name: /Відвантажити позицію/ })).toBeNull();
  });

  it('shows the fabric plan of an item and lets only the workshop issue it', () => {
    api.current = api.order(false);
    renderPage();
    expect(screen.getByRole('table', { name: 'План тканини' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Видати тканину' })).toBeNull();
    cleanup();
    api.current = api.order(true);
    renderPage();
    expect(screen.getByRole('button', { name: 'Видати тканину' })).toBeTruthy();
  });

  it('shows the work of an item to the workshop only', () => {
    api.current = api.order(false);
    renderPage();
    expect(screen.queryByText(/Пошито 4 з 10/)).toBeNull();
    cleanup();
    api.current = api.order(true);
    renderPage();
    expect(screen.getByText(/Пошито 4 з 10 · покроєно 10 з 10/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Додати роботу' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Сторнувати роботу Андреева/ }));
    expect(screen.getByText('Сторнувати роботу?')).toBeTruthy();
  });

  it('keeps a failed Telegram message on the card with its reason', () => {
    api.current = api.order(false, {
      telegram: {
        status: 'Failed',
        sentAt: null,
        sentByName: null,
        error: 'chat not found',
        ready: true,
      },
    });
    renderPage();
    expect(screen.getByText(/не надіслано: chat not found/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Надіслати ще раз' })).toBeTruthy();
  });

  it('asks for a reason before cancelling', async () => {
    api.current = api.order(false);
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Скасувати' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Скасувати завдання' }));
    expect(await screen.findByText('Вкажіть причину скасування.')).toBeTruthy();
    expect(api.status).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/Причина/), { target: { value: 'Клієнт відмовився' } });
    fireEvent.click(screen.getByRole('button', { name: 'Скасувати завдання' }));
    expect(await screen.findByText('Завдання скасовано.', {}, { timeout: 3000 })).toBeTruthy();
    expect(api.status).toHaveBeenCalledWith({
      id: 5,
      version: 2,
      action: 'cancel',
      reason: 'Клієнт відмовився',
    });
  });
});
