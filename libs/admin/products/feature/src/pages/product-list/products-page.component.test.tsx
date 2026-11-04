import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductsPage, productsTabOf } from './products-page';
import { render } from '../../test-utils';

import type {
  ProductOverview,
  ProductOverviewListQuery,
  ProductOverviewType,
  ProductVariant,
} from '@admin/products/model';

const tiers = (retail: number) => ({
  retail,
  wholesale: retail - 100,
  largeWholesale: retail - 150,
});

const variant = (articleId: number, fabricName: string | null, retail: number): ProductVariant => ({
  articleId,
  saleSku: String(articleId),
  active: true,
  fabricId: fabricName ? 7 : null,
  fabricName,
  prices: tiers(retail),
  publishedAt: '2026-11-03T10:00:00Z',
  problems: [],
});

const row = (
  id: number,
  type: ProductOverviewType,
  code: string,
  name: string,
  sectionId: number | null,
  extra: Partial<ProductOverview>,
): ProductOverview => ({
  id,
  type,
  code,
  name,
  sectionId,
  season: type === 'Sewing' ? 'Літо' : null,
  isActive: true,
  currentSiteUrl: id === 1 ? 'https://brevi.com.ua/specodyag-litnij/kostyum-verde' : null,
  quoteDescription: 'Костюм із курткою та штанами.',
  updatedAtUtc: '2026-11-03T10:00:00Z',
  prices: null,
  pricesUpdatedAt: null,
  problems: [],
  variants: [],
  ...extra,
});

const data: Record<ProductOverviewType, ProductOverview[]> = {
  Sewing: [
    row(1, 'Sewing', 'MOD-025', 'Костюм «Верде»', 1, {
      prices: tiers(1364.17),
      pricesUpdatedAt: '2026-11-03T10:00:00Z',
      variants: [variant(602, 'Тканина «Грета»', 1372.85), variant(603, null, 1364.17)],
    }),
    row(2, 'Sewing', 'MOD-026', 'Халат', null, { problems: ['MissingOperations'] }),
  ],
  Ppe: [
    row(3, 'Ppe', '17', 'Рукавиці', 9, {
      prices: tiers(237),
      pricesUpdatedAt: '2026-11-03T10:00:00Z',
    }),
  ],
};

const queries: ProductOverviewListQuery[] = [];

/** A tiny stand-in for the server: filters like `GET /api/v1/products/overview` (CAT-013). */
function serverPage(query: ProductOverviewListQuery) {
  queries.push(query);
  const all = data[query.type];
  const search = query.search.toLocaleLowerCase('uk');
  const items = all.filter(
    (item) =>
      (query.section === null ||
        (query.section === 'none' ? item.sectionId === null : item.sectionId === query.section)) &&
      (!query.withoutPrice || item.prices === null) &&
      (!search ||
        [item.code, item.name, ...item.variants.map((v) => v.saleSku)].some((value) =>
          value?.toLocaleLowerCase('uk').includes(search),
        )),
  );
  const sections = [...new Set(all.map((item) => item.sectionId))].map((sectionId) => ({
    sectionId,
    count: all.filter((item) => item.sectionId === sectionId).length,
  }));
  return {
    items,
    page: query.page,
    pageSize: query.pageSize,
    total: items.length,
    all: all.length,
    sections,
    withoutPrice: all.filter((item) => item.prices === null).length,
  };
}

vi.mock('@admin/products/data-access', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/products/data-access')>()),
  useListProductOverviewQuery: (query: ProductOverviewListQuery) => ({
    data: serverPage(query),
    error: undefined,
    isFetching: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@admin/references/data-access', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/references/data-access')>()),
  useListProductSectionsQuery: () => ({
    data: [
      { id: 1, type: 'Sewing', name: 'Одяг ЛІТО', isActive: true, comment: null, sortOrder: 1 },
      { id: 9, type: 'Ppe', name: 'Захист рук', isActive: true, comment: null, sortOrder: 2 },
    ],
    error: undefined,
    isLoading: false,
    refetch: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
  queries.length = 0;
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

  it('shows sewing models with prices and the reason instead of a missing price', async () => {
    const user = userEvent.setup();
    renderPage();

    const grid = screen.getByRole('grid', { name: 'Швейна продукція' });
    expect(within(grid).getByText('MOD-025')).toBeInTheDocument();
    expect(within(grid).getByRole('columnheader', { name: '1–9 шт.' })).toBeInTheDocument();
    expect(within(grid).getAllByText('від').length).toBeGreaterThan(0);
    expect(within(grid).getByText('Немає трудовитрат')).toBeInTheDocument();
    expect(within(grid).queryByText(/Готово|Актуальна/)).not.toBeInTheDocument();
    expect(
      within(grid).getByRole('link', { name: 'Відкрити «Костюм «Верде»» на сайті' }),
    ).toHaveAttribute('href', 'https://brevi.com.ua/specodyag-litnij/kostyum-verde');
    expect(screen.getByRole('link', { name: 'Додати модель' })).toHaveAttribute(
      'href',
      '/references/products/new/sewing',
    );

    await user.click(screen.getByRole('button', { name: /Без розділу/ }));
    expect(queries.at(-1)).toMatchObject({ section: 'none', page: 1 });
    expect(within(grid).queryByText('MOD-025')).not.toBeInTheDocument();
    expect(within(grid).getByText('Халат')).toBeInTheDocument();
  });

  it('opens the full card straight from the row', () => {
    renderPage();

    const grid = screen.getByRole('grid', { name: 'Швейна продукція' });
    expect(
      within(grid).getByRole('link', { name: 'Відкрити повну картку: Костюм «Верде»' }),
    ).toHaveAttribute('href', '/references/products/1');
  });

  it('expands a model into its fabrics and asks the server to search', async () => {
    const user = userEvent.setup();
    renderPage();

    const grid = screen.getByRole('grid', { name: 'Швейна продукція' });
    await user.click(
      within(grid).getByRole('button', { name: 'Розгорнути тканини: Костюм «Верде»' }),
    );
    expect(within(grid).getByText('Тканина «Грета» · арт. 602')).toBeInTheDocument();
    expect(within(grid).getByText('Арт. 603')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Пошук товарів'), '603');
    expect(await within(grid).findByText('MOD-025')).toBeInTheDocument();
    await vi.waitFor(() => expect(within(grid).queryByText('Халат')).not.toBeInTheDocument());
    expect(queries.at(-1)).toMatchObject({ search: '603', type: 'Sewing' });
  });

  it('filters models without a price', async () => {
    const user = userEvent.setup();
    renderPage();

    const grid = screen.getByRole('grid', { name: 'Швейна продукція' });
    await user.click(screen.getByRole('button', { name: 'Без ціни 1' }));
    expect(queries.at(-1)).toMatchObject({ withoutPrice: true });
    expect(within(grid).queryByText('MOD-025')).not.toBeInTheDocument();
    expect(within(grid).getByText('Халат')).toBeInTheDocument();
  });

  it('switches to the PPE table with its prices', async () => {
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
  });
});
