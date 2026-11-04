import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SewingProductCard } from './sewing-product-card';
import { render } from '../../test-utils';

import type { ProductDetail, SewingArticleSummaryRow } from '@admin/products/model';

const mocks = vi.hoisted(() => ({
  card: vi.fn(),
  pricing: vi.fn((props: unknown) => {
    void props;
    return null;
  }),
  saveVariant: vi.fn(),
  deleteVariant: vi.fn(),
  saveMaterials: vi.fn(),
  saveOperations: vi.fn(),
}));

const operation = {
  clientId: 'operation-1',
  operationId: 7,
  quantity: 2,
  manualMinutes: null,
  sortOrder: 0,
  comment: 'Комір',
};
const accessory = {
  clientId: 'material-1',
  kind: 'Accessory' as const,
  referenceId: 10,
  costCode: null,
  quantity: 4,
  unit: 'Piece' as const,
  sortOrder: 0,
  comment: '',
};
const fabric = (id: number, name: string, code: string) => ({
  id,
  name,
  code,
  price: 200,
  isActive: true,
});

vi.mock('../../hooks/sewing-card/use-sewing-card', () => ({ useSewingCard: mocks.card }));
vi.mock('../sewing-pricing/sewing-pricing-feature', () => ({
  SewingPricingFeature: mocks.pricing,
}));
vi.mock('../../hooks/sewing-model/use-sewing-model', () => ({
  useSewingModel: () => ({
    canManage: true,
    loading: false,
    error: null,
    retry: vi.fn(),
    variants: [
      {
        id: 11,
        productId: 42,
        saleSku: '602',
        active: true,
        sortOrder: 0,
        fabricId: 59,
        fabricQuantity: 2.5,
      },
      {
        id: 12,
        productId: 42,
        saleSku: '603',
        active: false,
        sortOrder: 1,
        fabricId: 60,
        fabricQuantity: 2.5,
      },
    ],
    modelCode: 'MOD-025',
    version: 3,
    draft: {
      productId: 42,
      modelCode: 'MOD-025',
      version: 3,
      modelMaterials: [accessory],
      operations: [operation],
    },
    fabrics: [
      fabric(59, 'Габардин бежевий', 'FAB-001'),
      fabric(60, 'Габардин чорний', 'FAB-002'),
      fabric(61, 'Льон', 'FAB-003'),
    ],
    accessories: [
      { id: 10, name: 'Ґудзик', code: 'FUR-001', price: 1.5, unit: 'шт.', isActive: true },
    ],
    operations: [
      {
        id: 7,
        code: 'OP-007',
        garmentPartName: 'Комір',
        name: 'Комір: Стійка',
        min: 7.3,
        minutesPerProduct: false,
        isActive: true,
      },
      {
        id: 8,
        code: 'OP-008',
        garmentPartName: 'Застібка',
        name: 'Петля',
        min: 1,
        minutesPerProduct: false,
        isActive: true,
      },
    ],
  }),
}));
vi.mock('../../hooks/sewing-model/use-sewing-model-writes', () => ({
  useSewingModelWrites: () => ({
    busy: false,
    error: null,
    clearError: vi.fn(),
    saveVariant: mocks.saveVariant,
    deleteVariant: mocks.deleteVariant,
    saveMaterials: mocks.saveMaterials,
    saveOperations: mocks.saveOperations,
  }),
}));

const product = { id: 42, name: 'Костюм «Верде»', type: 'Sewing' } as ProductDetail;
const tiers = { retail: 900, wholesale: 820, largeWholesale: 780 };
const article = (id: number, saleSku: string, update: Partial<SewingArticleSummaryRow> = {}) =>
  ({
    id,
    saleSku,
    active: true,
    sortOrder: id,
    calculated: true,
    blockers: [],
    costs: [{ kind: 'seamstress', amount: 110 }],
    minutes: 50,
    minuteCost: 2,
    fullCost: 500,
    prices: tiers,
    published: null,
    ...update,
  }) satisfies SewingArticleSummaryRow;

function Location() {
  const location = useLocation();
  return <output aria-label="Адреса">{location.search}</output>;
}

