import {
  getCatalogCategoryProducts,
  getCatalogProductAddresses,
  getCatalogProductCategory,
  getCatalogProducts,
  getCatalogRelatedProducts,
  getCatalogTree,
} from '@site/catalog/data-access';
import { render, screen, within } from '@testing-library/react';

import { CatalogCategoryPage } from './catalog-category-page';
import { CatalogProductPage } from './catalog-product-page';
import { CatalogRootPage } from './catalog-root-page';
import { CatalogSearchPage } from './catalog-search-page';

import type {
  CatalogCategoryPage as CatalogCategoryPageData,
  CatalogProduct,
  CatalogProductCard,
  CatalogTreeNode,
} from '@site/catalog/model';

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

vi.mock('@site/catalog/data-access', () => ({
  getCatalogProducts: vi.fn(),
  getCatalogTree: vi.fn(),
  getCatalogProductAddresses: vi.fn(),
  getCatalogCategoryProducts: vi.fn(),
  getCatalogProductCategory: vi.fn(),
  getCatalogRelatedProducts: vi.fn(),
}));

const child: CatalogTreeNode = {
  slug: 'kostyumy',
  name: { uk: 'Костюми', ru: 'Костюмы' },
  productCount: 2,
  children: [],
};
const section: CatalogTreeNode = {
  slug: 'spetsodyah',
  name: { uk: 'Спецодяг', ru: 'Спецодежда' },
  productCount: 2,
  children: [child],
};
const page = (
  node: CatalogTreeNode,
  trail: CatalogTreeNode[],
  locale: 'uk' | 'ru' = 'uk',
  changes: Partial<CatalogCategoryPageData> = {},
): CatalogCategoryPageData => ({
  node,
  trail,
  name: node.name[locale],
  textLocale: locale,
  seo: { title: '', description: '' },
  text: [],
  ...changes,
});
const cards: CatalogProductCard[] = [
  {
    slug: 'kostyum-verde',
    type: 'Sewing',
    code: 'MOD-014',
    name: 'Костюм ВЕРДЕ',
    image: null,
    priceFrom: 900,
    fabrics: ['Грета', 'Саржа'],
  },
  {
    slug: 'kostyum-fort',
    type: 'Sewing',
    code: null,
    name: 'Костюм ФОРТ',
    image: null,
    priceFrom: null,
    fabrics: [],
  },
];
const product: CatalogProduct = {
  slug: 'kostyum-verde',
  type: 'Sewing',
  categories: [
    { slug: 'kostyumy', name: 'Костюми', parent: { slug: 'spetsodyah', name: 'Спецодяг' } },
  ],
  model: 'MOD-014',
  name: 'Костюм ВЕРДЕ',
  textLocale: 'uk',
  seo: { title: '', description: '' },
  photos: [],
  summary: [{ type: 'paragraph', lead: 'Сезон:', text: 'літо' }],
  description: [{ type: 'paragraph', text: 'Костюм для роботи влітку.' }],
  specs: [{ title: 'Куртка', rows: [{ name: 'Застібка', value: 'блискавка' }] }],
  priceFrom: 900,
  prices: null,
  fabrics: [
    {
      sku: 'MOD-014-1',
      name: 'Грета',
      details: null,
      prices: { retail: 1100, wholesale: 1000, largeWholesale: 900 },
    },
  ],
};

beforeEach(() => {
  vi.mocked(getCatalogTree).mockResolvedValue([section]);
  vi.mocked(getCatalogProductAddresses).mockResolvedValue([
    { slug: 'kostyum-verde', updatedAt: '2026-11-11T10:00:00Z', hasRussian: true },
    { slug: 'kostyum-fort', updatedAt: '2026-11-11T10:00:00Z', hasRussian: true },
  ]);
  vi.mocked(getCatalogCategoryProducts).mockResolvedValue(cards);
  vi.mocked(getCatalogProducts).mockResolvedValue(cards);
  vi.mocked(getCatalogProductCategory).mockResolvedValue({ node: child, trail: [section, child] });
  vi.mocked(getCatalogRelatedProducts).mockResolvedValue([cards[1]]);
});

