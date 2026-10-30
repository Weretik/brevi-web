import { customBaseApi } from './custom-base-api';
import { customMutations } from './custom-mutations';
import { customQueries } from './custom-queries';

export const customSewingApi = customBaseApi.injectEndpoints({
  endpoints: (build) => ({ ...customQueries(build), ...customMutations(build) }),
});
export const {
  useGetCustomSewingQuery,
  useGetCustomSewingVersionQuery,
  useGetCustomSewingVersionsQuery,
  useCreateCustomSewingMutation,
  useSaveCustomSewingMutation,
  useCalculateCustomSewingMutation,
  useSaveCustomSewingVersionMutation,
} = customSewingApi;
