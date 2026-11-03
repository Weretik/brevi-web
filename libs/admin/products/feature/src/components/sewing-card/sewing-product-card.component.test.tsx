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
  screen: vi.fn((props: unknown) => {
    void props;
    return null;
  }),
  requestModel: vi.fn(),
}));

vi.mock('../../hooks/sewing-card/use-sewing-card', () => ({ useSewingCard: mocks.card }));
vi.mock('../sewing-pricing/sewing-pricing-feature', () => ({
  SewingPricingFeature: mocks.pricing,
}));
vi.mock('../sewing-composition/sewing-composition-screen', () => ({
  SewingCompositionScreen: mocks.screen,
}));
vi.mock('../../hooks/sewing-composition/use-sewing-composition-controller', () => ({
  useSewingCompositionController: () => ({
    drafts: {
      modelDraft: {
        modelCode: 'MOD-025',
        version: 3,
        modelMaterials: [],
        articleMaterials: [],
        operations: [
          {
            clientId: 'a',
            operationId: 7,
            quantity: 2,
            manualMinutes: null,
            sortOrder: 0,
            comment: 'Комір',
          },
        ],
      },
      setModelDraft: vi.fn(),
      setModelBaseline: vi.fn(),
      dirty: false,
    },
    selection: {
      scope: 'Article',
      requestModel: mocks.requestModel,
      requestCreateArticle: vi.fn(),
    },
    queries: { articles: { data: { version: 3, modelCode: 'MOD-025', articles: [] } } },
    sewingLookups: { operations: [{ id: 7, name: 'Комір: Стійка', min: 7.3 }] },
    canManage: true,
    busy: false,
    articleCreation: { state: { isLoading: false }, error: null },
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
      unpublished: 1,
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
  it('shows the model fields, its status and every Article with the sheet reason', async () => {
    renderCard();

    expect(screen.getByRole('heading', { name: 'Костюм «Верде»' })).toBeVisible();
    expect(screen.getByText('MOD-025 · Одяг ЛІТО · Літо')).toBeVisible();
    expect(screen.getAllByText('Без ціни: 1 з 2').length).toBeGreaterThan(0);
    expect(screen.queryByText(/Перевірено/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'На сайті' })).toHaveAttribute(
      'href',
      'https://brevi.com.ua/verde',
    );
    const grid = await screen.findByRole('grid', { name: 'Артикули моделі' });
    // Only problems are marked: the priced Article shows its price, the other the reason (CAT-013).
    expect(within(grid).queryByText('Готово до розрахунку')).not.toBeInTheDocument();
    expect(within(grid).getByText('Немає тканини')).toBeInTheDocument();
  });

  it('opens the calculation of a clicked Article and keeps the tab in the address', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(await screen.findByText('603'));

    expect(screen.getByRole('tab', { name: 'Розрахунок' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByLabelText('Адреса')).toHaveTextContent('?tab=pricing');
    expect(mocks.pricing.mock.calls.at(-1)?.[0]).toEqual(
      expect.objectContaining({ productId: 42, articleId: 12 }),
    );
  });

  it('shows labour time and pay and edits operations on the shared model composition', async () => {
    renderCard();
    await userEvent.setup().click(screen.getByRole('tab', { name: 'Трудовитрати' }));

    const table = screen.getByRole('table', { name: 'Трудовитрати моделі' });
    expect(within(table).getByText('Комір: Стійка')).toBeInTheDocument();
    expect(within(table).getAllByText('14,6')).toHaveLength(2);
    expect(mocks.requestModel).toHaveBeenCalled();
    expect(mocks.screen.mock.calls.at(-1)?.[0]).toEqual(
      expect.objectContaining({ productId: 42, section: 'operations' }),
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
