import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapProductOverview } from '../../mappers/product-overview/product-overview.mapper';
import { parseProductOverviewResponse } from '../../validators/product-overview/validate-product-overview';
import { productErrorMessages } from '../product-api.shared';

import type { UpdateProductOverviewBody } from '../../contracts/product-overview/product-overview.dto';
import type { ProductOverview, ProductOverviewType } from '@admin/products/model';

const tag = 'Product' as const;

export const productOverviewApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductOverview: build.query<ProductOverview[], ProductOverviewType>({
      query: (type) => `/api/v1/products/overview?type=${type}`,
      transformResponse: (value: unknown) =>
        mapProductOverview(parseProductOverviewResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, productErrorMessages),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    updateProductOverview: build.mutation<void, { id: number; body: UpdateProductOverviewBody }>({
      query: ({ id, body }) => ({ url: `/api/v1/products/${id}/overview`, method: 'PUT', body }),
      transformErrorResponse: (error) => toAdminApiError(error, productErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
  }),
});

export const { useListProductOverviewQuery, useUpdateProductOverviewMutation } = productOverviewApi;
