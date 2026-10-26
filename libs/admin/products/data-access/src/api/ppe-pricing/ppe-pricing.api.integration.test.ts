import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ppeOfferVersionsApi } from './offers.api';
import { ppeProductPricesApi } from './products.api';
import { ppePricingFixture } from '../../test-fixtures/ppe-pricing/ppe-pricing.fixture';

const store = createAdminApiStore();
afterEach(() => {
  store.dispatch(adminApi.util.resetApiState());
  vi.unstubAllGlobals();
});
describe('PPE pricing transport', () => {
  it('reads the Product set once and sends only explicit version input on approval', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi
      .fn()
      .mockImplementation(
        async (req: Request) =>
          new Response(
            JSON.stringify(req.method === 'POST' ? ppePricingFixture.offer : [ppePricingFixture]),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
      );
    vi.stubGlobal('fetch', fetcher);
    const query = store.dispatch(
      ppeProductPricesApi.endpoints.getPpeProductPrices.initiate([42, 43]),
    );
    const prices = await query.unwrap();
    expect(prices[0]?.prices?.largeWholesale).toBe(130);
    expect(
      new URL((fetcher.mock.calls[0]![0] as Request).url).searchParams.getAll('productIds'),
    ).toEqual(['42', '43']);
    query.unsubscribe();
    const body = {
      expectedVersionId: ppePricingFixture.offer.id,
      requestId: '33333333-3333-4333-8333-333333333333',
      values: ppePricingFixture.offer.values,
    };
    await store
      .dispatch(
        ppeOfferVersionsApi.endpoints.createPpeOfferVersion.initiate({ productId: 42, ...body }),
      )
      .unwrap();
    const request = fetcher.mock.calls.at(-1)![0] as Request;
    expect(await request.clone().json()).toEqual(body);
    expect(request.url).toContain('/42/offer/versions');
  });
  it('refreshes active card and list caches after an approved offer version', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    let updated = false;
    const offer = {
      ...ppePricingFixture.offer,
      id: '33333333-3333-4333-8333-333333333333',
      values: { ...ppePricingFixture.offer.values, supplierCost: 110 },
    };
    const fetcher = vi.fn().mockImplementation(async (request: Request) => {
      if (request.method === 'POST') {
        updated = true;
        return new Response(JSON.stringify(offer), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const row = updated
        ? {
            ...ppePricingFixture,
            offer,
            calculation: {
              isCalculated: true,
              blockers: [],
              prices: { retail: 165, wholesale: 149.6, largeWholesale: 143 },
            },
          }
        : ppePricingFixture;
      return new Response(JSON.stringify([row]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetcher);
    const card = store.dispatch(ppeProductPricesApi.endpoints.getPpeProductPrices.initiate([42]));
    const list = store.dispatch(
      ppeProductPricesApi.endpoints.getPpeProductPrices.initiate([42, 43]),
    );
    try {
      await Promise.all([card.unwrap(), list.unwrap()]);
      await store
        .dispatch(
          ppeOfferVersionsApi.endpoints.createPpeOfferVersion.initiate({
            productId: 42,
            expectedVersionId: ppePricingFixture.offer.id,
            requestId: '44444444-4444-4444-8444-444444444444',
            values: offer.values,
          }),
        )
        .unwrap();
      await vi.waitFor(() => {
        expect(
          ppeProductPricesApi.endpoints.getPpeProductPrices.select([42])(store.getState()).data?.[0]
            ?.prices?.wholesale,
        ).toBe(149.6);
        expect(
          ppeProductPricesApi.endpoints.getPpeProductPrices.select([42, 43])(store.getState())
            .data?.[0]?.prices?.wholesale,
        ).toBe(149.6);
      });
      expect(
        fetcher.mock.calls.filter(([request]) => (request as Request).method === 'GET'),
      ).toHaveLength(4);
    } finally {
      card.unsubscribe();
      list.unsubscribe();
    }
  });
});
