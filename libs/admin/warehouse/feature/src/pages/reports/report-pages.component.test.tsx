import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import FabricBookingPage from './fabric-booking-page';
import FabricConsumptionPage from './fabric-consumption-page';
import FabricPlanFactPage from './fabric-plan-fact-page';
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

const planFactSummary = (plan: number | null, fact: number, orders = 1) => ({
  orders,
  products: 10 * orders,
  planPerProduct: plan,
  factPerProduct: fact,
  differencePerProduct: plan === null ? null : fact - plan,
  difference: plan === null ? null : (fact - plan) * 10 * orders,
  result: plan === null ? 'NeedsCheck' : fact > plan ? 'Overrun' : 'Economy',
  uncomparableItems: plan === null ? 1 : 0,
});

const planFactModel = (modelName: string, plan: number | null, fact: number) => ({
  modelName,
  modelCode: null,
  summary: planFactSummary(plan, fact),
  items: [
    {
      orderId: 14,
      orderNumber: 14,
      clientName: 'Нафтогаз',
      itemId: 140,
      products: 10,
      plan: plan === null ? null : plan * 10,
      fact: fact * 10,
      difference: plan === null ? null : (fact - plan) * 10,
      result: plan === null ? 'NoPlan' : fact > plan ? 'Overrun' : 'Economy',
      reason: plan === null ? 'Немає норми.' : null,
      materials: [
        {
          layer: 'Upper',
          planFabricCode: 'FAB-023',
          planFabricName: 'Грета',
          planColor: 'Темно-сірий',
          plan: plan === null ? null : plan * 10,
          fact: fact * 10,
          difference: plan === null ? null : (fact - plan) * 10,
          used: ['Грета · Темно-сірий'],
        },
      ],
      issuedOn: '2026-11-04',
    },
  ],
});

const planFactQuery = vi.fn();
const consumptionQuery = vi.fn();

vi.mock('@admin/warehouse/data-access', () => ({
  useGetFabricPlanFactQuery: (filter: unknown) => {
    planFactQuery(filter);
    return {
      data: {
        models: [
          planFactModel('Жилет сигнальний', 0.62, 0.63),
          planFactModel('Куртка «Віол»', 1.32, 1.45),
          planFactModel('Халат медичний', null, 1.1),
        ],
        total: planFactSummary(null, 1.06, 3),
        inProgressItems: 1,
      },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    };
  },
  useGetFabricConsumptionQuery: (params: unknown) => {
    consumptionQuery(params);
    return {
      data: {
        from: '2026-11-01',
        to: '2026-11-12',
        rows: [
          {
            stockId: 1,
            fabricCode: 'FAB-041',
            fabricName: 'Тиса',
            color: 'Хакі',
            received: 120,
            issued: 54,
            corrected: -4.5,
            issuedValue: null,
            issuedToTasks: 54,
            oneOff: 0,
          },
          {
            stockId: 2,
            fabricCode: 'FAB-023',
            fabricName: 'Грета',
            color: 'Темно-сірий',
            received: 60,
            issued: 132,
            corrected: 0,
            issuedValue: null,
            issuedToTasks: 132,
            oneOff: 0,
          },
        ],
        received: 180,
        issued: 186,
        issuedValue: null,
        issuedToTasks: 186,
        oneOff: 0,
        corrected: -4.5,
      },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    };
  },
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

  it('«Вартість» lists fabrics by value with a share, marks the unpriced one and shows shortages on a chip', () => {
    inRouter(<FabricValuationPage />);
    expect(screen.getByText('Вартість оціненої частини')).toBeTruthy();
    const rows = screen.getAllByRole('button', { name: /^Розгорнути:/ });
    expect(rows.map((x) => x.getAttribute('aria-label'))).toEqual([
      'Розгорнути: Грета',
      'Розгорнути: Фліс',
    ]);
    expect(screen.getByText(/ціна з FAB-067/)).toBeTruthy();
    expect(screen.getByText('Немає ціни')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'До «Тканини»' }).getAttribute('href')).toBe(
      '/references/garment-accessory?tab=fabrics',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути: Грета' }));
    expect(screen.getByText('Темно-сірий')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /^Дефіцит/ }));
    expect(screen.getByRole('table', { name: 'Дефіцит' })).toBeTruthy();
  });

  it('«План і факт» puts the largest overspending first, marks it over 5% and opens a model', () => {
    inRouter(<FabricPlanFactPage />);
    expect(planFactQuery).toHaveBeenLastCalledWith({ from: null, to: null });
    const names = screen
      .getAllByRole('row')
      .map((x) => x.getAttribute('aria-label'))
      .filter(Boolean);
    expect(names).toEqual(['Куртка «Віол»', 'Жилет сигнальний', 'Халат медичний']);
    expect(screen.getByText('+9,8%')).toBeTruthy();
    expect(
      within(screen.getByRole('row', { name: 'Халат медичний' })).getByText('Немає норми'),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Перевитрата понад 5%/ }));
    expect(screen.queryByRole('row', { name: 'Жилет сигнальний' })).toBeNull();
    fireEvent.click(screen.getByRole('row', { name: 'Куртка «Віол»' }));
    const panel = screen.getByRole('dialog');
    expect(within(panel).getByRole('link', { name: 'Ц-14' })).toBeTruthy();
    expect(within(panel).getByText(/видано 04\.11\.2026/)).toBeTruthy();
  });

  it('«План і факт» sends the period of a preset', () => {
    inRouter(<FabricPlanFactPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Усі дати' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Цей квартал' }));
    const last = planFactQuery.mock.lastCall?.[0] as { from: string; to: string };
    expect(last.from.endsWith('-01')).toBe(true);
    expect(last.to).not.toBeNull();
  });

  it('«Витрата за період» shows the totals by kind and sorts the table', () => {
    inRouter(<FabricConsumptionPage />);
    expect(screen.getByText('Видано на завдання')).toBeTruthy();
    expect(screen.getByText('Разова витрата')).toBeTruthy();
    const first = () => screen.getAllByRole('row')[1]?.textContent ?? '';
    expect(first()).toContain('Грета');
    fireEvent.click(screen.getByRole('button', { name: 'Прийшло, м' }));
    expect(first()).toContain('Тиса');
    fireEvent.click(screen.getByRole('button', { name: 'Прийшло, м' }));
    expect(first()).toContain('Грета');
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
