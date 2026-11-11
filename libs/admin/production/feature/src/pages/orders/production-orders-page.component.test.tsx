import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductionOrdersPage } from './production-orders-page';

const fixture = vi.hoisted(() => ({
  lists: [] as Record<string, unknown>[],
  summaries: [] as { query: Record<string, unknown>; skip: boolean }[],
}));

const page = {
  items: [],
  page: 1,
  pageSize: 50,
  total: 0,
  counts: { all: 4, new: 4, closed: 0, cancelled: 0 },
  managers: ['Олена', 'Анастасія'],
  stages: [
    { stage: 'New', count: 1, overdue: 0 },
    { stage: 'FabricOrdered', count: 0, overdue: 0 },
    { stage: 'FabricAvailable', count: 0, overdue: 0 },
    { stage: 'Cutting', count: 2, overdue: 1 },
    { stage: 'Application', count: 0, overdue: 0 },
    { stage: 'Sewing', count: 1, overdue: 0 },
    { stage: 'Ready', count: 0, overdue: 0 },
    { stage: 'Shipped', count: 0, overdue: 0 },
    { stage: 'Complete', count: 0, overdue: 0 },
  ],
  attention: { overdue: 1, dueSoon: 2 },
};
const idle = { isLoading: false, isFetching: false, error: undefined, refetch: vi.fn() };

vi.mock('@admin/production/data-access', () => ({
  useGetProductionOrdersQuery: (query: Record<string, unknown>) => {
    fixture.lists.push(query);
    return { ...idle, data: page };
  },
  useLazyGetProductionOrdersQuery: () => [vi.fn()],
  useGetProductionOrderFilterOptionsQuery: () => ({
    ...idle,
    data: { clients: [], models: [], fabrics: [], colors: [], seasons: ['Зима'] },
  }),
  useGetProductionModelSummaryQuery: (
    query: Record<string, unknown>,
    options: { skip: boolean },
  ) => {
    fixture.summaries.push({ query, skip: options.skip });
    return {
      ...idle,
      data: options.skip
        ? undefined
        : {
            rows: [
              {
                modelCode: 'MOD-052',
                modelName: 'Куртка «Віол»',
                season: 'Зима',
                category: 'Куртка',
                quantity: 12,
                ordersCount: 2,
              },
            ],
            totalQuantity: 12,
          },
    };
  },
  useImportProductionOrdersMutation: () => [vi.fn()],
  useImportProductionProgressMutation: () => [vi.fn()],
  useImportProductionReportPricesMutation: () => [vi.fn()],
}));

const actor = () => ({ canCreate: false, canImport: false }) as never;
const admin = () => ({ canCreate: true, canImport: true }) as never;

function renderPage(useOrderActor = actor) {
  const router = createMemoryRouter(
    [
      {
        path: '/production/orders',
        element: <ProductionOrdersPage useOrderActor={useOrderActor} />,
      },
    ],
    { initialEntries: ['/production/orders'] },
  );
  render(<RouterProvider router={router} />);
}

afterEach(() => {
  cleanup();
  fixture.lists = [];
  fixture.summaries = [];
});

describe('ProductionOrdersPage', () => {
  it('opens on «Нові» sorted by the nearest due date', () => {
    renderPage();

    expect(fixture.lists.at(-1)).toEqual(
      expect.objectContaining({ status: 'New', sort: 'due', stage: null, dueTo: null }),
    );
    expect(screen.getByRole('button', { name: 'Нові 4' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('a stage of the conveyor filters the list and a second press removes it', async () => {
    const user = userEvent.setup();
    renderPage();
    const conveyor = screen.getByRole('group', { name: 'Етапи цеху' });
    expect(within(conveyor).queryByRole('button', { name: /Завершено/ })).toBeNull();

    await user.click(within(conveyor).getByRole('button', { name: 'Крій: 2, прострочено 1' }));
    expect(fixture.lists.at(-1)).toEqual(expect.objectContaining({ stage: 'Cutting' }));
    expect(screen.getByText('Етап: Крій')).toBeVisible();

    await user.click(within(conveyor).getByRole('button', { name: 'Крій: 2, прострочено 1' }));
    expect(fixture.lists.at(-1)).toEqual(expect.objectContaining({ stage: null }));
  });

  it('the attention strip shows overdue and due-soon orders and narrows the list to them', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(
      screen.getByText('1 завдання прострочене, 2 завдання мають термін у найближчі 3 дні'),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Показати' }));

    const query = fixture.lists.at(-1);
    expect(query).toEqual(expect.objectContaining({ status: 'New' }));
    expect(query?.['dueTo']).toEqual(expect.any(String));
    expect(screen.getByText('Термін горить')).toBeVisible();
  });

  it('keeps the transfers from the old «Цех» in «⋯» for Admin only', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.queryByRole('button', { name: 'Ще дії' })).toBeNull();
    cleanup();

    renderPage(admin);
    await user.click(screen.getByRole('button', { name: 'Ще дії' }));
    expect(screen.getByRole('menuitem', { name: 'Імпорт завдань' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Імпорт етапів' })).toBeVisible();
    await user.click(screen.getByRole('menuitem', { name: 'Ціни КП' }));
    expect(screen.getByText(/production-report-prices.json/)).toBeVisible();
  });

  it('«Фільтри» open in a side panel with the manager, and a set filter shows as a chip', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Фільтри' }));
    const panel = screen.getByRole('dialog', { name: 'Фільтри' });
    await user.click(within(panel).getByRole('combobox', { name: 'Менеджер' }));
    await user.click(screen.getByRole('option', { name: 'Олена' }));
    expect(fixture.lists.at(-1)).toEqual(expect.objectContaining({ manager: 'Олена' }));
    await user.click(within(panel).getByRole('button', { name: 'Показати 0' }));

    expect(screen.getByText('Менеджер: Олена')).toBeVisible();
  });

  it('loads the summary only on its view and «Переглянути» opens the list of that model', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(fixture.summaries.every((x) => x.skip)).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Зведення за моделями' }));
    await user.click(screen.getByRole('button', { name: 'Сортування за пріоритетом (3)' }));
    expect(screen.getByRole('group', { name: 'Сортування за пріоритетом' })).toBeVisible();
    expect(fixture.summaries.at(-1)?.skip).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Переглянути завдання: Куртка «Віол»' }));

    expect(screen.getByRole('button', { name: 'Список' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(fixture.lists.at(-1)).toEqual(
      expect.objectContaining({ page: 1, filters: expect.objectContaining({ model: 'MOD-052' }) }),
    );
  });
});
