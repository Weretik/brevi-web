import { contentBaseApi } from './content-base-api';
import { contentProductEndpoints } from './product-pages/content-product-endpoints';
import { siteCategoryEndpoints } from './site-categories/site-category-endpoints';

export const contentApi = contentBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...contentProductEndpoints(build),
    ...siteCategoryEndpoints(build),
  }),
});

export const {
  useGetContentProductsQuery,
  useGetContentProductQuery,
  useSaveContentProductMutation,
  useSetContentProductVisibilityMutation,
  useDeleteContentProductMutation,
  useImportOldSiteProductPagesMutation,
  useGetSiteCategoriesQuery,
  useGetSiteCategoryQuery,
  useSaveSiteCategoryMutation,
  useSetSiteCategoryVisibilityMutation,
  useReorderSiteCategoriesMutation,
  useDeleteSiteCategoryMutation,
  useImportOldSiteCategoriesMutation,
} = contentApi;
