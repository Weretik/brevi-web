import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import FabricBookingPage from './fabric-booking-page';
import FabricValuationPage from './fabric-valuation-page';
import HardwareOrderPage from './hardware-order-page';

const item = (orderNumber: number, toOrder: number) => ({
  orderId: orderNumber,
  orderNumber,
  clientName: orderNumber === 12 ? 'Геофізика' : 'Нафтогаз',
  itemId: orderNumber * 10,
  modelName: 'Куртка «Віол»',
  dueDate: '2026-11-19',
  layer: 'Upper',
  plan: 6.6,
  covered: 0,
  remaining: 6.6,
  reserved: 6.6 - toOrder,
  toOrder,
});

const pair = (color: string, toOrder: number, items: ReturnType<typeof item>[]) => ({
  fabricCode: 'FAB-023',
  fabricName: 'Грета',
  color,
  stock: 8,
  need: 13.2,
  reserved: 8,
  free: 0,
  toOrder,
  shortage: 0,
  items,
});

vi.mock('@admin/warehouse/data-access', () => ({
  useGetFabricBookingQuery: () => ({
    data: {
      reserved: 8,
      free: 0,
      toOrder: 5.2,
      pairs: [pair('Темно-сірий', 5.2, [item(12, 0), item(14, 5.2)]), pair('Синій', 0, [])],
      unknown: [
        {
          orderId: 15,
          orderNumber: 15,
          clientName: 'Укрзалізниця',
          itemId: 150,
          modelName: 'Жилет',
          reason: 'Для моделі немає норми витрати: план не порахувати.',
        },
      ],
      calculatedAt: '2026-11-11T10:00:00Z',
    },
    isFetching: false,
    error: undefined,
    refetch: vi.fn(),
  }),
  useGetFabricValuationQuery: () => ({
    data: {
      value: 1155,
      positiveMeters: 14.5,
      unpricedPairs: 1,
      unpricedMeters: 4,
      isPartial: true,
      shortageMeters: 2,
      shortageValue: 220,
      fabrics: [
        {
          fabricCode: 'FAB-023',
          fabricName: 'Грета',
          price: 110,
          priceFabricCode: 'FAB-067',
          meters: 10.5,
          unpricedMeters: 0,
          value: 1155,
          colors: [{ color: 'Темно-сірий', meters: 10.5, price: 110, value: 1155 }],
        },
        {
          fabricCode: 'FAB-009',
          fabricName: 'Фліс',
          price: null,
          priceFabricCode: null,
          meters: 4,
          unpricedMeters: 4,
          value: 0,
          colors: [{ color: 'Жовтий', meters: 4, price: null, value: null }],
        },
      ],
      shortages: [
        {
          fabricCode: 'FAB-023',
          fabricName: 'Грета',
          color: 'Червоний',
          meters: 2,
          price: 110,
          value: 220,
        },
      ],
      calculatedAt: '2026-11-11T10:00:00Z',
      priceSource: 'Ціни довідника «Тканини» на момент розрахунку',
    },
    isFetching: false,
    error: undefined,
    refetch: vi.fn(),
  }),
  useGetHardwareOrderQuery: () => ({
    data: {
      orders: 2,
      items: 2,
      needs: [
        {
          code: 'FUR-005',
          name: 'Блискавка',
          nameChecked: true,
          note: '65 см',
          unit: 'Piece',
          quantity: 6,
          orders: [
            {
              orderId: 12,
              orderNumber: 12,
              clientName: 'Геофізика',
              itemId: 120,
              modelName: 'Куртка',
              norm: 1,
              products: 3,
              quantity: 3,
            },
          ],
        },
        {
          code: 'FUR-007',
          name: 'FUR-007',
          nameChecked: false,
          note: null,
          unit: 'Metre',
          quantity: 1.5,
          orders: [],
        },
      ],
      incomplete: [
        {
          orderId: 12,
          orderNumber: 12,
          clientName: 'Геофізика',
          itemId: 120,
          modelName: 'Куртка',
          code: 'FUR-040',
          name: 'Нова позиція',
          reason: 'Не визначено, чи це фурнітура: кількість не порахована.',
        },
      ],
      calculatedAt: '2026-11-11T10:00:00Z',
    },
    isFetching: false,
    error: undefined,
    refetch: vi.fn(),
  }),
}));

const inRouter = (node: React.ReactNode) => render(<MemoryRouter>{node}</MemoryRouter>);

describe('stock report pages', () => {
  it('«Бронь» shows the totals, the queue of a pair, unknown plans and «Лише те, що потрібно замовити»', () => {
    inRouter(<FabricBookingPage />);
    expect(screen.getByText('Потрібно замовити')).toBeTruthy();
    expect(screen.getByText(/У 1 позицій план невідомий/)).toBeTruthy();
    expect(screen.getByText('Для моделі немає норми витрати: план не порахувати.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути: Грета, Темно-сірий' }));
    expect(screen.getByRole('link', { name: 'Ц-14' }).getAttribute('href')).toBe(
      '/production/orders/14',
    );
    fireEvent.click(screen.getByLabelText('Лише те, що потрібно замовити'));
    expect(screen.queryByText('Грета · Синій')).toBeNull();
  });

  it('«Вартість складу» marks the partial total, the unpriced fabric and the shortage', () => {
    inRouter(<FabricValuationPage />);
    expect(screen.getByText('Вартість оціненої частини')).toBeTruthy();
    expect(screen.getByText('Без ціни', { selector: 'td' })).toBeTruthy();
    expect(screen.getByText(/ціна з FAB-067/)).toBeTruthy();
    expect(screen.getByText('Дефіцит (відʼємний залишок)')).toBeTruthy();
  });

  it('«Фурнітура до замовлення» shows the need, the incomplete lines and the names to check', () => {
    inRouter(<HardwareOrderPage />);
    expect(screen.getByText('Активних замовлень')).toBeTruthy();
    expect(screen.getByText('Назву не підтверджено')).toBeTruthy();
    expect(screen.getByText('Потреба неповна')).toBeTruthy();
    expect(screen.getByText(/назви немає в довіднику: FUR-007/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути: Блискавка, FUR-005' }));
    expect(screen.getByText(/1 × 3 = 3 шт/)).toBeTruthy();
  });
});
