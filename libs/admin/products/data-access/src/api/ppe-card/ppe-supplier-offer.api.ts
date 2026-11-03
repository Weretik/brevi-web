import { adminApi } from '@admin/shared/api-client';

import { mapPpeSupplierOffer } from '../../mappers/ppe-card/ppe-supplier-offer.mapper';
import { ppePricingError } from '../ppe-pricing/ppe-pricing-errors';

import type { UpdatePpeSupplierOfferBody } from '../../contracts/ppe-card/ppe-supplier-offer.dto';
import type { PpeSupplierOffer } from '@admin/products/model';

/** PPE card supplier fields and live three prices (CAT-008). */
export const ppeSupplierOfferApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPpeSupplierOffer: build.query<PpeSupplierOffer, number>({
      query: (productId) => `/api/v1/products/${productId}/ppe-offer`,
      transformResponse: (value, _meta, productId) => mapPpeSupplierOffer(value, productId),
      transformErrorResponse: ppePricingError,
      providesTags: (_result, _error, productId) => [{ type: 'Product', id: productId }],
    }),
    updatePpeSupplierOffer: build.mutation<
      PpeSupplierOffer,
      { productId: number; body: UpdatePpeSupplierOfferBody }
    >({
      query: ({ productId, body }) => ({
        url: `/api/v1/products/${productId}/ppe-offer`,
        method: 'PUT',
        body,
      }),
      transformResponse: (value, _meta, { productId }) => mapPpeSupplierOffer(value, productId),
      transformErrorResponse: ppePricingError,
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