describe('CatalogRootPage', () => {
  it('renders one h1, a link to every category and subcategory, and counts each model once', async () => {
    render(await CatalogRootPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const node of [section, child]) {
      expect(screen.getByRole('link', { name: node.name.uk }).getAttribute('href')).toBe(
        `/uk/catalog/${node.slug}`,
      );
    }
    expect(screen.getByText('2 моделі')).toBeTruthy();
    // A category of own sewing goes to its group with its lowest price.
    const own = within(screen.getByRole('region', { name: 'Власне пошиття' }));
    expect(own.getByText('2 моделі · від 900 грн')).toBeTruthy();
    expect(screen.getByRole('search', { name: 'Пошук по каталогу' }).getAttribute('action')).toBe(
      '/uk/search',
    );
  });

  it('keeps the heading and the call to order while the catalog is empty', async () => {
    vi.mocked(getCatalogTree).mockResolvedValue([]);
    render(await CatalogRootPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.queryByRole('region', { name: 'Власне пошиття' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Залишити заявку' })).toBeTruthy();
  });
});

describe('CatalogCategoryPage', () => {
  it('renders the category name as the only h1, its sections, and every product with its price', async () => {
    render(await CatalogCategoryPage({ locale: 'uk', category: page(section, [section]) }));

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(section.name.uk);
    expect(screen.getByRole('link', { name: /^Костюми/ }).getAttribute('href')).toBe(
      '/uk/catalog/kostyumy',
    );
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(cards.length);
    expect(screen.getByText('900')).toBeTruthy();
    expect(getCatalogCategoryProducts).toHaveBeenCalledWith('spetsodyah', 'uk');
    // Without a text about the category there is no empty block for it.
    expect(screen.queryByRole('heading', { level: 2, name: 'Про розділ' })).toBeNull();
  });

  it('shows the neighbours of a subcategory as tabs with the open one marked', async () => {
    render(await CatalogCategoryPage({ locale: 'uk', category: page(child, [section, child]) }));

    const tabs = within(screen.getByRole('navigation', { name: 'Підрозділи' }));
    expect(tabs.getByRole('link', { name: /^Усі/ }).getAttribute('href')).toBe(
      '/uk/catalog/spetsodyah',
    );
    expect(tabs.getByRole('link', { name: /^Костюми/ }).getAttribute('aria-current')).toBe('page');
  });

  it('leads the breadcrumbs through the top-level category in the page language', async () => {
    render(
      await CatalogCategoryPage({ locale: 'ru', category: page(child, [section, child], 'ru') }),
    );

    const crumbs = screen.getByRole('navigation', { name: 'Хлебные крошки' });
    expect(crumbs.textContent).toContain(section.name.ru);
    expect(crumbs.querySelector('a[href="/ru/catalog/spetsodyah"]')).toBeTruthy();
    expect(crumbs.querySelector('a[href="/ru/catalog"]')).toBeTruthy();
  });

  it('says the models are coming when the category has none', async () => {
    vi.mocked(getCatalogCategoryProducts).mockResolvedValue([]);
    render(await CatalogCategoryPage({ locale: 'uk', category: page(child, [section, child]) }));

    expect(screen.getByText(/скоро з’являться/)).toBeTruthy();
  });

  it('shows the text staff wrote about the category under the products', async () => {
    render(
      await CatalogCategoryPage({
        locale: 'uk',
        category: page(child, [section, child], 'uk', {
          text: [
            { type: 'heading', text: 'Робочі костюми оптом' },
            { type: 'paragraph', text: 'Шиємо **самі** у Полтаві.' },
          ],
        }),
      }),
    );

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2, name: 'Про розділ' })).toBeTruthy();
    expect(screen.getByText('самі').tagName).toBe('STRONG');
  });
});

describe('CatalogSearchPage', () => {
  it('finds models by a word of the name and by the model number', async () => {
    render(await CatalogSearchPage({ locale: 'uk', query: 'верде' }));

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Пошук по каталогу');
    expect(screen.getByRole('link', { name: 'Костюм ВЕРДЕ' }).getAttribute('href')).toBe(
      '/uk/product/kostyum-verde',
    );
    expect(screen.queryByRole('link', { name: 'Костюм ФОРТ' })).toBeNull();
    expect(screen.getByRole('combobox')).toHaveProperty('value', 'верде');
  });

  it('links the categories whose name matches', async () => {
    render(await CatalogSearchPage({ locale: 'ru', query: 'костюмы' }));

    expect(screen.getByRole('link', { name: /Спецодежда · Костюмы/ }).getAttribute('href')).toBe(
      '/ru/catalog/kostyumy',
    );
  });

  it('says nothing was found and keeps the call to order', async () => {
    render(await CatalogSearchPage({ locale: 'uk', query: 'парасолька' }));

    expect(screen.getByText(/нічого не знайшли/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Залишити заявку' })).toBeTruthy();
  });
});

describe('CatalogProductPage', () => {
  it('renders the product name as the only h1 with the prices and the way to order', async () => {
    render(await CatalogProductPage({ locale: 'uk', product }));

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Костюм ВЕРДЕ');
    const prices = within(screen.getByRole('table', { name: 'Ціна за одиницю, грн' }));
    expect(prices.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: 'Залишити заявку' })[0].getAttribute('href')).toBe(
      '/uk/request',
    );
    expect(screen.getByRole('table', { name: 'Куртка' })).toBeTruthy();
    // The short facts open the characteristics; the price strip for phones links to the request.
    const facts = within(screen.getByRole('table', { name: 'Коротко про модель' }));
    expect(facts.getByRole('cell', { name: 'літо' })).toBeTruthy();
    const bar = within(screen.getByRole('complementary', { name: 'Ціна моделі' }));
    expect(bar.getByText('від 900 грн')).toBeTruthy();
    expect(bar.getByRole('link', { name: 'Заявка' }).getAttribute('href')).toBe('/uk/request');
    const nav = within(screen.getByRole('navigation', { name: 'Розділи сторінки' }));
    expect(nav.getByRole('link', { name: 'Характеристики' }).getAttribute('href')).toBe(
      '#product-specs',
    );
  });

  it('leads the breadcrumbs through the product category and marks up the product', async () => {
    const { container } = render(await CatalogProductPage({ locale: 'ru', product }));

    const crumbs = screen.getByRole('navigation', { name: 'Хлебные крошки' });
    expect(crumbs.querySelector('a[href="/ru/catalog/kostyumy"]')).toBeTruthy();
    expect(crumbs.textContent).toContain('Костюм ВЕРДЕ');
    const data = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (script) => JSON.parse(script.textContent ?? '{}'),
    );
    expect(data.map((item) => item['@type'])).toEqual(['Product', 'BreadcrumbList']);
    expect(data[0].offers).toMatchObject({ lowPrice: 900, priceCurrency: 'UAH' });
    expect(getCatalogRelatedProducts).toHaveBeenCalledWith(product, 'ru', 4);
  });
});
