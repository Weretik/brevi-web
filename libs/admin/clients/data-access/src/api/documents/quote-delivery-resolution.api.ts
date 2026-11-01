import { quoteDocumentApi, quoteDocumentError, documentQuoteUrl } from './quote-document-api';
import { quoteDocumentAccessLoss } from '../../cache/quotes/quote-document-access-loss';
import { mapQuoteDelivery } from '../../mappers/documents/quote-delivery.mapper';

import type { QuoteDeliveryView } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Body = operations['resolveCrmQuoteDelivery']['requestBody']['content']['application/json'];
type Command = Body & { quoteId: string; deliveryId: string };
export const quoteDeliveryResolutionApi = quoteDocumentApi.injectEndpoints({
  endpoints: (build) => ({
    resolveQuoteDelivery: build.mutation<QuoteDeliveryView, Command>({
      query: ({ quoteId, deliveryId, requestId, expectedAttempt, outcome, evidenceNote }) => ({
        url:
          documentQuoteUrl(quoteId) +
          '/deliveries/' +
          encodeURIComponent(deliveryId) +
          '/resolution',
        method: 'POST',
        body: { requestId, expectedAttempt, outcome, evidenceNote } satisfies Body,
      }),
      transformResponse: (value: unknown, _meta, command) => {
        const row = mapQuoteDelivery(value);
        if (
          row.quoteId !== command.quoteId ||
          row.id !== command.deliveryId ||
          row.attempt !== command.expectedAttempt ||
          row.manualResolution?.outcome !== command.outcome ||
          row.manualResolution.evidenceNote !== command.evidenceNote.trim()
        )
          throw new Error('Сервер повернув інший результат перевірки.');
        return row;
      },
      transformErrorResponse: quoteDocumentError,
      onQueryStarted: quoteDocumentAccessLoss,
      invalidatesTags: (_result, error, { quoteId }) =>
        error
          ? []
          : [
              { type: 'QuoteDelivery', id: quoteId },
              { type: 'Quote', id: quoteId },
            ],
    }),
  }),
});
export const { useResolveQuoteDeliveryMutation } = quoteDeliveryResolutionApi;
