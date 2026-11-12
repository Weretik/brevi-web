import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import FabricStockPage from './fabric-stock-page';

const api = vi.hoisted(() => {
  const adjust = vi.fn();
  const pair = (color: string, meters: number, booked = 0, toOrder = 0, extra = {}) => ({
    color,
    colorKey: color.toLowerCase(),
    meters,
    version: `v-${color}`,
    sources: [],
    booked,
    free: meters - booked,
    toOrder,
    lastMovement: null,
    bookings: [],
    ...extra,
  });
  const stock = (canMove: boolean) => ({
    fabrics: [
      {
        fabricCode: 'FAB-023',
        codes: ['FAB-023', 'FAB-067'],
        fabricName: 'Грета',
        composition: '53% бавовна',
        density: '220',
        meters: 8,
        supplier: 'Черкаси',
        booked: 13,
        free: -5,
        colors: [
          pair('Синій', 15, 5, 0, {
            lastMovement: {
              id: 7,
              kind: 'Issue',
              operationDate: '2026-11-11',
              delta: -5,
              orderNumber: 14,
              document: null,
              supplierName: null,
              destination: null,
            },
            bookings: [
              {
                orderId: 3,
                orderNumber: 14,
                clientName: 'Нафтогаз',
                modelName: 'Куртка «Віол»',
                dueDate: null,
                need: 5,
                toOrder: 0,
              },
            ],
          }),
          pair('Хакі', 3, 8, 5),
          pair('Чорний', -10),
        ],
      },
      {
        fabricCode: 'FAB-005',
        codes: ['FAB-005'],
        fabricName: 'Оксфорд',
        composition: null,
        density: null,
        meters: 0,
        supplier: 'Тексика',
        booked: 0,
        free: 0,
        colors: [pair('Білий', 0)],
      },
    ],
    meters: 8,
    pairs: 4,
    negative: 1,
    short: 1,
    permissions: { canMove, seesValue: canMove, canTransfer: canMove },
  });
  return { adjust, stock, canMove: true };
});

vi.mock('@admin/warehouse/data-access', () => ({
  useGetFabricStockQuery: () => ({
    data: api.stock(api.canMove),
    isFetching: false,
    error: undefined,
    refetch: vi.fn(),
  }),
  useGetFabricMovementsQuery: () => ({
    data: {
      rows: [
        {
          id: 7,
          stockId: 1,
          kind: 'Issue',
          operationDate: '2026-11-11',
          createdAt: '2026-11-11T08:00:00Z',
          fabricCode: 'FAB-023',
          groupCode: 'FAB-023',
          fabricName: 'Грета',
          color: 'Синій',
          supplierName: null,
          document: null,
          orderId: 3,
          itemId: 4,
          orderNumber: 14,
          modelName: 'Куртка «Віол»',
          destination: null,
          delta: -5,
          metersAfter: 15,
          pairMetersAfter: 15,
          perProduct: null,
          note: null,
          createdByName: 'Олена',
          isReversed: false,
          reversesMovementId: null,
          canReverse: false,
          isVoided: false,
          revision: 0,
          canEdit: true,
        },
      ],
      page: 1,
      hasMore: false,
      total: 1,
      counts: null,
      permissions: { canMove: true, seesValue: false, canTransfer: false },
    },
    error: undefined,
  }),
  useAdjustFabricStockMutation: () => [
    (body: unknown) => ({ unwrap: () => api.adjust(body) }),
    { isLoading: false },
  ],
}));

const show = () => render(<FabricStockPage />, { wrapper: MemoryRouter });

