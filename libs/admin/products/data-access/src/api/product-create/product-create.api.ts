import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import {
  mapCreatedCatalogProduct,
  mapPpePricePreview,
  mapProductCodeCheck,
  toCreateCatalogProductBody,
} from '../../mappers/product-create/product-create.mapper';

import type {
  CatalogProductType,
  CreateCatalogProductInput,
  CreatedCatalogProduct,
  PpePricePreview,
  ProductCodeCheck,
} from '@admin/products/model';

const createError = (response: Parameters<typeof toAdminApiError>[0]) =>
  toAdminApiError(response, {
    unauthorized: 'Немає права створювати товари.',
    conflict: 'Такий код або назва вже є в іншого товару.',
    fallback: 'Не вдалося створити товар. Спробуйте ще раз.',
  });

/** Pages «Новий ЗІЗ» and «Нова модель» (CAT-009): create, code check, PPE price preview. */
export const productCreateApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    createCatalogProduct: build.mutation<CreatedCatalogProduct, CreateCatalogProductInput>({
      queryFn: (input, { signal }) =>
        apiCall(
          apiClient.POST('/api/v1/products/overview', {
            body: toCreateCatalogProductBody(input),
            signal,
          }),
          (value) => mapCreatedCatalogProduct(value),
          createError,
        ),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Product', id: 'LIST' }]),
    }),
    getProductCodeCheck: build.query<ProductCodeCheck, { type: CatalogProductType; code?: string }>(
      {
        queryFn: ({ type, code }, { signal }) =>
          apiCall(
            apiClient.GET('/api/v1/products/overview/code-check', {
              params: { query: code ? { type, code } : { type } },
              signal,
            }),
            (value) => mapProductCodeCheck(value),
            createError,
          ),
        keepUnusedDataFor: 0,
      },
    ),
    previewPpePrices: build.query<PpePricePreview, { ruleCode: string; supplierPrice: number }>({
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/pricing/ppe/rules/preview', { params: { query: params }, signal }),
          (value) => mapPpePricePreview(value),
          (response) =>
            toAdminApiError(response, {
              fallback: 'Не вдалося порахувати ціни. Спробуйте ще раз.',
            }),
        ),
    }),
  }),
});

export const {
  useCreateCatalogProductMutation,
  useGetProductCodeCheckQuery,
  useLazyGetProductCodeCheckQuery,
  usePreviewPpePricesQuery,
} = productCreateApi;
