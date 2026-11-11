import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import FabricMovementsPage from './fabric-movements-page';

const api = vi.hoisted(() => {
  const row = (id: number, patch: Record<string, unknown> = {}) => ({
    id,
    stockId: 1,
    kind: 'Receipt',
    operationDate: '2026-11-10',
    createdAt: '2026-11-11T08:00:00Z',
    fabricCode: 'FAB-067',
    groupCode: 'FAB-023',
    fabricName: 'Грета',
    color: 'Синій',
    supplierName: 'Тексика',
    document: 'Н-15',
    orderId: null,
    itemId: null,
    orderNumber: null,
    modelName: null,
    destination: null,
    delta: 20,
    metersAfter: 20,
    note: null,
    createdByName: 'Олена',
    isReversed: false,
    reversesMovementId: null,
    canReverse: true,
    ...patch,
  });
  return {
    row,
    canMove: true,
    queries: [] as unknown[],
    receive: vi.fn(),
    reverse: vi.fn(),
  };
});

vi.mock('@admin/warehouse/data-access', () => ({
  useGetFabricMovementsQuery: (query: { page: number }) => {
    api.queries.push(query);
    return {
      data: {
        rows: [
          api.row(1),
          api.row(2, {
            kind: 'Issue',
            delta: -3.5,
            metersAfter: -1,
            destination: 'Зразки',
            supplierName: null,
            document: null,
          }),
        ],
        page: query.page,
        hasMore: query.page < 2,
        permissions: { canMove: api.canMove, seesValue: false },
      },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    };
  },
  useGetFabricStockQuery: () => ({
    data: {
      fabrics: [],
      meters: 0,
      pairs: 0,
      negative: 0,
      permissions: { canMove: api.canMove, seesValue: false },
    },
  }),
  useGetFabricStockChoicesQuery: () => ({
    data: {
      fabrics: [
        {
          id: 67,
          code: 'FAB-067',
          groupCode: 'FAB-023',
          name: 'Грета',
          composition: null,
          density: null,
          supplier: 'Черкаси',
          price: null,
        },
      ],
      suppliers: ['Тексика'],
      colors: ['Синій'],
    },
    isFetching: false,
  }),
  useLazyGetFabricMovementsQuery: () => [vi.fn()],
  useReceiveFabricMutation: () => [(body: unknown) => ({ unwrap: () => api.receive(body) })],
  useIssueFabricMutation: () => [vi.fn()],
  useReverseFabricMovementMutation: () => [
    (body: unknown) => ({ unwrap: () => api.reverse(body) }),
  ],
  useGetFabricConsumptionQuery: () => ({ data: undefined, isFetching: false }),
}));

beforeEach(() => {
  api.canMove = true;
  api.queries = [];
  api.receive.mockReset();
  api.reverse.mockReset();
});

describe('FabricMovementsPage', () => {
  it('shows receipts and one-off issues with the line balance and pages by «Далі»', () => {
    render(<FabricMovementsPage />);
    const table = screen.getByRole('table', { name: 'Рух тканини' });
    expect(within(table).getByText('Зразки')).toBeTruthy();
    expect(within(table).getByText('Без замовлення')).toBeTruthy();
    expect(within(table).getAllByText(/на складі як FAB-023/)).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Назад' })).toHaveProperty('disabled', true);
    fireEvent.click(screen.getByRole('button', { name: 'Далі' }));
    expect(api.queries.at(-1)).toMatchObject({ page: 2, kind: 'All' });
    expect(screen.getByRole('button', { name: 'Далі' })).toHaveProperty('disabled', true);
  });

  it('hides «Прихід» and «Сторно» from people who cannot move stock', () => {
    api.canMove = false;
    render(<FabricMovementsPage />);
    expect(screen.queryByRole('button', { name: 'Новий прихід' })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Сторно/ })).toBeNull();
  });

  it('retries a failed receipt with the same operation id and keeps the form for the next roll', async () => {
    api.receive.mockRejectedValueOnce(new Error('Мережа недоступна.')).mockResolvedValueOnce({
      operationId: 'a',
      fabricCode: 'FAB-023',
      color: 'Синій',
      meters: 32.5,
      replayed: false,
    });
    render(<FabricMovementsPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Новий прихід' }));
    const drawer = screen.getByRole('dialog');
    fireEvent.change(within(drawer).getByRole('combobox', { name: 'Тканина' }), {
      target: { value: 'FAB-067' },
    });
    fireEvent.click(await screen.findByRole('option', { name: /FAB-067/ }));
    fireEvent.change(within(drawer).getByRole('combobox', { name: 'Колір' }), {
      target: { value: 'Син' },
    });
    fireEvent.click(await screen.findByRole('option', { name: 'Синій' }));
    fireEvent.change(within(drawer).getByLabelText(/Метри/), { target: { value: '12,5' } });
    fireEvent.click(within(drawer).getByRole('button', { name: 'Записати прихід' }));
    expect(await within(drawer).findByText('Мережа недоступна.')).toBeTruthy();
    fireEvent.click(within(drawer).getByRole('button', { name: 'Записати прихід' }));
    await waitFor(() => expect(api.receive).toHaveBeenCalledTimes(2));
    const [first, second] = api.receive.mock.calls.map((call) => call[0]);
    expect(second.operationId).toBe(first.operationId);
    expect(second).toMatchObject({ fabricId: 67, color: 'Синій', meters: 12.5 });
    expect(await within(drawer).findByText('Прихід записано. Залишок оновлено.')).toBeTruthy();
    expect((within(drawer).getByLabelText(/Метри/) as HTMLInputElement).value).toBe('');
  });

  it('reverses a movement with a reason', async () => {
    api.reverse.mockResolvedValue({
      operationId: null,
      fabricCode: 'FAB-023',
      color: 'Синій',
      meters: 0,
      replayed: false,
    });
    render(<FabricMovementsPage />);
    fireEvent.click(screen.getAllByRole('button', { name: /^Сторно/ })[0] as HTMLElement);
    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/Причина/), { target: { value: 'Помилка' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Сторнувати' }));
    await waitFor(() =>
      expect(api.reverse).toHaveBeenCalledWith({ movementId: 1, reason: 'Помилка' }),
    );
  });
});
