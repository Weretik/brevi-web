import { apiCall, apiClient } from '@admin/shared/api-client';

import {
  financeAccountsTag,
  financeHistoryTag,
  financeMovementTags,
  financeOverviewTag,
} from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapAccountingSettings,
  mapFinanceAccount,
  mapFinanceAccounts,
  mapFinanceHistory,
} from '../../mappers/ledger/accounting.mapper';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type {
  AccountingSettings,
  FinanceAccount,
  FinanceAccountBody,
  FinanceAccountCutoverBody,
  FinanceHistoryEntry,
} from '@admin/accounting/model';

/**
 * Every change returns the account; the list, its history, the overview and the journals (they show
 * account names) are fetched again.
 */
const changed = (_: unknown, error: unknown, { id }: { id: string }) =>
  error ? [] : [...financeMovementTags, financeHistoryTag(id)];

export function financeAccountEndpoints(build: AccountingEndpointBuilder) {
  return {
    getAccountingSettings: build.query<AccountingSettings, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/settings', { signal }),
          mapAccountingSettings,
          accountingApiError,
        ),
    }),
    /** All accounts, archived ones too: the page filters them with chips. */
    getFinanceAccounts: build.query<FinanceAccount[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/accounts', {
            params: { query: { includeArchived: true } },
            signal,
          }),
          mapFinanceAccounts,
          accountingApiError,
        ),
      providesTags: [financeAccountsTag],
    }),
    createFinanceAccount: build.mutation<FinanceAccount, FinanceAccountBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/accounts', { body: body, signal }),
          mapFinanceAccount,
          accountingApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [financeAccountsTag, financeOverviewTag]),
    }),
    updateFinanceAccount: build.mutation<
      FinanceAccount,
      { id: string; body: FinanceAccountBody & { version: number } }
    >({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/accounting/accounts/{id}', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          mapFinanceAccount,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    setFinanceAccountCutover: build.mutation<
      FinanceAccount,
      { id: string; body: FinanceAccountCutoverBody }
    >({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/accounting/accounts/{id}/cutover', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          mapFinanceAccount,
          accountingApiError,
        ),
      invalidatesTags: changed,
    }),
    setFinanceAccountActive: build.mutation<
      FinanceAccount,
      { id: string; active: boolean; version: number }
    >({
      queryFn: ({ id, active, version }, { signal }) => {
        const init = { params: { path: { id } }, body: { version }, signal };
        return apiCall(
          active
            ? apiClient.POST('/api/accounting/accounts/{id}/restore', init)
            : apiClient.POST('/api/accounting/accounts/{id}/archive', init),
          mapFinanceAccount,
          accountingApiError,
        );
      },
      invalidatesTags: changed,
    }),
    deleteFinanceAccount: build.mutation<void, { id: string; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/accounting/accounts/{id}', {
            params: { path: { id: id }, query: { version } },
            signal,
          }),
          undefined,
          accountingApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [financeAccountsTag]),
    }),
    getFinanceAccountHistory: build.query<FinanceHistoryEntry[], string>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/accounts/{id}/history', {
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