describe('FabricStockPage', () => {
  it('folds fabrics, counts the problem chips and marks only the problems', () => {
    api.canMove = false;
    show();
    expect(screen.getByText('FAB-023 = FAB-067', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('row', { name: /Грета, Синій/ })).toBeNull();
    expect(screen.getByText('Знайдено: 4 із 4')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Відʼємні 1' }));
    expect(screen.getByRole('row', { name: /Грета, Чорний/ })).toBeTruthy();
    expect(screen.getByText('Відʼємний')).toBeTruthy();
    expect(screen.queryByRole('row', { name: /Грета, Синій/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Не вистачає під завдання 1' }));
    expect(screen.getByText('Замовити 5')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Усі 4' }));
    fireEvent.change(screen.getByLabelText('Пошук залишків'), { target: { value: 'червоний' } });
    expect(screen.getByText('За цим пошуком і фільтром пар на складі немає.')).toBeTruthy();
  });

  it('opens a pair with the tasks that book it and its latest movements', () => {
    api.canMove = false;
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути: Грета' }));
    const row = screen.getByRole('row', { name: /Грета, Синій/ });
    expect(within(row).getByText('Ц-14 · 11.11')).toBeTruthy();
    fireEvent.click(row);
    const drawer = screen.getByRole('dialog', { name: 'Грета · Синій' });
    expect(within(drawer).getByText('Нафтогаз · Куртка «Віол»')).toBeTruthy();
    expect(within(drawer).getByText(/На завдання · Ц-14/)).toBeTruthy();
    expect(within(drawer).queryByRole('button', { name: 'Уточнити залишок' })).toBeNull();
  });

  it('«Уточнити залишок» sends the counted total with the pair version and a reason', async () => {
    api.canMove = true;
    api.adjust.mockResolvedValue({
      operationId: 'x',
      fabricCode: 'FAB-023',
      color: 'Синій',
      meters: 12.25,
      replayed: false,
    });
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути: Грета' }));
    fireEvent.click(screen.getByRole('row', { name: /Грета, Синій/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Уточнити залишок' }));
    const drawer = screen.getByRole('dialog');
    fireEvent.change(within(drawer).getByLabelText(/Фактичний залишок/), {
      target: { value: '12,25' },
    });
    expect(within(drawer).getByText(/Буде записано уточнення −2,75 м/)).toBeTruthy();
    fireEvent.change(within(drawer).getByLabelText(/Причина/), {
      target: { value: 'Перерахунок' },
    });
    fireEvent.click(within(drawer).getByRole('button', { name: 'Уточнити' }));
    await waitFor(() => expect(api.adjust).toHaveBeenCalledTimes(1));
    expect(api.adjust.mock.calls[0]?.[0]).toMatchObject({
      fabricCode: 'FAB-023',
      color: 'Синій',
      expectedVersion: 'v-Синій',
      targetMeters: 12.25,
      reason: 'Перерахунок',
    });
    expect(api.adjust.mock.calls[0]?.[0].operationId).toMatch(/^[0-9a-f-]{36}$/);
    expect(await screen.findByText('Залишок уточнено.')).toBeTruthy();
  });

  it('refuses a total below the current shortage before sending', () => {
    api.canMove = true;
    api.adjust.mockClear();
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути: Грета' }));
    fireEvent.click(screen.getByRole('row', { name: /Грета, Чорний/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Уточнити залишок' }));
    const drawer = screen.getByRole('dialog');
    fireEvent.change(within(drawer).getByLabelText(/Фактичний залишок/), {
      target: { value: '-12' },
    });
    fireEvent.change(within(drawer).getByLabelText(/Причина/), {
      target: { value: 'Перерахунок' },
    });
    fireEvent.click(within(drawer).getByRole('button', { name: 'Уточнити' }));
    expect(within(drawer).getByText('Уточнення не може збільшити нестачу.')).toBeTruthy();
    expect(api.adjust).not.toHaveBeenCalled();
  });

  it('keeps the rare actions and Excel in «Ще»', () => {
    api.canMove = true;
    show();
    expect(screen.getByRole('button', { name: 'Прихід' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Перенесення з v133' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Ще' }));
    expect(screen.getByRole('menuitem', { name: /Завантажити залишки в Excel/ })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Перенесення з v133/ })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Разова витрата/ })).toBeTruthy();
  });
});
