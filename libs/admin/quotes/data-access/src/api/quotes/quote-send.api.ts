import { apiCall, apiClient } from '@admin/shared/api-client';

import { toQuoteSendApiError } from '../../errors/quote-api-error';
import { mapQuote } from '../../mappers/quote.mapper';
import { quotesBaseApi } from '../base/quotes-base-api';

import type { Quote, QuoteSendDraft, QuoteSendForm } from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const mapDraft = (value: Schemas['QuoteSendDraftResponse']): QuoteSendDraft => ({
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
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quotes/{id}/send-draft', {
            params: { path: { id: id } },
            signal,
          }),
          mapDraft,
          toQuoteSendApiError,
        ),
      keepUnusedDataFor: 0,
    }),
    /** `requestId` is one per press: a repeat returns the КП without a second letter. */
    sendQuote: build.mutation<
      Quote,
      { id: number; version: number; form: QuoteSendForm; requestId: string }
    >({
      queryFn: ({ id, version, form, requestId }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/quotes/{id}/send', {
            params: { path: { id: id } },
            body: {
              version,
              to: form.to.trim(),
              subject: form.subject.trim(),
              body: form.body.trim(),
              requestId,
            },
            signal,
          }),
          mapQuote,
          toQuoteSendApiError,
        ),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'QuoteList', id: 'LIST' }]),
    }),
    connectMailbox: build.mutation<string, { userId: number; returnPath: string }>({
      queryFn: ({ userId, returnPath }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/mailboxes/{userId}/connect', {
            params: { path: { userId: userId } },
            body: { returnPath },
            signal,
          }),
          (value: { consentUrl: string }) => value.consentUrl,
          toQuoteSendApiError,
        ),
    }),
    disconnectMailbox: build.mutation<void, number>({
      queryFn: (userId, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/crm/mailboxes/{userId}', {
            params: { path: { userId: userId } },
            signal,
          }),
          undefined,
          toQuoteSendApiError,
        ),
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
