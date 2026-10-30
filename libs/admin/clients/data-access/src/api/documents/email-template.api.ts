import { quoteDocumentApi, quoteDocumentError } from './quote-document-api';
import { quoteDocumentAccessLoss } from '../../cache/quotes/quote-document-access-loss';
import { mapActiveEmailTemplate } from '../../mappers/documents/email-template.mapper';

import type { EmailTemplateView } from '@admin/clients/model';

export const quoteEmailTemplateApi = quoteDocumentApi.injectEndpoints({
  endpoints: (build) => ({
    getActiveQuoteEmailTemplate: build.query<EmailTemplateView | null, void>({
      query: () => '/api/crm/email-templates/active',
      transformResponse: mapActiveEmailTemplate,
      transformErrorResponse: quoteDocumentError,
      keepUnusedDataFor: 0,
      onQueryStarted: quoteDocumentAccessLoss,
    }),
  }),
});
export const { useGetActiveQuoteEmailTemplateQuery } = quoteEmailTemplateApi;
