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

const order = (id: number, number: number, clientName: string, nearestDueDate: string) => ({
  id,
  number,
  status: 'New',
  clientName,
  quoteId: null,
  quoteNumber: null,
  managerName: 'Олена',
  orderDate: '2026-11-01',
  itemsCount: 1,
  totalQuantity: 10,
  nearestDueDate,
  isTransferred: false,
  updatedAt: '2026-11-01T10:00:00Z',
  stage: 'Cutting',
  shippedQuantity: 0,
  items: [],
});

const ordersQuery = vi.fn();

vi.mock('@admin/production/data-access', () => ({
  useGetWorkshopDashboardQuery: (_: unknown, options: { skip: boolean }) =>
    options.skip ? {} : { data: dashboard },
  useGetProductionOrdersQuery: (query: unknown, options: { skip: boolean }) => {
    ordersQuery(query);
    return options.skip
      ? {}
      : {
          data: {
            items: [order(9, 44, 'Метінвест', '2026-01-02'), order(10, 45, 'АТБ', '2099-11-18')],
            total: 2,
          },
        };
  },
}));
vi.mock('@admin/leads/data-access', () => ({
  useGetLeadMyDayQuery: (_: unknown, options: { skip: boolean }) =>
    options.skip
      ? {}
      : {
          data: {
            queue: [
              { id: 1, company: 'ТОВ «Агросвіт»', isOverdue: true, nextContactAt: null },
              { id: 2, company: 'ПП «Колос»', isOverdue: false, nextContactAt: null },
            ],
            later: [],
            callsToday: 5,
            plannedToday: 17,
            free: 3,
          },
        },
}));
vi.mock('@admin/tasks/data-access', () => ({
  useGetTaskOverviewQuery: (_: unknown, options: { skip: boolean }) =>
    options.skip
      ? {}
      : {
          data: {
            open: 9,
            overdue: 2,
            urgent: 1,
            new: 0,
            inProgress: 0,
            done: 0,
            doneLastWeek: 0,
            onTimePercent: null,
            load: [],
          },
        },
  useListTasksQuery: (_: unknown, options: { skip: boolean }) =>
    options.skip
      ? {}
      : {
          data: {
            items: [
              {
                id: 1,
                title: 'Надіслати КП',
                isOverdue: true,
                isUrgent: false,
                dueAt: '2026-11-10T10:00:00Z',
                customerName: 'Кернел',
              },
              {
                id: 2,
                title: 'Узгодити макет',
                isOverdue: false,
                isUrgent: true,
                dueAt: '2026-11-12T10:00:00Z',
                customerName: null,
              },
              {
                id: 3,
                title: 'Спокійне',
                isOverdue: false,
                isUrgent: false,
                dueAt: '2026-11-20T10:00:00Z',
                customerName: null,
              },
            ],
            total: 3,
          },
        },
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
      <DashboardPage useViewer={() => ({ canSee: (page) => pages.includes(page), userId: 2 })} />
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

  it('gives a manager their day: calls, burning tasks, own КП and own orders in the workshop', () => {
    renderFor('desk-sales', 'leads', 'tasks', 'quotes', 'production-orders', 'embroidery');

    expect(screen.getByRole('heading', { level: 1, name: 'Робочий стіл менеджера' })).toBeVisible();
    const metrics = screen.getByRole('region', { name: 'Показники' });
    expect(within(metrics).getByText('5 з 17')).toBeVisible();
    expect(within(metrics).getByText('2 прострочено')).toBeVisible();
    expect(within(metrics).getByText('1 запізнюється')).toBeVisible();

    const calls = screen.getByRole('region', { name: 'Черга дзвінків' });
    expect(within(calls).getByText('прострочено')).toBeVisible();
    const tasks = screen.getByRole('region', { name: 'Завдання, що горять' });
    expect(within(tasks).getByText('Надіслати КП · Кернел')).toBeVisible();
    expect(within(tasks).getByText('терміново')).toBeVisible();
    expect(within(tasks).queryByText('Спокійне')).toBeNull();

    expect(screen.getByRole('heading', { name: 'Мої КП' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'КП-0005' })).toHaveAttribute('href', '/crm/quotes/5');
    const orders = screen.getByRole('region', { name: 'Мої замовлення в цеху' });
    expect(within(orders).getByRole('link', { name: '№44 Метінвест' })).toHaveAttribute(
      'href',
      '/production/orders/9',
    );
    expect(within(orders).getByText('запізнюється')).toBeVisible();
    expect(within(orders).getByText('до 18.11')).toBeVisible();
    expect(ordersQuery).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'New', managerUserId: 2, sort: 'due' }),
    );

    expect(screen.getByRole('link', { name: 'Ціна вишивки' })).toHaveAttribute(
      'href',
      '/crm/embroidery',
    );
    expect(screen.getByRole('link', { name: 'Новий розрахунок' })).toHaveAttribute(
      'href',
      '/crm/quotes/new',
    );
    expect(screen.queryByRole('link', { name: 'Клієнти' })).toBeNull();
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
