import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sewingCalculationsApi } from './calculations.api';
import { publishedSewingProductsApi } from './products.api';
import { sewingPublicationsApi } from './publications.api';
import { sewingCalculationFixture } from '../../test-fixtures/sewing-pricing/sewing-calculation.fixture';

const store = createAdminApiStore();
afterEach(() => {
  store.dispatch(adminApi.util.resetApiState());
  vi.unstubAllGlobals();
});
const response = (value: unknown) =>
  new Response(JSON.stringify(value), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

describe('Sewing pricing transport', () => {
  it('sends only the request UUID when calculating and the saved UUID when publishing', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi.fn().mockImplementation(async (request: Request) =>
      request.url.endsWith('/publication')
        ? response({
            id: '33333333-3333-4333-8333-333333333333',
            calculationId: sewingCalculationFixture.id,
            productId: 42,
            articleId: 501,
            publishedAt: '2026-10-25T11:00:00Z',
            publishedBy: 'manager',
            prices: sewingCalculationFixture.snapshot.calculation.prices,
          })
        : response(sewingCalculationFixture),
    );
    vi.stubGlobal('fetch', fetcher);
    const saved = await store
      .dispatch(
        sewingCalculationsApi.endpoints.saveSewingCalculation.initiate({
          productId: 42,
          articleId: 501,
          requestId: sewingCalculationFixture.requestId,
        }),
      )
      .unwrap();
    const request = fetcher.mock.calls[0]?.[0] as Request;
    expect(await request.clone().json()).toEqual({ requestId: sewingCalculationFixture.requestId });
    expect(saved.fullCost).toBe(200);
    const published = await store
      .dispatch(
        sewingPublicationsApi.endpoints.publishSewingCalculation.initiate({
          productId: 42,
          articleId: 501,
          calculationId: saved.id,
        }),
      )
      .unwrap();
    expect(published.calculationId).toBe(saved.id);
    expect((fetcher.mock.calls.at(-1)?.[0] as Request).url).toContain(
      `/calculations/${saved.id}/publication`,
    );
  });
  it('loads the whole Product set in one bounded request', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi
      .fn()
      .mockResolvedValue(response([{ productId: 42, articleCount: 2, articles: [] }]));
    vi.stubGlobal('fetch', fetcher);
    await store
      .dispatch(publishedSewingProductsApi.endpoints.getPublishedSewingProducts.initiate([42, 43]))
      .unwrap();
    expect(fetcher).toHaveBeenCalledTimes(1);
    const url = new URL((fetcher.mock.calls[0]?.[0] as Request).url);
    expect(url.searchParams.getAll('productIds')).toEqual(['42', '43']);
  });
});
