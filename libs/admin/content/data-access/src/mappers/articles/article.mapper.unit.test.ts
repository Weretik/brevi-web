import { describe, expect, it } from 'vitest';

import { mapArticle, mapArticleList } from './article.mapper';

const row = {
  id: 4,
  slug: 'yak-obraty-spetsodyah',
  publishedOn: '2026-10-20',
  showOnSite: true,
  titleUk: 'Як обрати спецодяг',
  titleRu: null,
  hasUkrainianText: true,
  hasRussianText: false,
  hasSeo: false,
  coverUrl: 'https://cdn.test/1-small.webp',
  updatedAtUtc: '2026-11-11T08:00:00Z',
};

describe('article mapper', () => {
  it('reads the list', () => {
    expect(mapArticleList({ items: [row] })).toEqual([row]);
  });

  it('reads the editor with a picture block and the photos of the library', () => {
    const empty = { title: null, excerpt: null, seoTitle: null, seoDescription: null, body: [] };
    const article = mapArticle({
      article: row,
      revision: 3,
      updatedBy: 'admin@brevi.test',
      coverPhotoId: 1,
      uk: {
        ...empty,
        title: 'Як обрати спецодяг',
        body: [
          { kind: 'Paragraph', text: 'Шиємо самі.', lead: null, items: null },
          { kind: 'Image', text: null, lead: null, items: null, photoId: 2, alt: 'Цех' },
        ],
      },
      ru: empty,
      photos: [
        { id: 1, url: 'https://cdn.test/1.jpg', thumbnailUrl: null, width: 1200, height: 800 },
      ],
    });

    expect(article.uk.body).toEqual([
      { kind: 'Paragraph', text: 'Шиємо самі.', lead: null, items: [], photoId: null, alt: null },
      { kind: 'Image', text: null, lead: null, items: [], photoId: 2, alt: 'Цех' },
    ]);
    expect(article.photos).toHaveLength(1);
    expect(article.coverPhotoId).toBe(1);
  });

  it('refuses a date that is not a day', () => {
    expect(() => mapArticleList({ items: [{ ...row, publishedOn: '20.10.2026' }] })).toThrow();
  });
});
