import { formatArticleDate, pickMoreArticles } from './articles';

import type { ArticleCard } from './article';

const card = (slug: string): ArticleCard => ({
  slug,
  date: '2021-07-29',
  textLocale: 'uk',
  title: slug,
  excerpt: '',
  cover: null,
  hasRussian: true,
  updatedAt: '2026-11-11T08:00:00Z',
});

describe('articles', () => {
  it('formats the date the way both languages write it', () => {
    expect(formatArticleDate('2022-01-25')).toBe('25.01.2022');
  });

  it('offers the articles after this one, wrapping around, without the article itself', () => {
    const list = ['a', 'b', 'c', 'd', 'e'].map(card);

    expect(pickMoreArticles(list, 'b').map((item) => item.slug)).toEqual(['c', 'd', 'e']);
    expect(pickMoreArticles(list, 'e').map((item) => item.slug)).toEqual(['a', 'b', 'c']);
    expect(pickMoreArticles(list.slice(0, 2), 'a').map((item) => item.slug)).toEqual(['b']);
    expect(pickMoreArticles(list, 'missing').map((item) => item.slug)).toEqual(['a', 'b', 'c']);
  });
});
