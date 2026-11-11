import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ContentProductsContent } from './content-products-content';

import type { ContentProductsViewer } from '@admin/content/model';

const fixture = vi.hoisted(() => ({
  queries: [] as Record<string, unknown>[],
  visibility: vi.fn(),
  save: vi.fn(),
  remove: vi.fn(),
}));

const complete = {
  productId: 1,
  type: 'Sewing',
  code: 'MOD-001',
  name: 'Костюм Лідер',
  sectionId: 10,
  sectionName: 'Костюми',
  isActive: true,
  mainPhotoUrl: 'https://cdn.test/1.jpg',
  hasPrice: true,
  hasPage: true,
  showOnSite: true,
  onSite: true,
  slug: 'kostyum-lider',
  hasUkrainianText: true,
  hasRussianText: true,
  hasSeo: true,
  updatedAtUtc: '2026-11-11T08:00:00Z',
};
const hidden = {
  ...complete,
  productId: 2,
  code: 'ZIZ-001',
  name: 'Каска будівельна',
  type: 'Ppe',
  hasPage: false,
  showOnSite: false,
  onSite: false,
  slug: null,
  mainPhotoUrl: null,
  hasSeo: false,
  updatedAtUtc: null,
};
const incomplete = {
  ...complete,
  productId: 3,
  code: 'MOD-003',
  name: 'Куртка Зима',
  slug: 'kurtka-zyma',
  hasRussianText: false,
  hasSeo: false,
};
const emptyText = {
  name: null,
  seoTitle: null,
  seoDescription: null,
  summary: [],
  description: [],
  specs: [],
};
const detail = {
  product: complete,
  revision: 4,
  slug: 'kostyum-lider',
  updatedBy: 'admin@brevi.test',
  uk: {
    ...emptyText,
    name: 'Костюм робочий «Лідер»',
    seoTitle: 'Купити костюм Лідер',
    summary: [{ label: 'Сезон', text: 'весна, літо' }],
    description: [{ kind: 'Paragraph', text: 'Зручний костюм.', lead: null, items: [] }],
    specs: [{ title: 'Куртка', rows: [{ name: 'Застібка', value: 'блискавка' }] }],
  },
  ru: emptyText,
  prices: { retail: 1500, wholesale: 1400, largeWholesale: 1300 },
  variants: [
    {
      articleId: 101,
      saleSku: 'MOD-001-A',
      isActive: true,
      fabricName: 'Грета',
      fabricDetails: 'бавовна 35%',
      prices: { retail: 1500, wholesale: 1400, largeWholesale: 1300 },
    },
  ],
};

