import { existsSync } from 'node:fs';
import path from 'node:path';

import { LOCALES } from '@site/core/i18n';

import { ARTICLES, findArticle, formatArticleDate } from './articles';

const publicDir = path.join(import.meta.dirname, '../../../../../../apps/site/public');

describe('articles', () => {
  it('lists 26 articles with unique URL-safe slugs, newest first', () => {
    expect(ARTICLES).toHaveLength(26);
    expect(new Set(ARTICLES.map((article) => article.slug)).size).toBe(26);
    for (const article of ARTICLES) {
      expect(article.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    const dates = ARTICLES.map((article) => article.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('has a title, an excerpt of snippet length, and a body in both languages', () => {
    for (const article of ARTICLES) {
      for (const locale of LOCALES) {
        expect(article.title[locale].length).toBeGreaterThan(10);
        expect(article.title[locale].length).toBeLessThanOrEqual(70);
        expect(article.excerpt[locale].length).toBeGreaterThanOrEqual(110);
        expect(article.excerpt[locale].length).toBeLessThanOrEqual(165);
        expect(article.body[locale].some((block) => block.type === 'paragraph')).toBe(true);
      }
    }
  });

  it('points images to files that exist in the site public folder', () => {
    const images = ARTICLES.flatMap((article) =>
      LOCALES.flatMap((locale) => article.body[locale].filter((block) => block.type === 'image')),
    );

    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      expect(existsSync(path.join(publicDir, image.src))).toBe(true);
      expect(image.alt.length).toBeGreaterThan(0);
    }
  });

  it('finds an article by slug and formats its date', () => {
    expect(findArticle('navishcho-potriben-specodyag')?.title.uk).toBe('Навіщо потрібен спецодяг?');
    expect(findArticle('missing')).toBeUndefined();
    expect(formatArticleDate('2022-01-25')).toBe('25.01.2022');
  });
});
