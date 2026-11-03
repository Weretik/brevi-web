import { adminApi } from '@admin/shared/api-client';

import { mapProductOverviewPrices } from '../../mappers/product-overview/product-overview-prices.mapper';
import { parseProductOverviewPrices } from '../../validators/product-overview/validate-product-overview-prices';
import { sewingPricingError } from '../sewing-pricing/pricing-errors';

import type { ProductOverviewPrices, ProductOverviewType } from '@admin/products/model';

const tag = 'Product' as const;
const pricesTag = { type: tag, id: 'PRICES' };

/** Prices of the «Товари» list (CAT-011); Sewing prices are published automatically by the backend (CAT-012). */
export const productOverviewPricesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductOverviewPrices: build.query<ProductOverviewPrices[], ProductOverviewType>({
      query: (type) => `/api/v1/products/overview/prices?type=${type}`,
      transformResponse: (value: unknown) =>
        mapProductOverviewPrices(parseProductOverviewPrices(value)),
      transformErrorResponse: sewingPricingError,
      providesTags: [pricesTag, { type: tag, id: 'LIST' }],
    }),
  }),
});

export const { useListProductOverviewPricesQuery } = productOverviewPricesApi;
