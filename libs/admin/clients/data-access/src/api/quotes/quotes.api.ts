import { quoteDocumentEndpoints } from './documents/quote-document-endpoints';
import { quoteBaseApi } from './quote-base-api';
import { quoteHistoryQueries } from './quote-history-queries';
import { quoteLifecycleMutations } from './quote-lifecycle-mutations';
import { quoteMutations } from './quote-mutations';
import { quotePreviews } from './quote-previews';
import { quoteQueries } from './quote-queries';

export const quotesApi = quoteBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...quoteQueries(build),
    ...quoteMutations(build),
    ...quotePreviews(build),
    ...quoteHistoryQueries(build),
    ...quoteLifecycleMutations(build),
    ...quoteDocumentEndpoints(build),
  }),
});
export const {
  useListQuotesQuery,
  useGetQuoteQuery,
  useCreateQuoteMutation,
  useSaveQuoteVersionMutation,
  usePreviewQuotePricesMutation,
  useGetQuoteVersionsQuery,
  useGetQuoteVersionQuery,
  useGetQuoteEventsQuery,
  useGetQuoteAssigneesQuery,
  useCopyQuoteMutation,
  useTransferQuoteMutation,
  useArchiveQuoteMutation,
  useRepriceQuoteMutation,
  usePrepareQuoteMutation,
  useRenderQuotePdfMutation,
  useLazyGetQuotePdfArtifactQuery,
} = quotesApi;
