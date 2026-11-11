import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { ARTICLES_CACHE_TAG, ARTICLES_LIFE, FAILURE_LIFE } from './articles-cache';
import { mapArticle, mapArticleList } from './mappers/public-articles.mapper';

import type { Article, ArticleCard } from '@site/articles/model';
import type { Locale } from '@site/core/i18n';
import type { ApiResult, PublicGetPath, SiteApiQuery } from '@site/shared/api-client';

/** An answer of the right shape, or `null` when the API is unavailable or answered something else. */
async function read<T>(
  path: PublicGetPath,
  query: SiteApiQuery,
  map: (data: unknown) => T,
): Promise<{ kind: 'ok'; data: T } | { kind: 'not-found' } | null> {
  const result: ApiResult = await siteApiGet(path, query);
  if (result.kind === 'not-found') return result;
  if (result.kind !== 'ok') return null;
  try {
    return { kind: 'ok', data: map(result.data) };
  } catch {
    return null;
  }
}

/** Every article on the site in a language, newest first; `null` when the API is unavailable. */
export async function loadArticles(locale: Locale): Promise<ArticleCard[] | null> {
  'use cache';
  cacheTag(ARTICLES_CACHE_TAG);

  const result = await read('/api/public/articles', { language: locale }, mapArticleList);
  if (result?.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }
  cacheLife(ARTICLES_LIFE);
  return result.data;
}

/** An article page; `'not-found'` when the site does not show such an article, `null` when unavailable. */
export async function loadArticle(
  slug: string,
  locale: Locale,
): Promise<Article | 'not-found' | null> {
  'use cache';
  cacheTag(ARTICLES_CACHE_TAG);

  const result = await read(
    `/api/public/articles/${encodeURIComponent(slug)}`,
    { language: locale },
    mapArticle,
  );
  if (!result) {
    cacheLife(FAILURE_LIFE);
    return null;
  }
  cacheLife(ARTICLES_LIFE);
  return result.kind === 'ok' ? result.data : 'not-found';
}
