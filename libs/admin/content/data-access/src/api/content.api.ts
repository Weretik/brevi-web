import { articleEndpoints } from './articles/article-endpoints';
import { contentBaseApi } from './content-base-api';
import { contentProductEndpoints } from './product-pages/content-product-endpoints';
import { redirectEndpoints } from './redirects/redirect-endpoints';
import { seoSettingsEndpoints } from './seo-settings/seo-settings-endpoints';
import { siteCategoryEndpoints } from './site-categories/site-category-endpoints';

export const contentApi = contentBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...contentProductEndpoints(build),
    ...siteCategoryEndpoints(build),
    ...articleEndpoints(build),
    ...redirectEndpoints(build),
    ...seoSettingsEndpoints(build),
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
  useGetContentArticlesQuery,
  useGetContentArticleQuery,
  useSaveContentArticleMutation,
  useSetContentArticleVisibilityMutation,
  useDeleteContentArticleMutation,
  useImportOldSiteArticlesMutation,
  useGetSiteRedirectsQuery,
  useSaveSiteRedirectMutation,
  useDeleteSiteRedirectMutation,
  useImportOldSiteRedirectsMutation,
  useGetSiteSeoSettingsQuery,
  useSaveSiteSeoSettingsMutation,
} = contentApi;
