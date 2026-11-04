import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FabricNormsPage from './fabric-norms-page';

const api = vi.hoisted(() => {
  const empty: Record<string, number | null> = {
    oneColor: null,
    twoColorsMain: null,
    twoColorsAdditional: null,
    threeColorsMain: null,
    threeColorsAdditional1: null,
    threeColorsAdditional2: null,
  };
  const row = (modelCode: string, modelName: string | null, norm: typeof empty | null) => ({
    modelCode,
    modelName,
    modelIsActive: true,
    norm,
    twoColorsTotal: null,
    threeColorsTotal: null,
    updatedAt: null,
    problem: modelName ? null : 'Модель не знайдено в «Товари».',
  });
  return {
    save: vi.fn(),
    rows: [
      row('MOD-025', 'Куртка', { ...empty, oneColor: 3.6 }),
      row('MOD-030', 'Жилет', null),
      row('MOD-099', null, { ...empty, oneColor: 1 }),
    ],
    mutation: (fn: (arg: unknown) => unknown) => () => [
      (arg: unknown) => ({ unwrap: () => fn(arg) }),
      { isLoading: false },
    ],
  };
});

vi.mock('@admin/production/data-access', () => ({
  useGetFabricNormsQuery: () => ({
    data: api.rows,
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
  }),
  useSaveFabricNormMutation: api.mutation((arg) => {
    api.save(arg);
    return Promise.resolve(api.rows[1]);
  }),
  useDeleteFabricNormMutation: api.mutation(vi.fn()),
  useImportFabricNormsMutation: api.mutation(vi.fn()),
}));

afterEach(cleanup);

describe('FabricNormsPage', () => {
  it('counts models and shows the problems chip only when there are problems', () => {
    render(
      <MemoryRouter>
        <FabricNormsPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Без норми 1' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Проблеми 1' }));
    const grid = screen.getByRole('grid', { name: 'Норми витрати тканини' });
    expect(within(grid).getAllByText('MOD-099').length).toBeGreaterThan(0);
    expect(within(grid).queryByText('Куртка')).toBeNull();
  });

  it('sets a norm for a model without one', async () => {
    render(
      <MemoryRouter>
        <FabricNormsPage />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Дії: MOD-030 Жилет' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Редагувати' }));
    fireEvent.change(await screen.findByLabelText('Один колір'), { target: { value: '2,5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Норму MOD-030 збережено.')).toBeTruthy();
    expect(api.save).toHaveBeenCalledWith({
      modelCode: 'MOD-030',
      norm: expect.objectContaining({ oneColor: 2.5, twoColorsMain: null }),
    });
  });
});