vi.mock('@admin/content/data-access', () => ({
  useGetContentProductsQuery: (query: Record<string, unknown>) => {
    fixture.queries.push(query);
    return {
      currentData: {
        items: query['pageSize'] === 1 ? [] : [complete, hidden, incomplete],
        total: query['site'] === 'all' ? 3 : query['site'] === 'onSite' ? 2 : 1,
        page: 1,
        pageSize: query['pageSize'],
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    };
  },
  useGetContentProductQuery: () => ({ currentData: detail, isLoading: false, error: undefined }),
  useSetContentProductVisibilityMutation: () => [fixture.visibility, { isLoading: false }],
  useSaveContentProductMutation: () => [fixture.save, { isLoading: false }],
  useDeleteContentProductMutation: () => [fixture.remove, { isLoading: false }],
}));

const unwrapped = <T,>(value: T) => ({ unwrap: () => Promise.resolve(value) });

function renderPage(
  viewer: ContentProductsViewer = { canEdit: true, canDelete: true },
  url = '/content/products',
) {
  const router = createMemoryRouter(
    [{ path: '/content/products', element: <ContentProductsContent viewer={viewer} /> }],
    { initialEntries: [url] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

afterEach(() => {
  cleanup();
  fixture.queries.length = 0;
  vi.clearAllMocks();
});

describe('ContentProductsContent', () => {
  it('lists products and marks only what the site would miss', () => {
    renderPage();

    const table = screen.getByRole('table', { name: 'Товари сайту' });
    expect(within(table).getByText('Костюм Лідер')).toBeInTheDocument();
    expect(within(table).getByText('Немає опису російською · Немає SEO')).toBeInTheDocument();
    // A product that is not marked for the site has nothing to miss yet.
    const hiddenRow = within(table).getByText('Каска будівельна').closest('tr')!;
    expect(within(hiddenRow).queryByText(/Немає/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'На сайті 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Не на сайті 1' })).toBeInTheDocument();
  });

  it('keeps filters in the URL and sends them to the server', async () => {
    const router = renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'На сайті 2' }));
    await userEvent.click(screen.getByRole('button', { name: 'ЗІЗ' }));

    expect(router.state.location.search).toBe('?site=onSite&type=Ppe');
    expect(fixture.queries.at(-1)).toMatchObject({ site: 'offSite', type: 'Ppe', pageSize: 1 });
    expect(fixture.queries).toContainEqual(
      expect.objectContaining({ site: 'onSite', type: 'Ppe', pageSize: 50 }),
    );
  });

  it('switches «На сайті» from the list and warns about an inactive product', async () => {
    fixture.visibility.mockReturnValue(
      unwrapped({ productId: 2, showOnSite: true, onSite: false, revision: 1, slug: 'kaska' }),
    );
    renderPage();

    await userEvent.click(
      screen.getByRole('switch', { name: 'Показувати на сайті: Каска будівельна' }),
    );

    expect(fixture.visibility).toHaveBeenCalledWith({ productId: 2, showOnSite: true });
    expect(await screen.findByText(/товар вимкнено в «Товари»/)).toBeInTheDocument();
  });

  it('shows the switch and the panel read-only without the edit right', async () => {
    renderPage({ canEdit: false, canDelete: false });

    expect(
      screen.getByRole('switch', { name: 'Показувати на сайті: Костюм Лідер' }),
    ).toBeDisabled();
    await userEvent.click(screen.getByText('Костюм Лідер'));

    const panel = await screen.findByRole('dialog');
    expect(within(panel).getByText('Костюм робочий «Лідер»')).toBeInTheDocument();
    expect(within(panel).getByText(/Грета/)).toBeInTheDocument();
    expect(within(panel).queryByRole('button', { name: 'Редагувати' })).not.toBeInTheDocument();
    expect(
      within(panel).queryByRole('button', { name: 'Видалити сторінку' }),
    ).not.toBeInTheDocument();
  });

  it('edits the texts in the side panel and saves the page with its revision', async () => {
    fixture.save.mockReturnValue(unwrapped(detail));
    renderPage();

    await userEvent.click(screen.getByText('Костюм Лідер'));
    const panel = await screen.findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Редагувати' }));
    const specs = within(panel).getByLabelText('Характеристики');
    expect(specs).toHaveValue('## Куртка\nЗастібка: блискавка');
    await userEvent.type(specs, '\nКишені: дві');
    await userEvent.click(within(panel).getByRole('tab', { name: 'Російська' }));
    await userEvent.type(within(panel).getByLabelText('Назва на сайті'), 'Костюм «Лидер»');
    await userEvent.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(fixture.save).toHaveBeenCalledTimes(1));
    expect(fixture.save.mock.calls[0]![0]).toMatchObject({
      productId: 1,
      revision: 4,
      slug: 'kostyum-lider',
      showOnSite: true,
      uk: {
        specs: [
          {
            title: 'Куртка',
            rows: [
              { name: 'Застібка', value: 'блискавка' },
              { name: 'Кишені', value: 'дві' },
            ],
          },
        ],
      },
      ru: { name: 'Костюм «Лидер»' },
    });
    expect(
      await screen.findByText('Збережено: «Костюм Лідер» показується на сайті.'),
    ).toBeInTheDocument();
  });

  it('does not save an invalid address', async () => {
    renderPage();

    await userEvent.click(screen.getByText('Костюм Лідер'));
    const panel = await screen.findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Редагувати' }));
    const slug = within(panel).getByLabelText('Адреса сторінки');
    await userEvent.clear(slug);
    await userEvent.type(slug, 'Костюм');
    await userEvent.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    expect(
      within(panel).getByText('Малі латинські літери, цифри та дефіс, від 3 до 120 символів.'),
    ).toBeInTheDocument();
    expect(fixture.save).not.toHaveBeenCalled();
  });

  it('deletes the page only after a confirmation', async () => {
    fixture.remove.mockReturnValue(unwrapped(undefined));
    renderPage();

    await userEvent.click(screen.getByText('Костюм Лідер'));
    const panel = await screen.findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Видалити сторінку' }));
    expect(fixture.remove).not.toHaveBeenCalled();
    const confirm = await screen.findByRole('dialog', { name: 'Видалити сторінку сайту?' });
    await userEvent.click(within(confirm).getByRole('button', { name: 'Видалити' }));

    await waitFor(() => expect(fixture.remove).toHaveBeenCalledWith(1));
    expect(await screen.findByText('Сторінку товару «Костюм Лідер» видалено.')).toBeInTheDocument();
  });
});
