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
      row('MOD-052', 'Куртка «Віол»', {
        ...empty,
        oneColor: 2.5,
        twoColorsMain: 2.2,
        twoColorsAdditional: 0.3,
      }),
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

const renderPage = (url = '/production/fabric-norms') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <FabricNormsPage />
    </MemoryRouter>,
  );

describe('FabricNormsPage', () => {
  it('counts models and shows the problems chip only when there are problems', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Без норми 1' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Проблеми 1' }));
    const list = screen.getByRole('list', { name: 'Моделі' });
    expect(within(list).getByText('MOD-099')).toBeTruthy();
    expect(within(list).queryByText('Куртка')).toBeNull();
  });

  it('shows the first model with the season under its name', () => {
    renderPage();
    const card = screen.getByRole('region', { name: 'MOD-025 Куртка' });
    expect(within(card).getByText('MOD-025 · Літо')).toBeTruthy();
    expect(within(card).getByText('3,6 м')).toBeTruthy();
    expect(within(card).getByText('Не шиється у 2 кольори.')).toBeTruthy();
  });

  it('shows main and additional fabric, lining and the rest of the composition in one card', () => {
    renderPage('/production/fabric-norms?model=MOD-052');
    const card = screen.getByRole('region', { name: 'MOD-052 Куртка «Віол»' });
    const two = within(card).getByRole('region', { name: '2 кольори' });
    expect(within(two).getByText('Основна')).toBeTruthy();
    expect(within(two).getByText('2,2 м')).toBeTruthy();
    expect(within(two).getByText('Додаткова')).toBeTruthy();
    expect(within(two).getByText('0,3 м')).toBeTruthy();
    expect(within(two).getByText('2,5 м')).toBeTruthy();

    const layers = within(card).getByRole('table', {
      name: 'Підкладка і утеплювач: Куртка «Віол»',
    });
    expect(within(layers).getByText('Підкладка')).toBeTruthy();
    const rest = within(card).getByRole('table', { name: 'Решта складу: Куртка «Віол»' });
    expect(within(rest).getByText('FAB-023 Грета')).toBeTruthy();
    expect(within(rest).queryByText('FUR-021 Підкладка поліестерова')).toBeNull();
    expect(within(card).getByRole('link', { name: 'Склад у «Товари»' })).toHaveAttribute(
      'href',
      '/references/products/12?tab=materials',
    );
  });

  it('counts the materials for a batch', () => {
    renderPage('/production/fabric-norms?model=MOD-052');
    fireEvent.change(screen.getByLabelText('Рахувати на кількість виробів'), {
      target: { value: '40' },
    });
    const two = screen.getByRole('region', { name: '2 кольори' });
    expect(within(two).getByText('× 40 = 88 м')).toBeTruthy();
    expect(within(two).getByText('× 40 = 12 м')).toBeTruthy();
    const layers = screen.getByRole('table', { name: 'Підкладка і утеплювач: Куртка «Віол»' });
    expect(within(layers).getByText('На 40 шт.')).toBeTruthy();
    expect(within(layers).getByText('76 м')).toBeTruthy();
  });

  it('sets a norm for a model without one', async () => {
    renderPage('/production/fabric-norms?model=MOD-030');
    fireEvent.click(screen.getByRole('button', { name: 'Задати норму' }));
    fireEvent.change(await screen.findByLabelText('Один колір: основна'), {
      target: { value: '2,5' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Норму MOD-030 збережено.')).toBeTruthy();
    expect(api.save).toHaveBeenCalledWith({
      modelCode: 'MOD-030',
      norm: expect.objectContaining({ oneColor: 2.5, twoColorsMain: null }),
    });
  });
});
