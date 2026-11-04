import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sewingArticlesApi } from './sewing-articles.api';

import type { SewingVariantInput } from '@admin/products/model';

const store = createAdminApiStore();
afterEach(() => {
  store.dispatch(adminApi.util.resetApiState());
  vi.unstubAllGlobals();
});

const input: SewingVariantInput = {
  saleSku: '246',
  active: true,
  sortOrder: 0,
  fabricId: 59,
  fabricQuantity: 3.6,
  expectedVersion: 4,
};
const variant = {
  id: 246,
  productId: 101,
  saleSku: '246',
  active: true,
  sortOrder: 0,
  fabricId: 59,
  fabricQuantity: 3.6,
};

function respond(status: number, body: unknown) {
  const fetcher = vi.fn().mockImplementation(() =>
    Promise.resolve(
      status === 204
        ? new Response(null, { status })
        : new Response(JSON.stringify(body), {
            status,
            headers: { 'Content-Type': 'application/json' },
          }),
    ),
  );
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

describe('Fabric variant transport', () => {
  it('creates a variant with its fabric and metres in one request', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = respond(201, variant);
    const saved = await store
      .dispatch(sewingArticlesApi.endpoints.createSewingArticle.initiate({ productId: 101, input }))
      .unwrap();
    const request = fetcher.mock.calls[0]?.[0] as Request;
    expect(request.url).toMatch(/\/api\/v1\/products\/101\/articles$/);
    expect(await request.clone().json()).toEqual(input);
    expect(saved.fabricId).toBe(59);
    expect(saved.fabricQuantity).toBe(3.6);
  });

  it('changes a variant without sending its sort order', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = respond(200, variant);
    await store
      .dispatch(
        sewingArticlesApi.endpoints.updateSewingArticle.initiate({
          productId: 101,
          articleId: 246,
          input,
        }),
      )
      .unwrap();
    const request = fetcher.mock.calls[0]?.[0] as Request;
    expect(request.method).toBe('PUT');
    expect(request.url).toMatch(/\/api\/v1\/products\/101\/articles\/246$/);
    expect(await request.clone().json()).not.toHaveProperty('sortOrder');
  });

  it('deletes a variant with the composition version', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = respond(204, null);
    await store
      .dispatch(
        sewingArticlesApi.endpoints.deleteSewingArticle.initiate({
          productId: 101,
          articleId: 246,
          expectedVersion: 4,
        }),
      )
      .unwrap();
    const request = fetcher.mock.calls[0]?.[0] as Request;
    expect(request.method).toBe('DELETE');
    expect(request.url).toMatch(/\/api\/v1\/products\/101\/articles\/246\?expectedVersion=4$/);
  });

  it('returns stale-write errors without retrying the save', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = respond(409, ['Stale version.']);
    await expect(
      store
        .dispatch(
          sewingArticlesApi.endpoints.createSewingArticle.initiate({ productId: 101, input }),
        )
        .unwrap(),
    ).rejects.toMatchObject({ status: 409 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
