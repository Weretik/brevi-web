import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductionOrderQuickPanel } from './production-order-quick-panel';

const api = vi.hoisted(() => ({ stages: vi.fn(), canTrack: true }));

const order = () => ({
  id: 5,
  number: 12,
  status: 'New',
  clientName: 'School 5',
  quoteId: null,
  quoteNumber: null,
  managerName: 'Олена',
  orderDate: '2026-11-04',
  comment: null,
  priceTier: null,
  isTransferred: false,
  copiedFromOrderId: null,
  createdAt: '2026-11-04T10:00:00Z',
  createdByName: 'Олена',
  updatedAt: '2026-11-04T10:00:00Z',
  version: 2,
  permissions: { canTrack: api.canTrack, seesReportPrice: false },
  cancelReason: null,
  files: [],
  telegram: { status: 'Sent', sentAt: null, sentByName: null, error: null, ready: true },
  items: [
    {
      id: 3,
      position: 1,
      modelCode: null,
      modelName: 'Куртка',
      fabricCode: 'FAB-1',
      fabricName: null,
      quantity: 10,
      dueDate: '2099-01-01',
      mainColor: 'чорний',
      additionalColors: [],
      applications: [],
      stages: ['Cutting'],
      currentStage: 'Cutting',
      shippedQuantity: 0,
      shipments: [],
    },
  ],
});

vi.mock('@admin/production/data-access', () => {
  const mutation = (fn: (arg: unknown) => unknown) => () => [
    (arg: unknown) => ({ unwrap: () => Promise.resolve(fn(arg)) }),
    { isLoading: false },
  ];
  return {
    useGetProductionOrderQuery: () => ({ data: order(), isLoading: false, refetch: vi.fn() }),
    useGetProductionOrderHistoryQuery: () => ({ data: [], isLoading: false, isFetching: false }),
    useSetProductionItemStagesMutation: mutation((arg) => api.stages(arg)),
    useCreateProductionShipmentMutation: mutation(() => undefined),
    useCancelProductionShipmentMutation: mutation(() => undefined),
  };
});

function Where() {
  const location = useLocation();
  return <p>{`at ${location.pathname}${location.search}`}</p>;
}

const renderPanel = () =>
  render(
    <MemoryRouter initialEntries={['/production/orders?order=5']}>
      <Routes>
        <Route
          path="/production/orders"
          element={<ProductionOrderQuickPanel orderId={5} onClose={vi.fn()} />}
        />
        <Route path="/production/orders/:id" element={<Where />} />
      </Routes>
    </MemoryRouter>,
  );

afterEach(cleanup);

describe('ProductionOrderQuickPanel', () => {
  it('shows the order items and ticks the next stage after a confirmation', () => {
    api.canTrack = true;
    renderPanel();
    expect(screen.getByRole('heading', { name: 'Завдання № 12' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Відмітити етап «Пошив»: Куртка' }));
    expect(api.stages).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Відмітити' }));
    expect(api.stages).toHaveBeenCalledWith({
      id: 5,
      itemId: 3,
      version: 2,
      stages: ['Cutting', 'Sewing'],
    });
  });

  it('opens the item on the order card', () => {
    api.canTrack = false;
    renderPanel();
    expect(screen.queryByRole('button', { name: /Відмітити етап/ })).toBeNull();
    fireEvent.click(screen.getByRole('row', { name: 'Відкрити позицію 1: Куртка' }));
    expect(screen.getByText('at /production/orders/5?item=3')).toBeTruthy();
  });
});
