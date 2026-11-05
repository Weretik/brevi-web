import { financeAttachmentsTag, financeHistoryTag } from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapFinanceAttachment,
  mapFinanceAttachments,
} from '../../mappers/accounting-attachment.mapper';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
import type { FinanceAttachment } from '@admin/accounting/model';

const ofTransaction = (id: string) =>
  `/api/accounting/transactions/${encodeURIComponent(id)}/attachments`;

/** A file changes the list of its operation and the operation's history. */
const changed = (_: unknown, error: unknown, { transactionId }: { transactionId: string }) =>
  error ? [] : [financeAttachmentsTag(transactionId), financeHistoryTag(transactionId)];

export function financeAttachmentEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** «Файли» of one income or expense. */
    getFinanceAttachments: build.query<FinanceAttachment[], string>({
      query: (transactionId) => ({ url: ofTransaction(transactionId) }),
      transformResponse: mapFinanceAttachments,
      transformErrorResponse: accountingApiError,
      providesTags: (_, __, transactionId) => [financeAttachmentsTag(transactionId)],
    }),
    uploadFinanceAttachment: build.mutation<
      FinanceAttachment,
      { transactionId: string; file: File }
    >({
      query: ({ transactionId, file }) => {
        const body = new FormData();
        body.append('file', file);
        return { url: ofTransaction(transactionId), method: 'POST', body };
      },
      transformResponse: mapFinanceAttachment,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    deleteFinanceAttachment: build.mutation<void, { id: string; transactionId: string }>({
      query: ({ id }) => ({
        url: `/api/accounting/attachments/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
  };
}
