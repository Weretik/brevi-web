import { cleanup, render, screen } from '@testing-library/react';
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
  managers: [],
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

afterEach(() => {
  cleanup();
  fixture.lists = [];
  fixture.summaries = [];
});

describe('ProductionOrdersPage', () => {
  it('loads the summary only on its tab and «Переглянути» opens the list of that model', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [{ path: '/production/orders', element: <ProductionOrdersPage useOrderActor={actor} /> }],
      { initialEntries: ['/production/orders'] },
    );
    render(<RouterProvider router={router} />);

    expect(fixture.summaries.every((x) => x.skip)).toBe(true);
    await user.click(screen.getByRole('tab', { name: 'Зведення за моделями' }));
    expect(screen.getByText('Сортування за пріоритетом')).toBeVisible();
    expect(fixture.summaries.at(-1)?.skip).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Переглянути завдання: Куртка «Віол»' }));

    expect(screen.getByRole('tab', { name: 'Завдання' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(fixture.lists.at(-1)).toEqual(
      expect.objectContaining({ page: 1, filters: expect.objectContaining({ model: 'MOD-052' }) }),
    );
  });
});
