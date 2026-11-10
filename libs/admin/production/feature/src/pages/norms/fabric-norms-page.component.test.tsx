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
    productId: modelName ? 12 : null,
    season: modelName ? 'Літо' : null,
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
  useGetModelCompositionsQuery: () => ({
    data: [
      {
        modelCode: 'MOD-052',
        modelName: 'Куртка «Віол»',
        productId: 52,
        season: 'Зима',
        modelIsActive: true,
        layers: [
          {
            purpose: 'Підкладка',
            code: 'FUR-021',
            name: 'Підкладка поліестерова',
            quantity: 1.9,
            unit: 'Metre',
          },
        ],
        lines: [
          {
            kind: 'Fabric',
            article: '386',
            code: 'FAB-023',
            name: 'Грета',
            quantity: 2.5,
            unit: 'Metre',
            comment: null,
          },
          {
            kind: 'Accessory',
            article: null,
            code: 'FUR-021',
            name: 'Підкладка поліестерова',
            quantity: 1.9,
            unit: 'Metre',
            comment: null,
          },
        ],
      },
    ],
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
  }),
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

  it('groups the colour columns and shows the season under the model', () => {
    render(
      <MemoryRouter>
        <FabricNormsPage />
      </MemoryRouter>,
    );
    const grid = screen.getByRole('grid', { name: 'Норми витрати тканини' });
    expect(within(grid).getByText('2 кольори')).toBeTruthy();
    expect(within(grid).getByText('3 кольори')).toBeTruthy();
    expect(within(grid).getByText('MOD-025 · Літо')).toBeTruthy();
    expect(within(grid).getByText('3,6 м')).toBeTruthy();
  });

  it('shows the composition of a model on its own tab', () => {
    render(
      <MemoryRouter initialEntries={['/production/fabric-norms?tab=compositions']}>
        <FabricNormsPage />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'Імпорт' })).toBeNull();
    const block = screen.getByRole('region', { name: 'MOD-052 Куртка «Віол»' });
    const layers = within(block).getByRole('table', {
      name: 'Додаткові шари: MOD-052 Куртка «Віол»',
    });
    expect(within(layers).getByText('Підкладка')).toBeTruthy();
    expect(within(layers).getByText('1,9 м')).toBeTruthy();
    expect(within(block).getByText('Повна комплектація · 2 рядки')).toBeTruthy();
    expect(
      within(block).getByRole('link', { name: 'Змінити комплектацію: MOD-052 Куртка «Віол»' }),
    ).toHaveAttribute('href', '/references/products/52?tab=materials');
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
