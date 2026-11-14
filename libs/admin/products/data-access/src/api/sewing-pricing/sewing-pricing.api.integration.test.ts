import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sewingCalculationsApi } from './calculations.api';
import { publishedSewingProductsApi } from './products.api';
import { sewingPublicationsApi } from './publications.api';
import { sewingCalculationFixture } from '../../testing/sewing-pricing/sewing-calculation.fixture';

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
  it('loads the published price and the calculation behind it', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi.fn().mockImplementation(async (request: Request) =>
      request.url.endsWith('/published')
        ? response({
            id: '33333333-3333-4333-8333-333333333333',
            calculationId: sewingCalculationFixture.id,
            productId: 42,
            articleId: 501,
            publishedAt: '2026-10-25T11:00:00Z',
            publishedBy: 'auto',
            prices: sewingCalculationFixture.snapshot.calculation.prices,
          })
        : response(sewingCalculationFixture),
    );
    vi.stubGlobal('fetch', fetcher);
    const published = await store
      .dispatch(
        sewingPublicationsApi.endpoints.getPublishedSewingPrice.initiate({
          productId: 42,
          articleId: 501,
        }),
      )
      .unwrap();
    const calculation = await store
      .dispatch(
        sewingCalculationsApi.endpoints.getSewingCalculation.initiate({
          productId: 42,
          articleId: 501,
          calculationId: published.calculationId,
        }),
      )
      .unwrap();
    expect(calculation.fullCost).toBe(200);
    expect((fetcher.mock.calls.at(-1)?.[0] as Request).url).toContain(
      `/calculations/${published.calculationId}`,
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
