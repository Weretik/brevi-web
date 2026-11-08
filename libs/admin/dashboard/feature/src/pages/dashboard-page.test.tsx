import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DashboardPage from './dashboard-page';

import type { WorkshopDashboard } from '@admin/production/model';

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

vi.mock('@admin/production/data-access', () => ({
  useGetWorkshopDashboardQuery: (_: unknown, options: { skip: boolean }) =>
    options.skip ? {} : { data: dashboard },
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

const renderFor = (seesWorkshop: boolean, seesQuotes: boolean) =>
  render(
    <MemoryRouter>
      <DashboardPage useViewer={() => ({ seesWorkshop, seesQuotes })} />
    </MemoryRouter>,
  );

afterEach(cleanup);

describe('DashboardPage', () => {
  it('shows the real workshop board, metrics, hours and the latest КП', () => {
    renderFor(true, true);

    expect(screen.getByRole('heading', { level: 1, name: 'Огляд виробництва' })).toBeVisible();
    expect(screen.queryByText('Демо-дані')).toBeNull();
    const metrics = screen.getByRole('region', { name: 'Показники' });
    expect(within(metrics).getByText('Прострочено')).toBeVisible();
    expect(within(metrics).getByText('виробів 75')).toBeVisible();

    const board = screen.getByRole('region', { name: 'Дошка цеху' });
    const column = within(board).getByRole('region', { name: 'Нове' });
    expect(within(column).getByRole('link', { name: '№31' })).toHaveAttribute(
      'href',
      '/production/orders/7',
    );
    expect(within(column).getByText('Халат робочий + ще 1')).toBeVisible();
    expect(within(board).getAllByText(/прострочено/)).toHaveLength(1);

    expect(screen.getByRole('link', { name: 'КП-0005' })).toHaveAttribute('href', '/crm/quotes/5');
    expect(screen.getByText('16 год')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Новий розрахунок' })).toHaveAttribute(
      'href',
      '/crm/quotes/new',
    );
  });

  it('shows neither block to a role without them', () => {
    renderFor(false, false);

    expect(screen.queryByRole('region', { name: 'Дошка цеху' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Новий розрахунок' })).toBeNull();
  });
});
