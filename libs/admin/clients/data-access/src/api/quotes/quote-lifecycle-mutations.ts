import { quoteAccessLoss } from '../../cache/quotes/quote-access-loss';
import { quoteApiError } from '../../errors/quotes/quote-api-error';
import { mapQuoteDetail } from '../../mappers/quotes/quote-detail.mapper';

import type { QuoteEndpointBuilder } from './quote-endpoint-builder';
import type { QuoteDetail, QuoteLifecycleIntent } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Args<Action extends QuoteLifecycleIntent['action']> = Extract<
  QuoteLifecycleIntent,
  { action: Action }
> & { requestId: string };
const tags = (
  _result: QuoteDetail | undefined,
  error: unknown,
  { quoteId }: { quoteId: string },
) =>
  error
    ? []
    : [
        { type: 'Quote' as const, id: quoteId },
        { type: 'Quote' as const, id: 'LIST' },
      ];
const mapExisting = (value: unknown, _meta: unknown, args: { quoteId: string }) => {
  const detail = mapQuoteDetail(value);
  if (detail.publicId !== args.quoteId) throw new Error('Відповідь містить інше КП.');
  return detail;
};
export function quoteLifecycleMutations(build: QuoteEndpointBuilder) {
  return {
    copyQuote: build.mutation<QuoteDetail, Args<'copy'>>({
      query: ({ quoteId, revision, requestId, versionId }) => ({
        url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/copy`,
        method: 'POST',
        body: {
          requestId,
          expectedRevision: revision,
          versionId,
        } satisfies operations['copyCrmQuote']['requestBody']['content']['application/json'],
      }),
      transformResponse: (value, _meta, args) => {
        const detail = mapQuoteDetail(value);
        if (
          detail.publicId === args.quoteId ||
          detail.sourceQuoteId !== args.quoteId ||
          detail.sourceVersionId !== args.versionId
        )
          throw new Error('Невірне походження копії КП.');
        return detail;
      },
      transformErrorResponse: quoteApiError,
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Quote', id: 'LIST' }]),
      onQueryStarted: quoteAccessLoss,
    }),
    transferQuote: build.mutation<QuoteDetail, Args<'transfer'>>({
      query: ({ quoteId, revision, requestId, ownerId, reason }) => ({
        url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/transfer`,
        method: 'POST',
        body: {
          requestId,
          expectedRevision: revision,
          ownerId,
          reason,
        } satisfies operations['transferCrmQuote']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapExisting,
      transformErrorResponse: quoteApiError,
      invalidatesTags: tags,
      onQueryStarted: quoteAccessLoss,
    }),
    archiveQuote: build.mutation<QuoteDetail, Args<'archive'>>({
      query: ({ quoteId, revision, requestId, archived, reason }) => ({
        url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/archive`,
        method: 'PUT',
        body: {
          requestId,
          expectedRevision: revision,
          archived,
          reason,
        } satisfies operations['setCrmQuoteArchived']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapExisting,
      transformErrorResponse: quoteApiError,
      invalidatesTags: tags,
      onQueryStarted: quoteAccessLoss,
    }),
    repriceQuote: build.mutation<QuoteDetail, Args<'reprice'>>({
      query: ({ quoteId, revision, requestId, versionId, bases }) => ({
        url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/reprice`,
        method: 'POST',
        body: {
          requestId,
          expectedRevision: revision,
          versionId,
          bases: [...bases],
        } satisfies operations['repriceCrmQuote']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapExisting,
      transformErrorResponse: quoteApiError,
      invalidatesTags: tags,
      onQueryStarted: quoteAccessLoss,
    }),
  };
}
