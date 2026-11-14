import { CATALOG_LIFE, FAILURE_LIFE } from './catalog-cache';
import {
  getCatalogCategory,
  getCatalogCategoryAddresses,
  getCatalogCategoryProducts,
  getCatalogCategorySlugs,
  getCatalogProduct,
  getCatalogProductAddresses,
  getCatalogProductCategory,
  getCatalogRelatedProducts,
  getCatalogTree,
} from './catalog-source';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const tree = {
  categories: [
    {
      slug: 'spetsodyah',
      nameUk: 'Спецодяг',
      nameRu: 'Спецодежда',
      productCount: 3,
      children: [
        { slug: 'kostyumy', nameUk: 'Костюми', nameRu: 'Костюмы', productCount: 3, children: [] },
      ],
    },
  ],
};
const page = {
  slug: 'kostyumy',
  name: 'Костюмы',
  language: 'ru',
  parent: { slug: 'spetsodyah', name: 'Спецодежда' },
  children: [],
  seoTitle: 'Купить костюмы',
  seoDescription: null,
  text: [{ kind: 'Paragraph', text: 'Шьём сами.', lead: null, items: [] }],
  productCount: 3,
  updatedAtUtc: '2026-11-11T10:00:00Z',
};
const card = (slug: string) => ({
  slug,
  type: 'Sewing',
  code: null,
  name: slug,
  photoUrl: null,
  priceFrom: 100,
});
const product = {
  slug: 'b',
  type: 'Sewing',
  code: 'MOD-002',
  name: 'Костюм',
  language: 'uk',
  section: null,
  categories: [
    { slug: 'spetsodyah', name: 'Спецодяг', parent: null },
    { slug: 'kostyumy', name: 'Костюми', parent: { slug: 'spetsodyah', name: 'Спецодяг' } },
  ],
  seoTitle: null,
  seoDescription: null,
  summary: [],
  description: [],
  specs: [],
  photos: [],
  priceFrom: null,
  prices: null,
  variants: [],
  updatedAtUtc: '2026-11-11T10:00:00Z',
};

/** Answers of the API by path; a path without an answer is unavailable. */
const answer = (answers: Record<string, unknown>) =>
  siteApiGet.mockImplementation(async (path: string) =>
    path in answers ? { kind: 'ok', data: answers[path] } : { kind: 'unavailable' },
  );

