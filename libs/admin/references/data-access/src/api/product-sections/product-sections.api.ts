import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import { referenceErrorMessages } from '../../errors/reference-error-messages';
import { mapProductSections } from '../../mappers/product-sections/product-sections.mapper';
import { parseProductSectionsResponse } from '../../validators/product-sections/product-sections-response';

import type {
  CreateProductSectionBody,
  UpdateProductSectionBody,
} from '../../contracts/product-sections/product-sections-response';
import type { ProductSection } from '@admin/references/model';

const tag = 'ProductSection' as const;

export const productSectionsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductSections: build.query<ProductSection[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reference/product-sections', { signal }),
          (value: unknown) => mapProductSections(parseProductSectionsResponse(value)),
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    createProductSection: build.mutation<number, CreateProductSectionBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/reference/product-sections', { body: body, signal }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: tag, id: 'LIST' }]),
    }),
    updateProductSection: build.mutation<void, { id: number; body: UpdateProductSectionBody }>({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/reference/product-sections/{id}', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
    deleteProductSection: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/reference/product-sections/{id}', {
            params: { path: { id: id } },
            signal,
          }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
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
