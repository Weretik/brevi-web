import { ARTICLES_LIFE, FAILURE_LIFE } from './articles-cache';
import { getArticle, getArticleAddresses, getArticles } from './articles-source';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const card = {
  slug: 'a',
  publishedOn: '2021-07-29',
  language: 'ru',
  title: 'Статья',
  excerpt: null,
  cover: null,
  hasRussian: true,
  updatedAtUtc: '2026-11-11T08:00:00Z',
};

afterEach(() => vi.clearAllMocks());

describe('articles source', () => {
  it('reads the list in the page language and keeps it for five minutes', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: { items: [card] } });

    expect((await getArticles('ru')).map((item) => item.slug)).toEqual(['a']);
    expect(siteApiGet).toHaveBeenCalledWith('/api/public/articles', { language: 'ru' });
    expect(cacheTag).toHaveBeenCalledWith('articles');
    expect(cacheLife).toHaveBeenCalledWith(ARTICLES_LIFE);
  });

  it('gives an empty list for a minute when the API is unavailable or answers another shape', async () => {
    siteApiGet.mockResolvedValueOnce({ kind: 'unavailable', status: 502 });
    expect(await getArticles('uk')).toEqual([]);
    siteApiGet.mockResolvedValueOnce({ kind: 'ok', data: { items: [{ slug: 1 }] } });
    expect(await getArticleAddresses()).toEqual([]);
    expect(cacheLife).toHaveBeenCalledWith(FAILURE_LIFE);
    expect(siteApiGet).toHaveBeenLastCalledWith('/api/public/articles', { language: 'uk' });
  });

  it('reads an article by its address; unknown and unavailable are both «not found» for the page', async () => {
    siteApiGet.mockResolvedValueOnce({
      kind: 'ok',
      data: { ...card, seoTitle: null, seoDescription: null, body: [] },
    });
    expect((await getArticle('a b', 'ru'))?.title).toBe('Статья');
    expect(siteApiGet).toHaveBeenCalledWith('/api/public/articles/a%20b', { language: 'ru' });

    siteApiGet.mockResolvedValueOnce({ kind: 'not-found' });
    expect(await getArticle('missing', 'uk')).toBeNull();
    expect(cacheLife).toHaveBeenLastCalledWith(ARTICLES_LIFE);

    siteApiGet.mockResolvedValueOnce({ kind: 'unavailable' });
    expect(await getArticle('a', 'uk')).toBeNull();
    expect(cacheLife).toHaveBeenLastCalledWith(FAILURE_LIFE);
  });
});
