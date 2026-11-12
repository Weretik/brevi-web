import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
    isVoided: false,
    revision: 0,
    canEdit: true,
    ...patch,
  });
  return {
    row,
    canMove: true,
    queries: [] as unknown[],
    receive: vi.fn(),
    reverse: vi.fn(),
    edit: vi.fn(),
    voidMovement: vi.fn(),
    restore: vi.fn(),
  };
});

vi.mock('@admin/warehouse/data-access', () => ({
  useGetFabricMovementsQuery: (query: { page: number }) => {
    api.queries.push(query);
    return {
      data: {
        rows: [
          api.row(1, { revision: 1 }),
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
  useOpenFabricStockMutation: () => [vi.fn()],
  useReverseFabricMovementMutation: () => [
    (body: unknown) => ({ unwrap: () => api.reverse(body) }),
  ],
  useGetFabricConsumptionQuery: () => ({ data: undefined, isFetching: false }),
  useEditFabricMovementMutation: () => [(body: unknown) => ({ unwrap: () => api.edit(body) })],
  useVoidFabricMovementMutation: () => [
    (body: unknown) => ({ unwrap: () => api.voidMovement(body) }),
  ],
  useRestoreFabricMovementMutation: () => [
    (body: unknown) => ({ unwrap: () => api.restore(body) }),
  ],
  useGetFabricMovementHistoryQuery: (movementId: number) => ({
    data: {
      movementId,
      revision: 1,
      canRestore: true,
      revisions: [
        {
          id: 9,
          number: 1,
          action: 'Edit',
          before: {
            fabricCode: 'FAB-067',
            color: 'Синій',
            operationDate: '2026-11-10',
            delta: 25,
            supplierName: 'Тексика',
            document: 'Н-15',
            destination: null,
            isVoided: false,
          },
          after: {
            fabricCode: 'FAB-067',
            color: 'Синій',
            operationDate: '2026-11-10',
            delta: 20,
            supplierName: 'Тексика',
            document: 'Н-15',
            destination: null,
            isVoided: false,
          },
          reason: 'Перерахували рулон',
          createdByName: 'Олена',
          createdAt: '2026-11-11T09:00:00Z',
          isUndone: false,
        },
      ],
    },
    isFetching: false,
    error: undefined,
  }),
}));

beforeEach(() => {
  api.canMove = true;
  api.queries = [];
  api.receive.mockReset();
  api.reverse.mockReset();
  api.edit.mockReset();
  api.voidMovement.mockReset();
  api.restore.mockReset();
});

const saved = {
  operationId: 'a',
  fabricCode: 'FAB-023',
  color: 'Синій',
  meters: 18,
  replayed: false,
};

describe('FabricMovementsPage', () => {
  it('shows receipts and one-off issues with the line balance and pages by «Далі»', () => {
    render(<FabricMovementsPage />, { wrapper: MemoryRouter });
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
    render(<FabricMovementsPage />, { wrapper: MemoryRouter });
    expect(screen.queryByRole('button', { name: 'Новий прихід' })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Сторно/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Редагувати/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Скасувати:/ })).toBeNull();
    expect(screen.getByRole('button', { name: /^Історія правок/ })).toBeTruthy();
  });

  it('retries a failed receipt with the same operation id and keeps the form for the next roll', async () => {
    api.receive.mockRejectedValueOnce(new Error('Мережа недоступна.')).mockResolvedValueOnce({
      operationId: 'a',
      fabricCode: 'FAB-023',
      color: 'Синій',
      meters: 32.5,
      replayed: false,
    });
    render(<FabricMovementsPage />, { wrapper: MemoryRouter });
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
    render(<FabricMovementsPage />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getAllByRole('button', { name: /^Сторно/ })[0] as HTMLElement);
    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/Причина/), { target: { value: 'Помилка' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Сторнувати' }));
    await waitFor(() =>
      expect(api.reverse).toHaveBeenCalledWith({ movementId: 1, reason: 'Помилка' }),
    );
  });

  it('edits a receipt with the revision it shows and the effect on the balance', async () => {
    api.edit.mockResolvedValue(saved);
    render(<FabricMovementsPage />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getAllByRole('button', { name: /^Редагувати/ })[0] as HTMLElement);
    const drawer = screen.getByRole('dialog');
    fireEvent.change(within(drawer).getByLabelText(/Метри/), { target: { value: '18' } });
    expect(within(drawer).getByText(/зміниться на -2 м/)).toBeTruthy();
    fireEvent.click(within(drawer).getByRole('button', { name: 'Зберегти правку' }));
    await waitFor(() => expect(api.edit).toHaveBeenCalledTimes(1));
    expect(api.edit.mock.calls[0]?.[0]).toMatchObject({
      movementId: 1,
      body: { expectedRevision: 1, meters: 18, fabricId: null, color: null },
    });
    expect(await screen.findByText('Правку збережено. Залишки перераховано.')).toBeTruthy();
  });

  it('voids a movement with a reason', async () => {
    api.voidMovement.mockResolvedValue(saved);
    render(<FabricMovementsPage />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getAllByRole('button', { name: /^Скасувати:/ })[1] as HTMLElement);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/залишок зміниться на \+3,5 м/)).toBeTruthy();
    fireEvent.change(within(dialog).getByLabelText(/Причина/), { target: { value: 'Дубль' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Скасувати рух' }));
    await waitFor(() =>
      expect(api.voidMovement).toHaveBeenCalledWith({
        movementId: 2,
        body: expect.objectContaining({ expectedRevision: 0, reason: 'Дубль' }),
      }),
    );
  });

  it('shows the history before and after and takes the last edit back', async () => {
    api.restore.mockResolvedValue(saved);
    render(<FabricMovementsPage />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole('button', { name: /^Історія правок/ }));
    const drawer = screen.getByRole('dialog');
    const table = within(drawer).getByRole('table', { name: 'Історія правок' });
    expect(within(table).getByText('Перерахували рулон')).toBeTruthy();
    expect(within(table).getByText(/\+25 м/)).toBeTruthy();
    fireEvent.click(within(drawer).getByRole('button', { name: 'Скасувати останню правку' }));
    await waitFor(() =>
      expect(api.restore).toHaveBeenCalledWith({
        movementId: 1,
        body: expect.objectContaining({ expectedRevision: 1 }),
      }),
    );
  });
  it('keeps the rare actions in «Ще», opens the opening panel there and has no «Зведення витрати»', () => {
    api.canMove = true;
    render(<FabricMovementsPage />, { wrapper: MemoryRouter });
    expect(screen.queryByRole('button', { name: 'Зведення витрати' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Разова витрата' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Ще' }));
    expect(screen.getByRole('menuitem', { name: /Разова витрата/ })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Вивантажити рух в Excel/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('menuitem', { name: /Внести початковий залишок/ }));
    expect(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Внести початковий залишок' }),
    ).toBeTruthy();
  });

  it('opens on «Початкові» from the old «Початкові залишки» address', () => {
    api.queries.length = 0;
    render(
      <MemoryRouter initialEntries={['/warehouse/movements?kind=Opening']}>
        <FabricMovementsPage />
      </MemoryRouter>,
    );
    expect(api.queries[0]).toMatchObject({ kind: 'Opening', page: 1 });
  });
});
