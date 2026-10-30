import { quoteDocumentApi, quoteDocumentError, documentQuoteUrl } from './quote-document-api';
import { quoteDocumentAccessLoss } from '../../cache/quotes/quote-document-access-loss';
import { mapQuoteDelivery } from '../../mappers/documents/quote-delivery.mapper';
import { mapQuoteResultPage } from '../../mappers/quotes/quote-result-page.mapper';

import type { QuoteDeliveryView, QuoteResultPage } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Command = {
  quoteId: string;
  versionId: string;
  revision: number;
  requestId: string;
  pdfId: string;
  templateId: string;
  recipient: string;
  manager: string;
};
const target = (value: unknown, quoteId: string) => {
  const row = mapQuoteDelivery(value);
  if (row.quoteId !== quoteId) throw new Error('Отримано історію іншого КП.');
  return row;
};
export const quoteDeliveryApi = quoteDocumentApi.injectEndpoints({
  endpoints: (build) => ({
    getQuoteDeliveries: build.query<
      QuoteResultPage<QuoteDeliveryView>,
      { quoteId: string; page: number }
    >({
      query: ({ quoteId, page }) => ({
        url: `${documentQuoteUrl(quoteId)}/deliveries`,
        params: { page, pageSize: 25 },
      }),
      transformResponse: (value: unknown, _meta, { quoteId, page }) => {
        const result = mapQuoteResultPage(value, (row) => target(row, quoteId));
        if (result.page !== page || result.pageSize !== 25)
          throw new Error('Некоректна сторінка історії.');
        return result;
      },
      providesTags: (_r, _e, { quoteId }) => [{ type: 'QuoteDelivery', id: quoteId }],
      transformErrorResponse: quoteDocumentError,
      keepUnusedDataFor: 0,
      onQueryStarted: quoteDocumentAccessLoss,
    }),
    getQuoteDelivery: build.query<QuoteDeliveryView, { quoteId: string; deliveryId: string }>({
      query: ({ quoteId, deliveryId }) =>
        `${documentQuoteUrl(quoteId)}/deliveries/${encodeURIComponent(deliveryId)}`,
      transformResponse: (value: unknown, _meta, { quoteId, deliveryId }) => {
        const row = target(value, quoteId);
        if (row.id !== deliveryId) throw new Error('Інша спроба надсилання.');
        return row;
      },
      transformErrorResponse: quoteDocumentError,
      keepUnusedDataFor: 0,
      onQueryStarted: quoteDocumentAccessLoss,
    }),
    enqueueQuoteDelivery: build.mutation<QuoteDeliveryView, Command>({
      query: ({
        quoteId,
        versionId,
        revision,
        requestId,
        pdfId,
        templateId,
        recipient,
        manager,
      }) => ({
        url: `${documentQuoteUrl(quoteId)}/deliveries`,
        method: 'POST',
        body: {
          requestId,
          versionId,
          expectedRevision: revision,
          artifactId: pdfId,
          emailTemplateVersionId: templateId,
          recipientAddress: recipient,
          managerName: manager,
        } satisfies operations['enqueueCrmQuoteDelivery']['requestBody']['content']['application/json'],
      }),
      transformResponse: (value: unknown, _meta, command) => {
        const row = target(value, command.quoteId);
        if (
          row.versionId !== command.versionId ||
          row.pdfId !== command.pdfId ||
          row.templateId !== command.templateId ||
          row.recipient !== command.recipient
        )
          throw new Error('Сервер повернув інший результат надсилання.');
        return row;
      },
      invalidatesTags: (_r, error, { quoteId }) =>
        error ? [] : [{ type: 'QuoteDelivery', id: quoteId }],
      transformErrorResponse: quoteDocumentError,
      onQueryStarted: quoteDocumentAccessLoss,
    }),
  }),
});
export const {
  useGetQuoteDeliveriesQuery,
  useLazyGetQuoteDeliveryQuery,
  useEnqueueQuoteDeliveryMutation,
} = quoteDeliveryApi;
