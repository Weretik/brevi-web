import { apiCall, apiClient } from '@admin/shared/api-client';

import {
  financeHistoryTag,
  financeMovementTags,
  financeTransfersTag,
} from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapFinanceTransfer,
  mapFinanceTransferPage,
} from '../../mappers/ledger/accounting-movement.mapper';
import { mapFinanceHistory } from '../../mappers/ledger/accounting.mapper';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type {
  FinanceHistoryEntry,
  FinanceTransfer,
  FinanceTransferBody,
  FinanceTransferPage,
  LedgerScope,
} from '@admin/accounting/model';

const changed = (_: unknown, error: unknown, { id }: { id: string }) =>
  error ? [] : [...financeMovementTags, financeHistoryTag(id)];

export function financeTransferEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** One page of «Перекази»; build the params with `financeTransferParams`. */
    getFinanceTransfers: build.query<
      FinanceTransferPage,
      Record<string, string | number | boolean>
    >({
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/transfers', { params: { query: params }, signal }),
          mapFinanceTransferPage,
          accountingApiError,
        ),
      providesTags: [financeTransfersTag],
    }),
    createFinanceTransfer: build.mutation<
      FinanceTransfer,
      FinanceTransferBody & { scope: LedgerScope; requestId: string }
    >({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/transfers', { body: body, signal }),
          mapFinanceTransfer,
          accountingApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : financeMovementTags),
    }),
    updateFinanceTransfer: build.mutation<
      FinanceTransfer,
      { id: string; body: FinanceTransferBody & { version: number } }
    >({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/accounting/transfers/{id}', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          mapFinanceTransfer,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    voidFinanceTransfer: build.mutation<FinanceTransfer, { id: string; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/transfers/{id}/void', {
            params: { path: { id: id } },
            body: { version },
            signal,
          }),
          mapFinanceTransfer,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    getFinanceTransferHistory: build.query<FinanceHistoryEntry[], string>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/transfers/{id}/history', {
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
