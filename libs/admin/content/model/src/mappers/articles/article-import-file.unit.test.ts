import { describe, expect, it } from 'vitest';

import {
  articleImportBatches,
  readArticleImportFile,
  sumArticleImportReports,
} from './article-import-file';

import type { ArticleImportReport } from '../../entities/articles/article-import';

const article = (slug: string) => ({ slug, publishedOn: '2021-07-28', uk: { title: slug } });

const report = (over: Partial<ArticleImportReport>): ArticleImportReport => ({
  dryRun: false,
  total: 0,
  created: 0,
  updated: 0,
  kept: 0,
  photos: 0,
  notMatched: [],
  problems: [],
  ...over,
});

describe('readArticleImportFile', () => {
  it('takes the articles from the file body or from a bare list', () => {
    const items = [article('a')];

    expect(readArticleImportFile(JSON.stringify({ items }))).toEqual({ ok: true, items });
    expect(readArticleImportFile(JSON.stringify(items))).toEqual({ ok: true, items });
  });

  it('refuses a file that is not an article transfer file', () => {
    expect(readArticleImportFile('<html>')).toMatchObject({ ok: false });
    expect(readArticleImportFile('{"items":[]}')).toMatchObject({ ok: false });
    expect(readArticleImportFile('[{"slug":"rozdil"}]')).toMatchObject({
      ok: false,
      message: expect.stringContaining('не статей'),
    });
    expect(
      readArticleImportFile(JSON.stringify(Array.from({ length: 201 }, () => article('a')))),
    ).toMatchObject({ ok: false, message: expect.stringContaining('201') });
  });
});

describe('article transfer in parts', () => {
  it('splits the file into parts of three and keeps the order', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(article);

    expect(articleImportBatches(items).map((part) => part.map((item) => item['slug']))).toEqual([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g'],
    ]);
  });

  it('adds the reports of the parts up', () => {
    const problem = { url: 'https://brevi.com.ua/image/a.jpg', name: 'Стаття', reason: 'Немає' };

    expect(
      sumArticleImportReports([
        report({ total: 3, created: 2, kept: 1, photos: 4 }),
        report({ total: 1, updated: 1, photos: 1, problems: [problem] }),
      ]),
    ).toEqual(
      report({ total: 4, created: 2, updated: 1, kept: 1, photos: 5, problems: [problem] }),
    );
  });
});
