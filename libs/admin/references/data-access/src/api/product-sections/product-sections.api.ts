import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapProductSections } from '../../mappers/product-sections/product-sections.mapper';
import { parseProductSectionsResponse } from '../../validators/product-sections/product-sections-response';
import { referenceErrorMessages } from '../shared/reference-api.shared';

import type {
  CreateProductSectionBody,
  UpdateProductSectionBody,
} from '../../contracts/product-sections/product-sections-response';
import type { ProductSection } from '@admin/references/model';

const tag = 'ProductSection' as const;

export const productSectionsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductSections: build.query<ProductSection[], void>({
      query: () => '/api/reference/product-sections',
      transformResponse: (value: unknown) =>
        mapProductSections(parseProductSectionsResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    createProductSection: build.mutation<number, CreateProductSectionBody>({
      query: (body) => ({ url: '/api/reference/product-sections', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: tag, id: 'LIST' }]),
    }),
    updateProductSection: build.mutation<void, { id: number; body: UpdateProductSectionBody }>({
      query: ({ id, body }) => ({
        url: `/api/reference/product-sections/${id}`,
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
    deleteProductSection: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reference/product-sections/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateProductSectionMutation,
  useDeleteProductSectionMutation,
  useListProductSectionsQuery,
  useUpdateProductSectionMutation,
} = productSectionsApi;
