import { apiCall, apiClient, formDataBody } from '@admin/shared/api-client';

import { financeAttachmentsTag, financeHistoryTag } from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapFinanceAttachment,
  mapFinanceAttachments,
} from '../../mappers/ledger/accounting-attachment.mapper';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type { FinanceAttachment } from '@admin/accounting/model';

/** A file changes the list of its operation and the operation's history. */
const changed = (_: unknown, error: unknown, { transactionId }: { transactionId: string }) =>
  error ? [] : [financeAttachmentsTag(transactionId), financeHistoryTag(transactionId)];

export function financeAttachmentEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** «Файли» of one income or expense. */
    getFinanceAttachments: build.query<FinanceAttachment[], string>({
      queryFn: (transactionId, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/transactions/{id}/attachments', {
            params: { path: { id: transactionId } },
            signal,
          }),
          mapFinanceAttachments,
          accountingApiError,
        ),
      providesTags: (_, __, transactionId) => [financeAttachmentsTag(transactionId)],
    }),
    uploadFinanceAttachment: build.mutation<
      FinanceAttachment,
      { transactionId: string; file: File }
    >({
      queryFn: ({ transactionId, file }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/transactions/{id}/attachments', {
            params: { path: { id: transactionId } },
            ...formDataBody({ file }),
            signal,
          }),
          mapFinanceAttachment,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    deleteFinanceAttachment: build.mutation<void, { id: string; transactionId: string }>({
      queryFn: ({ id }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/accounting/attachments/{id}', {
            params: { path: { id: id } },
            signal,
          }),
          undefined,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
  };
}
