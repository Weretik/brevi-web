import { mapArticle, mapArticleList } from './public-articles.mapper';

const cover = {
  url: 'https://cdn.example/5.jpg',
  thumbnailUrl: 'https://cdn.example/5-small.webp',
  width: 1200,
  height: 800,
};
const card = {
  slug: 'navishcho-potriben-specodyag',
  publishedOn: '2021-07-29',
  language: 'uk',
  title: 'Навіщо потрібен спецодяг?',
  excerpt: 'Процвітання підприємства.',
  cover,
  hasRussian: false,
  updatedAtUtc: '2026-11-11T08:00:00Z',
};

describe('public articles mapper', () => {
  it('maps the list with covers and the language of the texts', () => {
    expect(
      mapArticleList({ items: [card, { ...card, slug: 'b', cover: null, excerpt: null }] }),
    ).toEqual([
      {
        slug: 'navishcho-potriben-specodyag',
        date: '2021-07-29',
        textLocale: 'uk',
        title: 'Навіщо потрібен спецодяг?',
        excerpt: 'Процвітання підприємства.',
        cover: { src: cover.url, thumbnail: cover.thumbnailUrl, width: 1200, height: 800 },
        hasRussian: false,
        updatedAt: '2026-11-11T08:00:00Z',
      },
      expect.objectContaining({ slug: 'b', cover: null, excerpt: '' }),
    ]);
  });

  it('maps a page with SEO and blocks, leaving out empty blocks and pictures without a photo', () => {
    const article = mapArticle({
      ...card,
      seoTitle: 'Спецодяг: навіщо він потрібен',
      seoDescription: null,
      body: [
        { kind: 'Heading', text: 'Захист', lead: null, items: [], photo: null, alt: null },
        {
          kind: 'Paragraph',
          text: 'Шиємо **самі**.',
          lead: 'Важливо:',
          items: [],
          photo: null,
          alt: null,
        },
        { kind: 'Paragraph', text: null, lead: null, items: [], photo: null, alt: null },
        { kind: 'List', text: null, lead: null, items: ['щільність'], photo: null, alt: null },
        {
          kind: 'Image',
          text: null,
          lead: null,
          items: [],
          photo: { ...cover, width: null, height: null },
          alt: 'Каски',
        },
        { kind: 'Image', text: null, lead: null, items: [], photo: null, alt: 'Без фото' },
      ],
    });

    expect(article.seo).toEqual({ title: 'Спецодяг: навіщо він потрібен', description: '' });
    expect(article.body).toEqual([
      { type: 'heading', text: 'Захист' },
      { type: 'paragraph', text: 'Шиємо **самі**.', lead: 'Важливо:' },
      { type: 'list', items: ['щільність'] },
      {
        type: 'image',
        photo: { src: cover.url, thumbnail: cover.thumbnailUrl, width: null, height: null },
        alt: 'Каски',
      },
    ]);
  });

  it('refuses an answer of another shape', () => {
    expect(() => mapArticleList({ items: [{ ...card, language: 'en' }] })).toThrow();
    expect(() => mapArticleList({ items: [{ ...card, publishedOn: '29.07.2021' }] })).toThrow();
    expect(() => mapArticle({ ...card, body: [{ kind: 'Video' }] })).toThrow();
    expect(() => mapArticleList([])).toThrow();
  });
});
