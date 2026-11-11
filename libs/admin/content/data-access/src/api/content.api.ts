import { articleEndpoints } from './articles/article-endpoints';
import { siteCompanyEndpoints } from './company/site-company-endpoints';
import { contentBaseApi } from './content-base-api';
import { siteGalleryEndpoints } from './galleries/site-gallery-endpoints';
import { contentProductEndpoints } from './product-pages/content-product-endpoints';
import { redirectEndpoints } from './redirects/redirect-endpoints';
import { seoOverviewEndpoints } from './seo-overview/seo-overview-endpoints';
import { seoSettingsEndpoints } from './seo-settings/seo-settings-endpoints';
import { siteCategoryEndpoints } from './site-categories/site-category-endpoints';
import { sitePageEndpoints } from './site-pages/site-page-endpoints';

export const contentApi = contentBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...contentProductEndpoints(build),
    ...siteCategoryEndpoints(build),
    ...articleEndpoints(build),
    ...redirectEndpoints(build),
    ...seoSettingsEndpoints(build),
    ...sitePageEndpoints(build),
    ...seoOverviewEndpoints(build),
    ...siteCompanyEndpoints(build),
    ...siteGalleryEndpoints(build),
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
  useGetSitePagesQuery,
  useSaveSitePageMutation,
  useGetSeoOverviewQuery,
  useGetSiteCompanyQuery,
  useSaveSiteCompanyMutation,
  useGetSiteGalleryQuery,
  useSaveSiteGalleryMutation,
  useTransferSiteGalleryMutation,
} = contentApi;
