import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductsPage, productsTabOf } from './products-page';
import { render } from '../../test-utils';

import type {
  ProductOverview,
  ProductOverviewPrices,
  ProductOverviewType,
} from '@admin/products/model';

const row = (
  id: number,
  type: ProductOverviewType,
  code: string,
  name: string,
  sectionId: number | null,
): ProductOverview => ({
  id,
  type,
  code,
  name,
  sectionId,
  season: type === 'Sewing' ? 'Літо' : null,
  isActive: true,
  isVerified: id === 1,
  verifiedOn: id === 1 ? '08.09.2026' : null,
  currentSiteUrl: id === 1 ? 'https://brevi.com.ua/specodyag-litnij/kostyum-verde' : null,
  quoteDescription: 'Костюм із курткою та штанами.',
  updatedAtUtc: '2026-11-03T10:00:00Z',
});

const data: Record<ProductOverviewType, ProductOverview[]> = {
  Sewing: [
    row(1, 'Sewing', 'MOD-025', 'Костюм «Верде»', 1),
    row(2, 'Sewing', 'MOD-026', 'Халат', null),
  ],
  Ppe: [row(3, 'Ppe', '17', 'Рукавиці', 9)],
};

const tiers = (retail: number) => ({
  retail,
  wholesale: retail - 100,
  largeWholesale: retail - 150,
});

const prices = new Map<number, ProductOverviewPrices>([
  [
    1,
    {
      productId: 1,
      status: 'Stale',
      from: tiers(1364.17),
      pricesUpdatedAt: '2026-11-03T10:00:00Z',
      blockers: [],
      articles: [
        {
          articleId: 602,
          saleSku: '602',
          active: true,
          fabricId: 7,
          published: tiers(1372.85),
          publishedAt: '2026-11-03T10:00:00Z',
          live: tiers(1400),
          isStale: true,
          blockers: [],
        },
        {
          articleId: 603,
          saleSku: '603',
          active: true,
          fabricId: null,
          published: tiers(1364.17),
          publishedAt: '2026-11-03T10:00:00Z',
          live: tiers(1364.17),
          isStale: false,
          blockers: [],
        },
      ],
    },
  ],
  [
    2,
    {
      productId: 2,
      status: 'Blocked',
      from: null,
      pricesUpdatedAt: null,
      blockers: ['MissingOperations'],
      articles: [],
    },
  ],
  [
    3,
    {
      productId: 3,
      status: 'Ready',
      from: tiers(237),
      pricesUpdatedAt: '2026-11-03T10:00:00Z',
      blockers: [],
      articles: [],
    },
  ],
]);

vi.mock('../../hooks/product-overview/use-product-overview', () => ({
  useProductOverview: (type: ProductOverviewType) => ({
    rows: data[type],
    prices,
    fabricNames: new Map([[7, 'Тканина «Грета»']]),
    pricesError: null,
    pricesLoading: false,
    sections:
      type === 'Sewing'
        ? [{ id: 1, type, name: 'Одяг ЛІТО', isActive: true, comment: null, sortOrder: 1 }]
        : [],
    sectionNames: new Map([
      [1, 'Одяг ЛІТО'],
      [9, 'Захист рук'],
    ]),
    loading: false,
    error: null,
    reload: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderPage(url = '/references/products') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <ProductsPage />
    </MemoryRouter>,
  );
}

describe('ProductsPage', () => {
  it('reads the tab from the URL', () => {
    expect(productsTabOf('ppe')).toBe('Ppe');
    expect(productsTabOf(null)).toBe('Sewing');
  });

  it('shows sewing models with prices, section chips and filters by section', async () => {
    const user = userEvent.setup();
    renderPage();

    const grid = screen.getByRole('grid', { name: 'Швейна продукція' });
    expect(within(grid).getByText('MOD-025')).toBeInTheDocument();
    expect(within(grid).getByRole('columnheader', { name: '1–9 шт.' })).toBeInTheDocument();
    expect(within(grid).getAllByText('від').length).toBeGreaterThan(0);
    expect(within(grid).getByText('Не розраховано')).toBeInTheDocument();
    expect(
      within(grid).getByRole('link', { name: 'Відкрити «Костюм «Верде»» на сайті' }),
    ).toHaveAttribute('href', 'https://brevi.com.ua/specodyag-litnij/kostyum-verde');

    expect(screen.getByRole('link', { name: 'Додати модель' })).toHaveAttribute(
      'href',
      '/references/products/new/sewing',
    );

    await user.click(screen.getByRole('button', { name: /Без розділу/ }));
    expect(within(grid).queryByText('MOD-025')).not.toBeInTheDocument();
    expect(within(grid).getByText('Халат')).toBeInTheDocument();
  });

  it('expands a model into its articles and finds it by article', async () => {
    const user = userEvent.setup();
    renderPage();

    const grid = screen.getByRole('grid', { name: 'Швейна продукція' });
    await user.click(
      within(grid).getByRole('button', { name: 'Розгорнути артикули: Костюм «Верде»' }),
    );
    expect(within(grid).getByText('Тканина «Грета» · арт. 602')).toBeInTheDocument();
    expect(within(grid).getByText('Арт. 603')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Пошук товарів'), '603');
    expect(within(grid).queryByText('Халат')).not.toBeInTheDocument();
    expect(within(grid).getByText('MOD-025')).toBeInTheDocument();
  });

  it('filters models without a price', async () => {
    const user = userEvent.setup();
    renderPage();

    const grid = screen.getByRole('grid', { name: 'Швейна продукція' });
    await user.click(screen.getByRole('button', { name: 'Без ціни 1' }));
    expect(within(grid).queryByText('MOD-025')).not.toBeInTheDocument();
    expect(within(grid).getByText('Халат')).toBeInTheDocument();
  });

  it('has no manual recalculation: prices are published automatically', () => {
    renderPage();

    expect(screen.getByRole('grid', { name: 'Швейна продукція' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Перерахувати всі' })).not.toBeInTheDocument();
  });

  it('switches to the PPE table with live prices', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('tab', { name: 'ЗІЗ' }));

    const grid = screen.getByRole('grid', { name: 'ЗІЗ' });
    expect(within(grid).getByText('Рукавиці')).toBeInTheDocument();
    expect(within(grid).getByText('Захист рук')).toBeInTheDocument();
    expect(within(grid).getByText('237,00 ₴')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Перерахувати всі' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Додати ЗІЗ' })).toHaveAttribute(
      'href',
      '/references/products/new/ppe',
    );
    expect(screen.queryByRole('link', { name: 'Додати модель' })).not.toBeInTheDocument();
  });
});
