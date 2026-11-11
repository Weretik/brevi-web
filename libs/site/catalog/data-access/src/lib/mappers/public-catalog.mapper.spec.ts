import {
  mapCatalogAddresses,
  mapCatalogCardPage,
  mapCatalogProduct,
  mapCatalogTree,
} from './public-catalog.mapper';

const product = {
  slug: 'kostyum-verde',
  type: 'Sewing',
  code: 'MOD-014',
  name: 'Костюм ВЕРДЕ',
  language: 'uk',
  section: { id: 7, slug: 'kostyumy', name: 'Костюми' },
  seoTitle: 'Костюм ВЕРДЕ оптом',
  seoDescription: null,
  summary: [
    { label: 'Сезон', text: 'літо' },
    { label: null, text: 'Власне пошиття' },
  ],
  description: [
    { kind: 'Heading', text: 'Опис', lead: null, items: [] },
    { kind: 'Paragraph', text: 'саржа', lead: 'Тканина:', items: [] },
    { kind: 'List', text: null, lead: null, items: ['кишені', 'світловідбивач'] },
    { kind: 'Paragraph', text: '', lead: null, items: [] },
  ],
  specs: [
    { title: 'Куртка', rows: [{ name: 'Застібка', value: 'блискавка' }] },
    { title: 'Порожня', rows: [] },
  ],
  photos: [{ url: 'https://media.example/1.webp', thumbnailUrl: null, isMain: true }],
  priceFrom: 900,
  prices: null,
  variants: [
    {
      sku: 'MOD-014-1',
      fabricName: 'Грета',
      fabricDetails: 'бавовна 35 %',
      prices: { retail: 1100, wholesale: 1000, largeWholesale: 900 },
    },
    { sku: 'MOD-014-2', fabricName: null, fabricDetails: null, prices: null },
  ],
  updatedAtUtc: '2026-11-11T10:00:00Z',
};

describe('public catalog mapper', () => {
  it('builds the tree from the product types and their sections', () => {
    const tree = mapCatalogTree({
      types: [
        {
          type: 'Sewing',
          productCount: 3,
          sections: [
            { id: 7, slug: 'kostyumy', name: 'Костюми', productCount: 2 },
            // A section named like a product type keeps its own address.
            { id: 9, slug: 'spetsodyah', name: 'Спецодяг', productCount: 1 },
          ],
        },
        { type: 'Ppe', productCount: 1, sections: [] },
      ],
    });

    expect(tree.map((node) => [node.slug, node.productType, node.sectionId])).toEqual([
      ['spetsodyah', 'Sewing', null],
      ['zasoby-zakhystu', 'Ppe', null],
    ]);
    expect(tree[0].name.ru).toBe('Спецодежда собственного пошива');
    expect(tree[0].children.map((node) => [node.slug, node.sectionId, node.name.ru])).toEqual([
      ['kostyumy', 7, 'Костюми'],
      ['spetsodyah-9', 9, 'Спецодяг'],
    ]);
  });

  it('maps a page of cards with the photo and the lowest price', () => {
    expect(
      mapCatalogCardPage({
        items: [
          { slug: 'a', name: 'А', photoUrl: 'https://media.example/a.webp', priceFrom: 10.5 },
          { slug: 'b', name: 'Б', photoUrl: null, priceFrom: null },
        ],
        page: 1,
        pageSize: 100,
        total: 2,
      }),
    ).toEqual({
      items: [
        { slug: 'a', name: 'А', image: 'https://media.example/a.webp', priceFrom: 10.5 },
        { slug: 'b', name: 'Б', image: null, priceFrom: null },
      ],
      total: 2,
    });
  });

  it('maps a product page: facts, text blocks, characteristics, photos, and fabrics', () => {
    const mapped = mapCatalogProduct(product);

    expect(mapped).toMatchObject({
      slug: 'kostyum-verde',
      type: 'Sewing',
      sectionId: 7,
      model: 'MOD-014',
      textLocale: 'uk',
      seo: { title: 'Костюм ВЕРДЕ оптом', description: '' },
      photos: [{ src: 'https://media.example/1.webp' }],
      priceFrom: 900,
      prices: null,
    });
    expect(mapped.summary).toEqual([
      { type: 'paragraph', text: 'літо', lead: 'Сезон:' },
      { type: 'paragraph', text: 'Власне пошиття' },
    ]);
    expect(mapped.description).toEqual([
      { type: 'heading', text: 'Опис' },
      { type: 'paragraph', text: 'саржа', lead: 'Тканина:' },
      { type: 'list', items: ['кишені', 'світловідбивач'] },
    ]);
    expect(mapped.specs).toEqual([
      { title: 'Куртка', rows: [{ name: 'Застібка', value: 'блискавка' }] },
    ]);
    expect(mapped.fabrics).toEqual([
      {
        sku: 'MOD-014-1',
        name: 'Грета',
        details: 'бавовна 35 %',
        prices: { retail: 1100, wholesale: 1000, largeWholesale: 900 },
      },
      { sku: 'MOD-014-2', name: 'MOD-014-2', details: null, prices: null },
    ]);
  });

  it('refuses an answer of another shape instead of showing half of a product', () => {
    expect(() => mapCatalogProduct({ ...product, name: null })).toThrow(/unexpected name/);
    expect(() => mapCatalogProduct({ ...product, type: 'Other' })).toThrow();
    expect(() => mapCatalogTree({ types: 'none' })).toThrow();
    expect(() => mapCatalogCardPage({ items: [{ slug: 'a' }], total: 1 })).toThrow();
  });

  it('maps product addresses for the sitemap', () => {
    expect(
      mapCatalogAddresses([
        { slug: 'a', updatedAtUtc: '2026-11-11T10:00:00Z', hasRussian: true },
        { slug: 'b', updatedAtUtc: '2026-11-10T10:00:00Z', hasRussian: false },
      ]),
    ).toEqual([
      { slug: 'a', updatedAt: '2026-11-11T10:00:00Z', hasRussian: true },
      { slug: 'b', updatedAt: '2026-11-10T10:00:00Z', hasRussian: false },
    ]);
  });
});
