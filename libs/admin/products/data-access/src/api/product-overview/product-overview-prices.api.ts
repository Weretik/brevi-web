import { adminApi } from '@admin/shared/api-client';

import {
  mapProductOverviewPrices,
  mapSewingRecalculationReport,
} from '../../mappers/product-overview/product-overview-prices.mapper';
import {
  parseProductOverviewPrices,
  parseSewingRecalculationReport,
} from '../../validators/product-overview/validate-product-overview-prices';
import { sewingPricingError } from '../sewing-pricing/pricing-errors';

import type { RecalculateSewingPricesBody } from '../../contracts/product-overview/product-overview-prices.dto';
import type {
  ProductOverviewPrices,
  ProductOverviewType,
  SewingRecalculationReport,
} from '@admin/products/model';

const tag = 'Product' as const;
const pricesTag = { type: tag, id: 'PRICES' };

/** Prices of the «Товари» list and «Перерахувати всі» (CAT-011). */
export const productOverviewPricesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductOverviewPrices: build.query<ProductOverviewPrices[], ProductOverviewType>({
      query: (type) => `/api/v1/products/overview/prices?type=${type}`,
      transformResponse: (value: unknown) =>
        mapProductOverviewPrices(parseProductOverviewPrices(value)),
      transformErrorResponse: sewingPricingError,
      providesTags: [pricesTag, { type: tag, id: 'LIST' }],
    }),
    recalculateSewingPrices: build.mutation<SewingRecalculationReport, RecalculateSewingPricesBody>(
      {
        query: (body) => ({ url: '/api/v1/pricing/sewing/recalculation', method: 'POST', body }),
        transformResponse: (value: unknown) =>
          mapSewingRecalculationReport(parseSewingRecalculationReport(value)),
        transformErrorResponse: sewingPricingError,
        invalidatesTags: (result) =>
          result?.applied
            ? [
                pricesTag,
                ...[...new Set(result.changes.map((change) => change.productId))].map((id) => ({
                  type: tag,
                  id,
                })),
              ]
            : [],
      },
    ),
  }),
});

export const { useListProductOverviewPricesQuery, useRecalculateSewingPricesMutation } =
  productOverviewPricesApi;
