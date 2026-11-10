import { getCatalogCategory, getCatalogProduct } from '@site/catalog/data-access';
import { CATALOG_TREE } from '@site/catalog/model';
import { render, screen } from '@testing-library/react';

import { CatalogCategoryPage } from './catalog-category-page';
import { CatalogProductPage } from './catalog-product-page';
import { CatalogRootPage } from './catalog-root-page';

const section = CATALOG_TREE.find((node) => node.children.length > 0) ?? CATALOG_TREE[0];
const child = section.children[0];

const renderCategory = async (locale: 'uk' | 'ru', slug: string) => {
  const category = await getCatalogCategory(slug);
  if (!category) throw new Error(`no category ${slug}`);
  render(await CatalogCategoryPage({ locale, category }));
  return category;
};

describe('CatalogRootPage', () => {
  it('renders one h1 and a link to every section', () => {
    render(<CatalogRootPage locale="uk" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const node of CATALOG_TREE) {
      expect(screen.getAllByRole('link', { name: node.name.uk })[0].getAttribute('href')).toBe(
        `/uk/catalog/${node.slug}`,
      );
    }
  });
});

describe('CatalogCategoryPage', () => {
  it('renders the category name as the only h1, its subsections, and every model', async () => {
    const category = await renderCategory('uk', section.slug);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(section.name.uk);
    expect(
      screen.getByRole('link', { name: new RegExp(`^${child.name.uk}`) }).getAttribute('href'),
    ).toBe(`/uk/catalog/${child.slug}`);
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(
      category.productSlugs.length,
    );
  });

  it('leads the breadcrumbs through the parent category in the page language', async () => {
    await renderCategory('ru', child.slug);

    const crumbs = screen.getByRole('navigation', { name: 'Хлебные крошки' });
    expect(crumbs.textContent).toContain(section.name.ru);
    expect(crumbs.querySelector(`a[href="/ru/catalog/${section.slug}"]`)).toBeTruthy();
    expect(crumbs.querySelector('a[href="/ru/catalog"]')).toBeTruthy();
  });
});

describe('CatalogProductPage', () => {
  const renderProduct = async (locale: 'uk' | 'ru') => {
    const category = await getCatalogCategory(child.slug);
    const product = await getCatalogProduct(category?.productSlugs[0] ?? '');
    if (!product) throw new Error('no product');
    const { container } = render(await CatalogProductPage({ locale, product }));
    return { product, container };
  };

  it('renders the product name as the only h1 with the way to get a price and no price', async () => {
    const { product } = await renderProduct('uk');

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(product.name.uk);
    expect(screen.getByRole('link', { name: 'Дізнатися ціну' }).getAttribute('href')).toBe(
      '/uk/request',
    );
    expect(screen.queryByText(/\d\s*грн/)).toBeNull();
  });

  it('leads the breadcrumbs through the product category and marks up the product', async () => {
    const { product, container } = await renderProduct('ru');

    const crumbs = screen.getByRole('navigation', { name: 'Хлебные крошки' });
    expect(crumbs.querySelector(`a[href="/ru/catalog/${product.categorySlug}"]`)).toBeTruthy();
    expect(crumbs.textContent).toContain(product.name.ru);
    const types = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (script) => JSON.parse(script.textContent ?? '{}')['@type'],
    );
    expect(types).toEqual(['Product', 'BreadcrumbList']);
  });
});
