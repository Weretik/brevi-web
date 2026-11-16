import { apiCall, apiClient } from '@admin/shared/api-client';

import {
  financeCounterpartiesTag,
  financeCounterpartyTags,
  financeHistoryTag,
} from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapFinanceCounterparty,
  mapFinanceCounterpartyChoices,
  mapFinanceCounterpartyPage,
} from '../../mappers/ledger/accounting-counterparty.mapper';
import { mapFinanceHistory } from '../../mappers/ledger/accounting.mapper';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type {
  FinanceCounterparty,
  FinanceCounterpartyBody,
  FinanceCounterpartyChoice,
  FinanceCounterpartyPage,
  FinanceHistoryEntry,
} from '@admin/accounting/model';

const changed = (_: unknown, error: unknown, { id }: { id: string }) =>
  error ? [] : [...financeCounterpartyTags, financeHistoryTag(id)];

export function financeCounterpartyEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** One tab of «Контрагенти»; build the params with `financeCounterpartyParams`. */
    getFinanceCounterparties: build.query<
      FinanceCounterpartyPage,
      Record<string, string | number | boolean>
    >({
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/counterparties', { params: { query: params }, signal }),
          mapFinanceCounterpartyPage,
          accountingApiError,
        ),
      providesTags: [financeCounterpartiesTag],
    }),
    /** The counterparty field of an operation: active ones of the three kinds. */
    getFinanceCounterpartyChoices: build.query<FinanceCounterpartyChoice[], string>({
      queryFn: (search, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/counterparties/choices', {
            params: { query: search.trim() ? { search: search.trim() } : {} },
            signal,
          }),
          mapFinanceCounterpartyChoices,
          accountingApiError,
        ),
      providesTags: [financeCounterpartiesTag],
    }),
    createFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      FinanceCounterpartyBody & { verified: boolean }
    >({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/counterparties', { body: body, signal }),
          mapFinanceCounterparty,
          accountingApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [financeCounterpartiesTag]),
    }),
    updateFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      { id: string; body: FinanceCounterpartyBody & { version: number } }
    >({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/accounting/counterparties/{id}', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          mapFinanceCounterparty,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    verifyFinanceCounterparty: build.mutation<FinanceCounterparty, { id: string; version: number }>(
      {
        queryFn: ({ id, version }, { signal }) =>
          apiCall(
            apiClient.POST('/api/accounting/counterparties/{id}/verify', {
              params: { path: { id } },
              body: { version },
              signal,
            }),
            mapFinanceCounterparty,
            accountingApiError,
          ),
        invalidatesTags: changed,
      },
    ),
    archiveFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      { id: string; version: number }
    >({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/counterparties/{id}/archive', {
            params: { path: { id } },
            body: { version },
            signal,
          }),
          mapFinanceCounterparty,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    restoreFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      { id: string; version: number }
    >({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/counterparties/{id}/restore', {
            params: { path: { id } },
            body: { version },
            signal,
          }),
          mapFinanceCounterparty,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    /** Moves every operation of `id` to `targetId` and archives `id`; returns the target. */
    mergeFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      { id: string; version: number; targetId: string; targetVersion: number }
    >({
      queryFn: ({ id, ...body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/counterparties/{id}/merge', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          mapFinanceCounterparty,
          accountingApiError,
        ),
      invalidatesTags: (_, error, { id, targetId }) =>
        error
          ? []
          : [...financeCounterpartyTags, financeHistoryTag(id), financeHistoryTag(targetId)],
    }),
    getFinanceCounterpartyHistory: build.query<FinanceHistoryEntry[], string>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/counterparties/{id}/history', {
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
