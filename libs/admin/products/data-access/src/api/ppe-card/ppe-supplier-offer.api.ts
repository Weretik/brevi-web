import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { mapPpeSupplierOffer } from '../../mappers/ppe-card/ppe-supplier-offer.mapper';
import { ppePricingError } from '../ppe-pricing/ppe-pricing-errors';

import type { UpdatePpeSupplierOfferBody } from '../../contracts/ppe-card/ppe-supplier-offer.dto';
import type { PpeSupplierOffer } from '@admin/products/model';

/** PPE card supplier fields and live three prices (CAT-008). */
export const ppeSupplierOfferApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPpeSupplierOffer: build.query<PpeSupplierOffer, number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products/{productId}/ppe-offer', {
            params: { path: { productId } },
            signal,
          }),
          (value) => mapPpeSupplierOffer(value, productId),
          ppePricingError,
        ),
      providesTags: (_result, _error, productId) => [{ type: 'Product', id: productId }],
    }),
    updatePpeSupplierOffer: build.mutation<
      PpeSupplierOffer,
      { productId: number; body: UpdatePpeSupplierOfferBody }
    >({
      queryFn: ({ productId, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/v1/products/{productId}/ppe-offer', {
            params: { path: { productId } },
            body,
            signal,
          }),
          (value) => mapPpeSupplierOffer(value, productId),
          ppePricingError,
        ),
      invalidatesTags: (_result, error, { productId }) =>
        error
          ? []
          : [
              { type: 'Product', id: productId },
              { type: 'Product', id: 'LIST' },
            ],
    }),
  }),
});

export const { useGetPpeSupplierOfferQuery, useUpdatePpeSupplierOfferMutation } =
  ppeSupplierOfferApi;
