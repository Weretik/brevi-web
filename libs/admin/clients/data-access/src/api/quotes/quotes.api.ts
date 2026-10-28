import { quoteBaseApi } from './quote-base-api';
import { quoteMutations } from './quote-mutations';
import { quotePreviews } from './quote-previews';
import { quoteQueries } from './quote-queries';

export const quotesApi = quoteBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...quoteQueries(build),
    ...quoteMutations(build),
    ...quotePreviews(build),
  }),
});
export const {
  useListQuotesQuery,
  useGetQuoteQuery,
  useCreateQuoteMutation,
  useSaveQuoteVersionMutation,
  usePreviewQuotePricesMutation,
} = quotesApi;
