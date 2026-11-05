import {
  financeCounterpartiesTag,
  financeHistoryTag,
  financeMovementTags,
  financeTransactionsTag,
} from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapFinanceTransaction,
  mapFinanceTransactionPage,
} from '../../mappers/accounting-movement.mapper';
import { mapFinanceHistory } from '../../mappers/accounting.mapper';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
import type {
  FinanceHistoryEntry,
  FinanceTransaction,
  FinanceTransactionBody,
  FinanceTransactionPage,
  FinanceTransactionReviewBody,
  LedgerScope,
} from '@admin/accounting/model';

const transactions = '/api/accounting/transactions';
const one = (id: string) => `${transactions}/${encodeURIComponent(id)}`;

/** A saved operation changes balances, the overview, the journal and its own history. */
const changed = (_: unknown, error: unknown, { id }: { id: string }) =>
  error ? [] : [...financeMovementTags, financeCounterpartiesTag, financeHistoryTag(id)];

export function financeTransactionEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** One page of «Операції»; build the params with `financeTransactionParams`. */
    getFinanceTransactions: build.query<
      FinanceTransactionPage,
      Record<string, string | number | boolean>
    >({
      query: (params) => ({ url: transactions, params }),
      transformResponse: mapFinanceTransactionPage,
      transformErrorResponse: accountingApiError,
      providesTags: [financeTransactionsTag],
    }),
    createFinanceTransaction: build.mutation<
      FinanceTransaction,
      FinanceTransactionBody & { scope: LedgerScope }
    >({
      query: (body) => ({ url: transactions, method: 'POST', body }),
      transformResponse: mapFinanceTransaction,
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error) =>
        error ? [] : [...financeMovementTags, financeCounterpartiesTag],
    }),
    updateFinanceTransaction: build.mutation<
      FinanceTransaction,
      { id: string; body: FinanceTransactionBody & { version: number } }
    >({
      query: ({ id, body }) => ({ url: one(id), method: 'PUT', body }),
      transformResponse: mapFinanceTransaction,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    voidFinanceTransaction: build.mutation<FinanceTransaction, { id: string; version: number }>({
      query: ({ id, version }) => ({ url: `${one(id)}/void`, method: 'POST', body: { version } }),
      transformResponse: mapFinanceTransaction,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    /** «Перевірити»: the category and who the operation is with. */
    reviewFinanceTransaction: build.mutation<
      FinanceTransaction,
      { id: string; body: FinanceTransactionReviewBody }
    >({
      query: ({ id, body }) => ({ url: `${one(id)}/review`, method: 'PUT', body }),
      transformResponse: mapFinanceTransaction,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    /** «Зробити постійним»: the one-off name becomes a finance counterparty. */
    promoteFinanceOneoff: build.mutation<FinanceTransaction, { id: string; version: number }>({
      query: ({ id, version }) => ({
        url: `${one(id)}/promote-oneoff`,
        method: 'POST',
        body: { version },
      }),
      transformResponse: mapFinanceTransaction,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    getFinanceTransactionHistory: build.query<FinanceHistoryEntry[], string>({
      query: (id) => ({ url: `${one(id)}/history` }),
      transformResponse: mapFinanceHistory,
      transformErrorResponse: accountingApiError,
      providesTags: (_, __, id) => [financeHistoryTag(id)],
    }),
  };
}
