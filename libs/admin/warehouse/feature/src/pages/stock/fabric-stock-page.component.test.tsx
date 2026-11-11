import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FabricStockPage from './fabric-stock-page';

const api = vi.hoisted(() => {
  const adjust = vi.fn();
  const stock = (canMove: boolean) => ({
    fabrics: [
      {
        fabricCode: 'FAB-023',
        codes: ['FAB-023', 'FAB-067'],
        fabricName: 'Грета',
        composition: '53% бавовна',
        density: '220',
        meters: 5,
        colors: [
          { color: 'Синій', colorKey: 'синій', meters: 15, version: 'v-blue', sources: [] },
          { color: 'Чорний', colorKey: 'чорний', meters: -10, version: 'v-black', sources: [] },
        ],
      },
      {
        fabricCode: 'FAB-005',
        codes: ['FAB-005'],
        fabricName: 'Оксфорд',
        composition: null,
        density: null,
        meters: 0,
        colors: [{ color: 'Білий', colorKey: 'білий', meters: 0, version: 'v-white', sources: [] }],
      },
    ],
    meters: 5,
    pairs: 3,
    negative: 1,
    permissions: { canMove, seesValue: canMove },
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
  useAdjustFabricStockMutation: () => [
    (body: unknown) => ({ unwrap: () => api.adjust(body) }),
    { isLoading: false },
  ],
}));

describe('FabricStockPage', () => {
  it('shows every colour with metres, marks only the shortage and searches locally', () => {
    api.canMove = false;
    render(<FabricStockPage />);
    expect(screen.getByText('Відʼємний залишок у 1 парах', { exact: false })).toBeTruthy();
    expect(screen.getByText('FAB-023 = FAB-067')).toBeTruthy();
    expect(screen.getByText('Білий · 0 м')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Пошук залишків'), { target: { value: 'чорн' } });
    expect(screen.queryByText('Синій · 15 м')).toBeNull();
    expect(screen.getByText(/^Чорний · .10 м$/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Пошук залишків'), { target: { value: 'червоний' } });
    expect(screen.getByText('За цим пошуком тканин і кольорів на складі немає.')).toBeTruthy();
  });

  it('«Уточнити» sends the counted total with the pair version and a reason', async () => {
    api.canMove = true;
    api.adjust.mockResolvedValue({
      operationId: 'x',
      fabricCode: 'FAB-023',
      color: 'Синій',
      meters: 12.25,
      replayed: false,
    });
    render(<FabricStockPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Уточнити: Грета, Синій · 15 м' }));
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
      expectedVersion: 'v-blue',
      targetMeters: 12.25,
      reason: 'Перерахунок',
    });
    expect(api.adjust.mock.calls[0]?.[0].operationId).toMatch(/^[0-9a-f-]{36}$/);
    expect(await screen.findByText('Залишок уточнено.')).toBeTruthy();
  });

  it('refuses a total below the current shortage before sending', () => {
    api.canMove = true;
    api.adjust.mockClear();
    render(<FabricStockPage />);
    fireEvent.click(screen.getByRole('button', { name: /^Уточнити: Грета, Чорний · .10 м$/ }));
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
});
