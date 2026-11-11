import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import DashboardPage from './dashboard-page';

import type { WorkshopDashboard } from '@admin/production/model';
import type { BookingReport, HardwareReport } from '@admin/warehouse/model';

const dashboard: WorkshopDashboard = {
  today: '2026-11-05',
  openOrders: 2,
  openPieces: 75,
  lateOrders: 1,
  readyOrders: 1,
  readyPieces: 15,
  stages: [
    {
      stage: 1,
      label: 'Нове',
      orders: [
        {
          id: 7,
          number: 31,
          clientName: 'ТОВ «Нива»',
          product: 'Халат робочий',
          items: 2,
          quantity: 60,
          progress: 25,
          dueDate: '2026-11-01',
          isLate: true,
        },
      ],
    },
    { stage: 7, label: 'Готово до відвантаження', orders: [] },
  ],
  hours: [{ employeeId: 3, name: 'Андреева', minutes: 960 }],
};

const pair = (fabricName: string, color: string, toOrder: number, shortage: number) => ({
  fabricCode: fabricName,
  fabricName,
  color,
  stock: 0,
  need: 0,
  reserved: 0,
  free: 0,
  toOrder,
  shortage,
  items: [],
});

const booking: BookingReport = {
  reserved: 0,
  free: 0,
  toOrder: 140,
  pairs: [
    pair('Грета', 'синій', 140, 0),
    pair('Канвас', 'чорний', 0, 12),
    pair('Оксфорд', 'сірий', 0, 0),
  ],
  unknown: [],
  calculatedAt: '2026-11-11T10:00:00Z',
};

const hardware: HardwareReport = {
  orders: 1,
  items: 1,
  needs: [
    {
      code: 'ACC-1',
      name: 'Блискавка 18 см',
      nameChecked: true,
      note: null,
      unit: 'Piece',
      quantity: 120,
      orders: [],
    },
  ],
  incomplete: [],
  calculatedAt: '2026-11-11T10:00:00Z',
};

vi.mock('@admin/production/data-access', () => ({
  useGetWorkshopDashboardQuery: (_: unknown, options: { skip: boolean }) =>
    options.skip ? {} : { data: dashboard },
}));
vi.mock('@admin/warehouse/data-access', () => ({
  useGetFabricBookingQuery: (_: unknown, options: { skip: boolean }) =>
    options.skip ? {} : { data: booking },
  useGetHardwareOrderQuery: (_: unknown, options: { skip: boolean }) =>
    options.skip ? {} : { data: hardware },
}));
vi.mock('@admin/quotes/data-access', () => ({
  useListQuotesQuery: (_: unknown, options: { skip: boolean }) =>
    options.skip
      ? {}
      : {
          data: {
            items: [
              {
                id: 5,
                number: 'КП-0005',
                kind: 'Regular',
                status: 'Sent',
                internalName: 'Нива халати',
                companyName: 'ТОВ «Нива»',
                responsible: { userId: 2, name: 'Олена' },
                itemsCount: 2,
                updatedAt: '2026-11-04T10:00:00Z',
                lastSentAt: '2026-11-04T10:00:00Z',
                version: 1,
              },
            ],
            page: 1,
            pageSize: 6,
            total: 1,
          },
        },
}));

const renderFor = (...pages: string[]) =>
  render(
    <MemoryRouter>
      <DashboardPage useViewer={() => ({ canSee: (page) => pages.includes(page) })} />
    </MemoryRouter>,
  );

const chief = [
  'desk-workshop',
  'production-orders',
  'fabric-booking',
  'hardware-order',
  'quotes',
] as const;

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe('DashboardPage', () => {
  it('gives the head of the workshop the board, hours and shortages, without КП', () => {
    renderFor(...chief);

    expect(screen.getByRole('heading', { level: 1, name: 'Робочий стіл цеху' })).toBeVisible();
    expect(screen.queryByRole('tablist')).toBeNull();
    const metrics = screen.getByRole('region', { name: 'Показники' });
    expect(within(metrics).getByText('виробів 75')).toBeVisible();

    const board = screen.getByRole('region', { name: 'Дошка цеху' });
    const column = within(board).getByRole('region', { name: 'Нове' });
    expect(within(column).getByRole('link', { name: '№31' })).toHaveAttribute(
      'href',
      '/production/orders/7',
    );
    expect(screen.getByText('16 год')).toBeVisible();

    const fabric = screen.getByRole('region', { name: 'Не вистачає тканини' });
    expect(within(fabric).getByText('замовити 140 м')).toBeVisible();
    expect(within(fabric).getByText('мінус 12 м')).toBeVisible();
    expect(within(fabric).queryByText(/Оксфорд/)).toBeNull();
    const parts = screen.getByRole('region', { name: 'Фурнітура до замовлення' });
    expect(within(parts).getByText('120 шт')).toBeVisible();

    expect(screen.queryByRole('link', { name: 'КП-0005' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Новий розрахунок' })).toBeNull();
  });

  it('hides a block whose page the role lacks', () => {
    renderFor('desk-workshop', 'production-orders');

    expect(screen.getByRole('region', { name: 'Дошка цеху' })).toBeVisible();
    expect(screen.queryByRole('region', { name: 'Не вистачає тканини' })).toBeNull();
    expect(screen.queryByRole('region', { name: 'Фурнітура до замовлення' })).toBeNull();
  });

  it('gives a manager the latest КП and the quick actions', () => {
    renderFor('desk-sales', 'quotes', 'production-orders');

    expect(screen.getByRole('heading', { level: 1, name: 'Робочий стіл менеджера' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'КП-0005' })).toHaveAttribute('href', '/crm/quotes/5');
    expect(screen.getByRole('link', { name: 'Новий розрахунок' })).toHaveAttribute(
      'href',
      '/crm/quotes/new',
    );
    expect(screen.queryByRole('region', { name: 'Дошка цеху' })).toBeNull();
  });

  it('lets a person with several desks switch them and remembers the choice', () => {
    renderFor(...chief, 'desk-sales');

    expect(screen.getByRole('heading', { level: 1, name: 'Робочий стіл' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Цех' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: 'Продажі' }));

    expect(screen.getByRole('link', { name: 'КП-0005' })).toBeVisible();
    expect(window.localStorage.getItem('brevi-admin:desk')).toBe('sales');
  });

  it('shows no desk to a role without one', () => {
    renderFor('quotes', 'production-orders');

    expect(screen.queryByRole('region', { name: 'Дошка цеху' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Новий розрахунок' })).toBeNull();
    expect(screen.getByText('Оберіть розділ у меню ліворуч.')).toBeVisible();
  });
});
