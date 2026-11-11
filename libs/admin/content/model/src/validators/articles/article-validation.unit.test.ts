import { describe, expect, it } from 'vitest';

import { articleLimits, hasArticleErrors, validateArticle } from './article-validation';
import { articleInputOf, newArticleForm } from '../../forms/articles/article-form';
import { articleProblems, filterArticles } from '../../mappers/articles/article-list';

import type { ArticleRow } from '../../entities/articles/article';

const form = () => {
  const values = newArticleForm('2026-11-11');
  return { ...values, uk: { ...values.uk, title: 'Як обрати спецодяг' } };
};

const row = (changes: Partial<ArticleRow> = {}): ArticleRow => ({
  id: 1,
  slug: 'yak-obraty',
  publishedOn: '2026-11-11',
  showOnSite: true,
  titleUk: 'Як обрати спецодяг',
  titleRu: 'Как выбрать спецодежду',
  hasUkrainianText: true,
  hasRussianText: true,
  hasSeo: true,
  coverUrl: 'https://cdn.test/1.webp',
  updatedAtUtc: '2026-11-11T08:00:00Z',
  ...changes,
});

describe('article validation', () => {
  it('lets a new article leave the address empty and needs the Ukrainian title', () => {
    expect(hasArticleErrors(validateArticle(form(), true))).toBe(false);
    expect(validateArticle(form(), false).slug).toBeDefined();
    expect(validateArticle(newArticleForm('2026-11-11'), true).uk?.title).toBe(
      'Вкажіть назву українською.',
    );
  });

  it('checks the date, the lengths and the alt text of photos', () => {
    const values = form();
    const errors = validateArticle(
      {
        ...values,
        publishedOn: '1990-01-01',
        uk: { ...values.uk, excerpt: 'а'.repeat(articleLimits.excerpt + 1) },
        ru: {
          ...values.ru,
          body: {
            type: 'doc',
            content: [
              {
                type: 'photo',
                attrs: { photoId: 2, src: null, alt: 'а'.repeat(articleLimits.alt + 1) },
              },
            ],
          },
        },
      },
      true,
    );

    expect(errors.publishedOn).toBe('Вкажіть дату статті.');
    expect(errors.uk?.excerpt).toBeDefined();
    expect(errors.ru?.body).toContain('Опис фото');
  });

  it('builds the save body with the cover and empty values as null', () => {
    const input = articleInputOf(null, { ...form(), cover: { id: 5, url: null }, slug: '  ' });

    expect(input).toMatchObject({ id: null, revision: 0, slug: null, coverPhotoId: 5 });
    expect(input.ru).toEqual({
      title: null,
      excerpt: null,
      seoTitle: null,
      seoDescription: null,
      body: [],
    });
  });
});

describe('article list', () => {
  it('marks only problems of an article shown on the site', () => {
    expect(articleProblems(row())).toEqual([]);
    expect(articleProblems(row({ showOnSite: false, coverUrl: null, hasSeo: false }))).toEqual([]);
    expect(
      articleProblems(row({ coverUrl: null, titleRu: null, hasRussianText: false, hasSeo: false })),
    ).toEqual(['Немає обкладинки', 'Немає назви російською', 'Немає SEO']);
    expect(articleProblems(row({ hasRussianText: false }))).toEqual(['Немає тексту російською']);
  });

  it('finds articles by title or address', () => {
    const rows = [row(), row({ id: 2, titleUk: 'Зимовий одяг', titleRu: null, slug: 'zyma' })];
    expect(filterArticles(rows, 'зим').map((item) => item.id)).toEqual([2]);
    expect(filterArticles(rows, 'YAK').map((item) => item.id)).toEqual([1]);
    expect(filterArticles(rows, ' ')).toHaveLength(2);
  });
});
