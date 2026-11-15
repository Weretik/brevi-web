import { apiCall, apiClient } from '@admin/shared/api-client';

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
} from '../../mappers/ledger/accounting-movement.mapper';
import { mapFinanceHistory } from '../../mappers/ledger/accounting.mapper';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type {
  FinanceHistoryEntry,
  FinanceTransaction,
  FinanceTransactionBody,
  FinanceTransactionPage,
  FinanceTransactionReviewBody,
  LedgerScope,
} from '@admin/accounting/model';

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
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/transactions', { params: { query: params }, signal }),
          mapFinanceTransactionPage,
          accountingApiError,
        ),
      providesTags: [financeTransactionsTag],
    }),
    createFinanceTransaction: build.mutation<
      FinanceTransaction,
      FinanceTransactionBody & { scope: LedgerScope; requestId: string }
    >({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/transactions', { body: body, signal }),
          mapFinanceTransaction,
          accountingApiError,
        ),
      invalidatesTags: (_, error) =>
        error ? [] : [...financeMovementTags, financeCounterpartiesTag],
    }),
    updateFinanceTransaction: build.mutation<
      FinanceTransaction,
      { id: string; body: FinanceTransactionBody & { version: number } }
    >({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/accounting/transactions/{id}', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          mapFinanceTransaction,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    voidFinanceTransaction: build.mutation<FinanceTransaction, { id: string; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/transactions/{id}/void', {
            params: { path: { id: id } },
            body: { version },
            signal,
          }),
          mapFinanceTransaction,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    /** «Перевірити»: the category and who the operation is with. */
    reviewFinanceTransaction: build.mutation<
      FinanceTransaction,
      { id: string; body: FinanceTransactionReviewBody }
    >({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/accounting/transactions/{id}/review', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          mapFinanceTransaction,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    /** «Зробити постійним»: the one-off name becomes a finance counterparty. */
    promoteFinanceOneoff: build.mutation<FinanceTransaction, { id: string; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/transactions/{id}/promote-oneoff', {
            params: { path: { id: id } },
            body: { version },
            signal,
          }),
          mapFinanceTransaction,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    getFinanceTransactionHistory: build.query<FinanceHistoryEntry[], string>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/transactions/{id}/history', {
            params: { path: { id: id } },
            signal,
          }),
          mapFinanceHistory,
          accountingApiError,
        ),
      providesTags: (_, __, id) => [financeHistoryTag(id)],
    }),
  };
}
