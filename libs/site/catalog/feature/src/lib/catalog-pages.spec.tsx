import {
  getCatalogCategoryProducts,
  getCatalogProductCategory,
  getCatalogRelatedProducts,
  getCatalogTree,
} from '@site/catalog/data-access';
import { CATALOG_TYPES } from '@site/catalog/model';
import { render, screen, within } from '@testing-library/react';

import { CatalogCategoryPage } from './catalog-category-page';
import { CatalogProductPage } from './catalog-product-page';
import { CatalogRootPage } from './catalog-root-page';

import type { CatalogProduct, CatalogProductCard, CatalogTreeNode } from '@site/catalog/model';

vi.mock('@site/catalog/data-access', () => ({
  getCatalogTree: vi.fn(),
  getCatalogCategoryProducts: vi.fn(),
  getCatalogProductCategory: vi.fn(),
  getCatalogRelatedProducts: vi.fn(),
}));

const child: CatalogTreeNode = {
  slug: 'kostyumy',
  name: { uk: 'Костюми', ru: 'Костюми' },
  productCount: 2,
  productType: 'Sewing',
  sectionId: 7,
  children: [],
};
const section: CatalogTreeNode = {
  ...CATALOG_TYPES.Sewing,
  productCount: 2,
  productType: 'Sewing',
  sectionId: null,
  children: [child],
};
const cards: CatalogProductCard[] = [
  { slug: 'kostyum-verde', name: 'Костюм ВЕРДЕ', image: null, priceFrom: 900 },
  { slug: 'kostyum-fort', name: 'Костюм ФОРТ', image: null, priceFrom: null },
];
const product: CatalogProduct = {
  slug: 'kostyum-verde',
  type: 'Sewing',
  sectionId: 7,
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
  vi.mocked(getCatalogCategoryProducts).mockResolvedValue(cards);
  vi.mocked(getCatalogProductCategory).mockResolvedValue({ node: child, trail: [section, child] });
  vi.mocked(getCatalogRelatedProducts).mockResolvedValue([cards[1]]);
});

describe('CatalogRootPage', () => {
  it('renders one h1 and a link to every product type and section', async () => {
    render(await CatalogRootPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const node of [section, child]) {
      expect(screen.getByRole('link', { name: node.name.uk }).getAttribute('href')).toBe(
        `/uk/catalog/${node.slug}`,
      );
    }
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
    render(
      await CatalogCategoryPage({ locale: 'uk', category: { node: section, trail: [section] } }),
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(section.name.uk);
    expect(screen.getByRole('link', { name: /^Костюми/ }).getAttribute('href')).toBe(
      '/uk/catalog/kostyumy',
    );
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(cards.length);
    expect(screen.getByText('900')).toBeTruthy();
    expect(getCatalogCategoryProducts).toHaveBeenCalledWith(section, 'uk');
  });

  it('leads the breadcrumbs through the product type in the page language', async () => {
    render(
      await CatalogCategoryPage({
        locale: 'ru',
        category: { node: child, trail: [section, child] },
      }),
    );

    const crumbs = screen.getByRole('navigation', { name: 'Хлебные крошки' });
    expect(crumbs.textContent).toContain(section.name.ru);
    expect(crumbs.querySelector('a[href="/ru/catalog/spetsodyah"]')).toBeTruthy();
    expect(crumbs.querySelector('a[href="/ru/catalog"]')).toBeTruthy();
  });

  it('says the models are coming when the category has none', async () => {
    vi.mocked(getCatalogCategoryProducts).mockResolvedValue([]);
    render(
      await CatalogCategoryPage({
        locale: 'uk',
        category: { node: child, trail: [section, child] },
      }),
    );

    expect(screen.getByText(/скоро з’являться/)).toBeTruthy();
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
