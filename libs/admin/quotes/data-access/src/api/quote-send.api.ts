import { quotesBaseApi } from './quotes-base-api';
import { toQuoteSendApiError } from '../errors/quote-api-error';
import { mapQuote } from '../mappers/quote.mapper';

import type { Quote, QuoteSendDraft, QuoteSendForm } from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const mapDraft = (value: Schemas['CrmQuoteSendDraft']): QuoteSendDraft => ({
  fromEmail: value.fromEmail ?? null,
  fromName: value.fromName,
  gmailConfigured: value.gmailConfigured,
  fileName: value.fileName,
  letters: value.letters,
  to: value.to ?? null,
});

const settingsTag = [{ type: 'QuoteSettings' as const, id: 'SINGLE' }];

/** «Надіслати КП» and Gmail of staff (R-15). */
export const quoteSendApi = quotesBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getQuoteSendDraft: build.query<QuoteSendDraft, number>({
      query: (id) => `/api/crm/quotes/${id}/send-draft`,
      transformResponse: mapDraft,
      transformErrorResponse: toQuoteSendApiError,
      keepUnusedDataFor: 0,
    }),
    sendQuote: build.mutation<Quote, { id: number; version: number; form: QuoteSendForm }>({
      query: ({ id, version, form }) => ({
        url: `/api/crm/quotes/${id}/send`,
        method: 'POST',
        body: { version, to: form.to.trim(), subject: form.subject.trim(), body: form.body.trim() },
      }),
      transformResponse: mapQuote,
      transformErrorResponse: toQuoteSendApiError,
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'QuoteList', id: 'LIST' }]),
    }),
    connectMailbox: build.mutation<string, { userId: number; returnPath: string }>({
      query: ({ userId, returnPath }) => ({
        url: `/api/crm/mailboxes/${userId}/connect`,
        method: 'POST',
        body: { returnPath },
      }),
      transformResponse: (value: { consentUrl: string }) => value.consentUrl,
      transformErrorResponse: toQuoteSendApiError,
    }),
    disconnectMailbox: build.mutation<void, number>({
      query: (userId) => ({ url: `/api/crm/mailboxes/${userId}`, method: 'DELETE' }),
      transformErrorResponse: toQuoteSendApiError,
      invalidatesTags: (_result, error) => (error ? [] : settingsTag),
    }),
  }),
});

export const {
  useGetQuoteSendDraftQuery,
  useSendQuoteMutation,
  useConnectMailboxMutation,
  useDisconnectMailboxMutation,
} = quoteSendApi;
