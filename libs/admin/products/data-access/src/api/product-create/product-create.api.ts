import { adminApi, toAdminApiError } from '@admin/shared/api-client';

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
      query: (input) => ({
        url: '/api/v1/products/overview',
        method: 'POST',
        body: toCreateCatalogProductBody(input),
      }),
      transformResponse: (value) => mapCreatedCatalogProduct(value),
      transformErrorResponse: createError,
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Product', id: 'LIST' }]),
    }),
    getProductCodeCheck: build.query<ProductCodeCheck, { type: CatalogProductType; code?: string }>(
      {
        query: ({ type, code }) => ({
          url: '/api/v1/products/overview/code-check',
          params: code ? { type, code } : { type },
        }),
        transformResponse: (value) => mapProductCodeCheck(value),
        transformErrorResponse: createError,
        keepUnusedDataFor: 0,
      },
    ),
    previewPpePrices: build.query<PpePricePreview, { ruleCode: string; supplierPrice: number }>({
      query: (params) => ({ url: '/api/v1/pricing/ppe/rules/preview', params }),
      transformResponse: (value) => mapPpePricePreview(value),
      transformErrorResponse: (response) =>
        toAdminApiError(response, { fallback: 'Не вдалося порахувати ціни. Спробуйте ще раз.' }),
    }),
  }),
});

export const {
  useCreateCatalogProductMutation,
  useGetProductCodeCheckQuery,
  useLazyGetProductCodeCheckQuery,
  usePreviewPpePricesQuery,
} = productCreateApi;
