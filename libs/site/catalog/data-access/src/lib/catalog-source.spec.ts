import { CATALOG_LIFE, FAILURE_LIFE } from './catalog-cache';
import {
  getCatalogCategory,
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
  types: [
    {
      type: 'Sewing',
      productCount: 3,
      sections: [{ id: 7, slug: 'kostyumy', name: 'Костюми', productCount: 3 }],
    },
  ],
};
const card = (slug: string) => ({ slug, name: slug, photoUrl: null, priceFrom: 100 });
const product = {
  slug: 'b',
  type: 'Sewing',
  code: 'MOD-002',
  name: 'Костюм',
  language: 'uk',
  section: { id: 7, slug: 'kostyumy', name: 'Костюми' },
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

  it('reads the tree and finds a section with the way to it', async () => {
    answer({ '/api/public/catalog/tree': tree });

    expect(await getCatalogCategorySlugs()).toEqual(['spetsodyah', 'kostyumy']);
    const category = await getCatalogCategory('kostyumy');
    expect(category?.node.sectionId).toBe(7);
    expect(category?.trail.map((node) => node.slug)).toEqual(['spetsodyah', 'kostyumy']);
    expect(await getCatalogCategory('no-such-category')).toBeNull();
    expect(cacheTag).toHaveBeenCalledWith('catalog');
    expect(cacheLife).toHaveBeenLastCalledWith(CATALOG_LIFE);
  });

  it('shows an empty catalog while the API is unavailable and asks again in a minute', async () => {
    answer({});

    expect(await getCatalogTree()).toEqual([]);
    expect(await getCatalogProductAddresses()).toEqual([]);
    expect(await getCatalogCategoryProducts({ productType: 'Ppe', sectionId: null }, 'uk')).toEqual(
      [],
    );
    expect(await getCatalogProduct('b', 'uk')).toBeNull();
    expect(cacheLife).toHaveBeenCalledTimes(4);
    for (const [life] of cacheLife.mock.calls) expect(life).toEqual(FAILURE_LIFE);
  });

  it('treats an answer of another shape as unavailable', async () => {
    answer({ '/api/public/catalog/tree': { types: [{ type: 'Other' }] } });

    expect(await getCatalogTree()).toEqual([]);
    expect(cacheLife).toHaveBeenLastCalledWith(FAILURE_LIFE);
  });

  it('reads every page of a listing in the language of the page', async () => {
    const first = Array.from({ length: 100 }, (_, index) => card(`p${index}`));
    siteApiGet.mockImplementation(async (_path: string, query: { page: number }) => ({
      kind: 'ok',
      data: { items: query.page === 1 ? first : [card('last')], total: 101 },
    }));

    const cards = await getCatalogCategoryProducts({ productType: 'Sewing', sectionId: 7 }, 'ru');

    expect(cards).toHaveLength(101);
    expect(cards.at(-1)?.slug).toBe('last');
    expect(siteApiGet).toHaveBeenCalledTimes(2);
    expect(siteApiGet).toHaveBeenLastCalledWith('/api/public/catalog/products', {
      language: 'ru',
      type: 'Sewing',
      sectionId: 7,
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
      '/api/public/catalog/tree': tree,
      '/api/public/catalog/products': { items: ['a', 'b', 'c'].map(card), total: 3 },
    });
    const current = { slug: 'b', type: 'Sewing', sectionId: 7 } as const;

    const category = await getCatalogProductCategory(current);
    expect(category?.trail.map((node) => node.slug)).toEqual(['spetsodyah', 'kostyumy']);
    // A product without a section on the site belongs to its product type.
    expect((await getCatalogProductCategory({ type: 'Sewing', sectionId: null }))?.node.slug).toBe(
      'spetsodyah',
    );
    expect(await getCatalogProductCategory({ type: 'Ppe', sectionId: null })).toBeNull();

    const related = await getCatalogRelatedProducts(current, 'uk', 4);
    expect(related.map((item) => item.slug)).toEqual(['c', 'a']);
  });
});