describe('catalog source', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reads the tree and a category page with the way to it and what staff wrote', async () => {
    answer({
      '/api/public/catalog/categories': tree,
      '/api/public/catalog/categories/kostyumy': page,
    });

    expect(await getCatalogCategorySlugs()).toEqual(['spetsodyah', 'kostyumy']);
    const category = await getCatalogCategory('kostyumy', 'ru');
    expect(category?.trail.map((node) => node.slug)).toEqual(['spetsodyah', 'kostyumy']);
    expect(category).toMatchObject({
      name: 'Костюмы',
      textLocale: 'ru',
      seo: { title: 'Купить костюмы', description: '' },
      text: [{ type: 'paragraph', text: 'Шьём сами.' }],
    });
    expect(siteApiGet).toHaveBeenLastCalledWith('/api/public/catalog/categories/kostyumy', {
      language: 'ru',
    });
    expect(await getCatalogCategory('no-such-category', 'uk')).toBeNull();
    expect(cacheTag).toHaveBeenCalledWith('catalog');
  });

  it('opens a category with the name from the tree while its texts are unavailable', async () => {
    answer({ '/api/public/catalog/categories': tree });

    expect(await getCatalogCategory('kostyumy', 'ru')).toMatchObject({
      name: 'Костюмы',
      textLocale: 'ru',
      seo: { title: '', description: '' },
      text: [],
    });
  });

  it('shows an empty catalog while the API is unavailable and asks again in a minute', async () => {
    answer({});

    expect(await getCatalogTree()).toEqual([]);
    expect(await getCatalogProductAddresses()).toEqual([]);
    expect(await getCatalogCategoryAddresses()).toEqual([]);
    expect(await getCatalogCategoryProducts('zasoby-zakhystu', 'uk')).toEqual([]);
    expect(await getCatalogProduct('b', 'uk')).toBeNull();
    expect(cacheLife).toHaveBeenCalledTimes(5);
    for (const [life] of cacheLife.mock.calls) expect(life).toEqual(FAILURE_LIFE);
  });

  it('reads the addresses of categories for the sitemap', async () => {
    answer({
      '/api/public/catalog/category-slugs': [
        { slug: 'kostyumy', updatedAtUtc: '2026-11-11T10:00:00Z', hasRussian: false },
      ],
    });

    expect(await getCatalogCategoryAddresses()).toEqual([
      { slug: 'kostyumy', updatedAt: '2026-11-11T10:00:00Z', hasRussian: false },
    ]);
  });

  it('treats an answer of another shape as unavailable', async () => {
    answer({ '/api/public/catalog/categories': { categories: [{ slug: 'a' }] } });

    expect(await getCatalogTree()).toEqual([]);
    expect(cacheLife).toHaveBeenLastCalledWith(FAILURE_LIFE);
  });

  it('reads every page of a listing in the language of the page', async () => {
    const first = Array.from({ length: 100 }, (_, index) => card(`p${index}`));
    siteApiGet.mockImplementation(async (_path: string, query: { page: number }) => ({
      kind: 'ok',
      data: { items: query.page === 1 ? first : [card('last')], total: 101 },
    }));

    const cards = await getCatalogCategoryProducts('kostyumy', 'ru');

    expect(cards).toHaveLength(101);
    expect(cards.at(-1)?.slug).toBe('last');
    expect(siteApiGet).toHaveBeenCalledTimes(2);
    expect(siteApiGet).toHaveBeenLastCalledWith('/api/public/catalog/products', {
      language: 'ru',
      category: 'kostyumy',
      page: 2,
      pageSize: 100,
    });
  });

  it('returns a product, and nothing for a product the site does not show', async () => {
    answer({ '/api/public/catalog/products/b': product });
    expect((await getCatalogProduct('b', 'ru'))?.name).toBe('Костюм');
    expect(siteApiGet).toHaveBeenLastCalledWith('/api/public/catalog/products/b', {
      language: 'ru',
    });

    siteApiGet.mockResolvedValue({ kind: 'not-found' });
    expect(await getCatalogProduct('hidden', 'uk')).toBeNull();
    // «Not shown» is a real answer, so it is kept as long as a product.
    expect(cacheLife).toHaveBeenLastCalledWith(CATALOG_LIFE);
  });

  it('finds the category of a product and its neighbours in listing order', async () => {
    answer({
      '/api/public/catalog/categories': tree,
      '/api/public/catalog/products': { items: ['a', 'b', 'c'].map(card), total: 3 },
    });
    const top = { slug: 'spetsodyah', name: 'Спецодяг', parent: null };
    const sub = {
      slug: 'kostyumy',
      name: 'Костюми',
      parent: { slug: 'spetsodyah', name: 'Спецодяг' },
    };
    const current = { slug: 'b', categories: [top, sub] };

    // The breadcrumbs lead through the subcategory, not through the category above it.
    const category = await getCatalogProductCategory(current);
    expect(category?.trail.map((node) => node.slug)).toEqual(['spetsodyah', 'kostyumy']);
    expect((await getCatalogProductCategory({ categories: [top] }))?.node.slug).toBe('spetsodyah');
    expect(await getCatalogProductCategory({ categories: [] })).toBeNull();
    // A category the tree no longer shows gives no breadcrumbs instead of a broken link.
    expect(
      await getCatalogProductCategory({
        categories: [{ slug: 'hidden', name: 'x', parent: null }],
      }),
    ).toBeNull();

    const related = await getCatalogRelatedProducts(current, 'uk', 4);
    expect(related.map((item) => item.slug)).toEqual(['c', 'a']);
    expect(siteApiGet).toHaveBeenLastCalledWith(
      '/api/public/catalog/products',
      expect.objectContaining({ category: 'kostyumy' }),
    );
    expect(await getCatalogRelatedProducts({ slug: 'b', categories: [] }, 'uk', 4)).toEqual([]);
  });
});
