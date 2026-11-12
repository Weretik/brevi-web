import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import FabricBookingPage from './fabric-booking-page';
import FabricValuationPage from './fabric-valuation-page';
import HardwareOrderPage from './hardware-order-page';
import { WarehouseToOrderPage } from '../to-order/warehouse-to-order-page';

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
  supplier: color === 'Синій' ? 'Черкаси' : 'Тексика',
  needBy: items.length > 0 ? '2026-11-19' : null,
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
      canReceive: true,
    },
    isFetching: false,
    error: undefined,
    refetch: vi.fn(),
  }),
  useGetFabricStockChoicesQuery: () => ({
    data: {
      fabrics: [
        {
          id: 7,
          code: 'FAB-023',
          groupCode: 'FAB-023',
          name: 'Грета',
          composition: null,
          density: null,
          supplier: 'Тексика',
          price: null,
        },
      ],
      suppliers: ['Тексика'],
      colors: ['Темно-сірий', 'Синій'],
    },
    isFetching: false,
    error: undefined,
  }),
  useReceiveFabricMutation: () => [vi.fn()],
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
          dueDate: '2026-11-19',
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
              dueDate: '2026-11-19',
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
          dueDate: null,
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
  it('«Що замовити › Тканина» shows what to order first, the queue of a pair and plans that are unknown', () => {
    inRouter(
      <FabricBookingPage
        access={{ stock: true, planFact: false, booking: true, valuation: false, hardware: false }}
      />,
    );
    expect(screen.getByText('1 пара · 1 постачальник')).toBeTruthy();
    expect(screen.queryByText('Грета · Синій')).toBeNull();
    expect(screen.getByText('19.11.2026')).toBeTruthy();
    expect(screen.getByText('є 8 з 13,2')).toBeTruthy();

    fireEvent.click(screen.getByRole('row', { name: 'Грета, Темно-сірий' }));
    const panel = screen.getByRole('dialog');
    expect(within(panel).getByRole('link', { name: 'Ц-14' }).getAttribute('href')).toBe(
      '/production/orders/14',
    );
    expect(within(panel).getByText(/не вистачає 5,2 м/)).toBeTruthy();
    fireEvent.click(within(panel).getByRole('button', { name: 'Закрити' }));

    fireEvent.click(screen.getByRole('button', { name: /Усі пари/ }));
    expect(screen.getByText('Грета · Синій')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Без плану/ }));
    expect(screen.getByText('Для моделі немає норми витрати: план не порахувати.')).toBeTruthy();
  });

  it('«+ Прихід» on a row opens the receipt with the pair and its supplier', () => {
    inRouter(
      <FabricBookingPage
        access={{ stock: true, planFact: false, booking: true, valuation: false, hardware: false }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Прихід: Грета, Темно-сірий' }));
    const panel = screen.getByRole('dialog');
    expect(within(panel).getByText('Прихід тканини')).toBeTruthy();
    expect(within(panel).getByDisplayValue('Тексика')).toBeTruthy();
  });

  it('«+ Прихід» is not offered without the page «Залишки»', () => {
    inRouter(
      <FabricBookingPage
        access={{ stock: false, planFact: false, booking: true, valuation: false, hardware: false }}
      />,
    );
    expect(screen.queryByRole('button', { name: /^Прихід:/ })).toBeNull();
  });

  it('«Вартість складу» marks the partial total, the unpriced fabric and the shortage', () => {
    inRouter(<FabricValuationPage />);
    expect(screen.getByText('Вартість оціненої частини')).toBeTruthy();
    expect(screen.getByText('Без ціни', { selector: 'td' })).toBeTruthy();
    expect(screen.getByText(/ціна з FAB-067/)).toBeTruthy();
    expect(screen.getByText('Дефіцит (відʼємний залишок)')).toBeTruthy();
  });

  it('«Що замовити › Фурнітура» shows the need with its date, the incomplete lines and the names to check', () => {
    inRouter(<HardwareOrderPage />);
    expect(screen.getByText('Позицій фурнітури')).toBeTruthy();
    expect(screen.getByText('Назву не знайдено в довіднику')).toBeTruthy();
    expect(screen.getByText('19.11.2026')).toBeTruthy();
    fireEvent.click(screen.getByRole('row', { name: 'Блискавка, FUR-005' }));
    expect(within(screen.getByRole('dialog')).getByText(/1 × 3 = 3 шт/)).toBeTruthy();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Закрити' }));
    fireEvent.change(screen.getByLabelText('Пошук фурнітури'), { target: { value: 'FUR-007' } });
    fireEvent.click(screen.getByRole('button', { name: /Неповна потреба/ }));
    expect(
      screen.getByText('Не визначено, чи це фурнітура: кількість не порахована.'),
    ).toBeTruthy();
  });

  it('«Що замовити» shows only the tabs the rights open and opens the tab of the address', async () => {
    const access = (hardware: boolean) => () => ({
      stock: true,
      planFact: false,
      booking: true,
      valuation: false,
      hardware,
    });
    const first = render(
      <MemoryRouter initialEntries={['/warehouse/to-order?tab=hardware']}>
        <WarehouseToOrderPage useAccess={access(true)} />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Позицій фурнітури')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Що замовити' })).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'Тканина' }));
    expect(await screen.findByText('Вільно на складі')).toBeTruthy();
    first.unmount();

    render(
      <MemoryRouter initialEntries={['/warehouse/to-order?tab=hardware']}>
        <WarehouseToOrderPage useAccess={access(false)} />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Вільно на складі')).toBeTruthy();
    expect(screen.queryByRole('tab')).toBeNull();
  });
});
