import { contentBaseApi } from './content-base-api';
import { contentProductEndpoints } from './product-pages/content-product-endpoints';

export const contentApi = contentBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...contentProductEndpoints(build),
  }),
});

export const {
  useGetContentProductsQuery,
  useGetContentProductQuery,
  useSaveContentProductMutation,
  useSetContentProductVisibilityMutation,
  useDeleteContentProductMutation,
} = contentApi;