function renderCard(search = '') {
  render(
    <MemoryRouter initialEntries={[`/references/products/42${search}`]}>
      <Routes>
        <Route
          path="/references/products/:id"
          element={
            <>
              <SewingProductCard product={product} onDeleted={vi.fn()} />
              <Location />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mocks.card.mockReturnValue({
    row: {
      id: 42,
      type: 'Sewing',
      code: 'MOD-025',
      name: 'Костюм «Верде»',
      sectionId: 1,
      season: 'Літо',
      isActive: true,
      currentSiteUrl: 'https://brevi.com.ua/verde',
      quoteDescription: null,
      updatedAtUtc: '2026-11-03T00:00:00Z',
    },
    sections: [],
    sectionNames: new Map([[1, 'Одяг ЛІТО']]),
    reloadOverview: vi.fn(),
    articles: [
      article(11, '602'),
      article(12, '603', {
        calculated: false,
        prices: null,
        fullCost: null,
        costs: [],
        blockers: [{ code: 'MissingFabric', inputKey: null }],
      }),
    ],
    totals: {
      articles: 2,
      ready: 1,
      minutes: 50,
      fullCost: { min: 500, max: 500 },
      retail: { min: 900, max: 900 },
    },
    status: { label: 'Без ціни: 1 з 2', tone: 'warning' },
    seamstressPerMinute: 2.2,
    summaryLoading: false,
    summaryError: null,
    reloadSummary: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('SewingProductCard', () => {
  beforeEach(() => {
    for (const save of [
      mocks.saveVariant,
      mocks.deleteVariant,
      mocks.saveMaterials,
      mocks.saveOperations,
    ])
      save.mockResolvedValue(true);
  });

  it('shows the model, one row per fabric and only the problems', async () => {
    renderCard();

    expect(screen.getByRole('heading', { name: 'Костюм «Верде»' })).toBeVisible();
    expect(screen.getByText('MOD-025 · Одяг ЛІТО · Літо')).toBeVisible();
    expect(screen.getAllByText('Без ціни: 1 з 2').length).toBeGreaterThan(0);
    expect(screen.getByRole('tab', { name: 'Тканини' })).toHaveAttribute('aria-selected', 'true');
    const grid = await screen.findByRole('grid', { name: 'Тканини моделі' });
    expect(within(grid).getByText('Габардин бежевий')).toBeInTheDocument();
    expect(within(grid).getByText('Габардин чорний')).toBeInTheDocument();
    // Only problems are marked: a switched-off fabric and the reason of a missing price (CAT-013).
    expect(within(grid).getByText('Вимкнена')).toBeInTheDocument();
    expect(within(grid).getByText('Немає тканини')).toBeInTheDocument();
    expect(within(grid).queryByText('Активна')).not.toBeInTheDocument();
  });

  it('opens a fabric in the side panel and saves the change at once', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(await screen.findByText('Габардин бежевий'));
    const panel = screen.getByRole('dialog', { name: 'Тканина моделі' });
    expect(within(panel).getByLabelText(/Розхід на 1 виріб/)).toHaveValue('2,5');
    await user.click(within(panel).getByRole('button', { name: 'Редагувати' }));
    const editor = screen.getByRole('dialog', { name: 'Тканина моделі' });
    await user.clear(within(editor).getByLabelText(/Розхід на 1 виріб/));
    await user.type(within(editor).getByLabelText(/Розхід на 1 виріб/), '2,75');
    await user.click(within(editor).getByRole('button', { name: 'Зберегти' }));

    expect(mocks.saveVariant).toHaveBeenCalledWith(11, {
      saleSku: '602',
      active: true,
      sortOrder: 0,
      fabricId: 59,
      fabricQuantity: 2.75,
      expectedVersion: 3,
    });
  });

  it('adds a fabric with the metres of the other fabrics and checks its SKU', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: 'Додати тканину' }));
    const panel = screen.getByRole('dialog', { name: 'Нова тканина' });
    expect(within(panel).getByLabelText(/Розхід на 1 виріб/)).toHaveValue('2,5');
    await user.click(within(panel).getByRole('combobox', { name: /Тканина/ }));
    await user.click(screen.getByRole('option', { name: 'Льон · FAB-003' }));
    await user.type(within(panel).getByLabelText(/Артикул/), '602');
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));
    expect(within(panel).getByText('Такий артикул уже є в моделі.')).toBeInTheDocument();
    expect(mocks.saveVariant).not.toHaveBeenCalled();

    await user.clear(within(panel).getByLabelText(/Артикул/));
    await user.type(within(panel).getByLabelText(/Артикул/), '604');
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));
    expect(mocks.saveVariant).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ fabricId: 61, saleSku: '604', sortOrder: 2, fabricQuantity: 2.5 }),
    );
  });

  it('keeps the shared accessories in a table and deletes a line after confirmation', async () => {
    const user = userEvent.setup();
    renderCard('?tab=materials');

    const table = screen.getByRole('table', { name: 'Комплектація моделі' });
    expect(within(table).getByText('Ґудзик')).toBeInTheDocument();
    await user.click(within(table).getByRole('button', { name: 'Видалити: Ґудзик' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Видалити «Ґудзик»?' })).getByRole('button', {
        name: 'Видалити',
      }),
    );
    expect(mocks.saveMaterials).toHaveBeenCalledWith([]);
  });

  it('shows labour time and pay and adds an operation in the side panel', async () => {
    const user = userEvent.setup();
    renderCard();
    await user.click(screen.getByRole('tab', { name: 'Трудовитрати' }));

    const table = screen.getByRole('table', { name: 'Трудовитрати моделі' });
    expect(within(table).getByText('Комір: Стійка')).toBeInTheDocument();
    expect(within(table).getAllByText('14,6')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Додати операцію' }));
    const panel = screen.getByRole('dialog', { name: 'Нова операція' });
    await user.click(within(panel).getByRole('combobox', { name: /Операція/ }));
    await user.click(screen.getByRole('option', { name: 'OP-008 · Застібка · Петля' }));
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));
    expect(mocks.saveOperations).toHaveBeenCalledWith([
      operation,
      expect.objectContaining({ operationId: 8, quantity: 1, manualMinutes: null }),
    ]);
  });

  it('names the fabrics on «Розрахунок» and keeps the tab in the address', async () => {
    const user = userEvent.setup();
    renderCard();
    await user.click(screen.getByRole('tab', { name: 'Розрахунок' }));
    expect(screen.getByLabelText('Адреса')).toHaveTextContent('?tab=pricing');
    await user.click(screen.getByRole('button', { name: 'Габардин чорний' }));
    expect(mocks.pricing.mock.calls.at(-1)?.[0]).toEqual(
      expect.objectContaining({ productId: 42, articleId: 12 }),
    );
  });

  it('offers to continue the «Нова модель» wizard only while the model is not launched', () => {
    renderCard();
    expect(screen.queryByRole('link', { name: 'Продовжити заповнення' })).toBeNull();
    cleanup();

    const card = mocks.card();
    mocks.card.mockReturnValue({
      ...card,
      row: { ...card.row, isActive: false },
      summaryLoaded: true,
    });
    renderCard();
    expect(screen.getByRole('link', { name: 'Продовжити заповнення' })).toHaveAttribute(
      'href',
      '/references/products/new/sewing?id=42&step=2',
    );
  });
});
