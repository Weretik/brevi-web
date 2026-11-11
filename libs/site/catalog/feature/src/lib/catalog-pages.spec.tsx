import {
  getCatalogCategoryProducts,
  getCatalogProductAddresses,
  getCatalogProductCategory,
  getCatalogRelatedProducts,
  getCatalogTree,
} from '@site/catalog/data-access';
import { render, screen, within } from '@testing-library/react';

import { CatalogCategoryPage } from './catalog-category-page';
import { CatalogProductPage } from './catalog-product-page';
import { CatalogRootPage } from './catalog-root-page';

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

vi.mock('@site/catalog/data-access', () => ({
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
  { slug: 'kostyum-verde', name: 'Костюм ВЕРДЕ', image: null, priceFrom: 900 },
  { slug: 'kostyum-fort', name: 'Костюм ФОРТ', image: null, priceFrom: null },
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
    expect(screen.getByText('Каталог · 2 моделі')).toBeTruthy();
  });

  it('keeps the heading and the call to order while the catalog is empty', async () => {
    vi.mocked(getCatalogTree).mockResolvedValue([]);
    render(await CatalogRootPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.queryByRole('list', { name: 'Розділи каталогу' })).toBeNull();
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
