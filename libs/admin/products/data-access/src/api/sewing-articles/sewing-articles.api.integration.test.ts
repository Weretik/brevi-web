import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sewingArticlesApi } from './sewing-articles.api';

const store = createAdminApiStore();
afterEach(() => {
  store.dispatch(adminApi.util.resetApiState());
  vi.unstubAllGlobals();
});

describe('Sewing Article creation transport', () => {
  it('returns stale-write errors without retrying the save', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify(['Stale version.']), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    vi.stubGlobal('fetch', fetcher);
    await expect(
      store
        .dispatch(
          sewingArticlesApi.endpoints.createSewingArticle.initiate({
            productId: 101,
            draft: { saleSku: '246', active: true, sortOrder: 0, expectedVersion: 0 },
          }),
        )
        .unwrap(),
    ).rejects.toMatchObject({ status: 409 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
