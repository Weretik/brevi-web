import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { ppePricingError } from './ppe-pricing-errors';
import { mapPpeOffer } from '../../mappers/ppe-pricing/ppe-offer.mapper';

import type { PpeOfferValues, PpeOfferVersion } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type Body = operations['createPpeOfferVersion']['requestBody']['content']['application/json'];
export const ppeOfferVersionsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    createPpeOfferVersion: build.mutation<
      PpeOfferVersion,
      {
        productId: number;
        expectedVersionId: string | null;
        requestId: string;
        values: PpeOfferValues;
      }
    >({
      queryFn: ({ productId, ...body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/v1/pricing/ppe/products/{productId}/offer/versions', {
            params: { path: { productId } },
            body: body satisfies Body,
            signal,
          }),
          (value) => mapPpeOffer(value, productId),
          ppePricingError,
        ),
      invalidatesTags: (_result, error, args) =>
        error
          ? []
          : [
              { type: 'Product', id: args.productId },
              { type: 'Product', id: 'LIST' },
            ],
    }),
  }),
});
export const { useCreatePpeOfferVersionMutation } = ppeOfferVersionsApi;
