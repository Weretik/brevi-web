import { financeAccountsTag, financeHistoryTag } from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapAccountingSettings,
  mapFinanceAccount,
  mapFinanceAccounts,
  mapFinanceHistory,
} from '../../mappers/accounting.mapper';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
import type {
  AccountingSettings,
  FinanceAccount,
  FinanceAccountBody,
  FinanceAccountCutoverBody,
  FinanceHistoryEntry,
} from '@admin/accounting/model';

const accounts = '/api/accounting/accounts';
const one = (id: string) => `${accounts}/${encodeURIComponent(id)}`;

/** Every change returns the account; the list and its history are fetched again. */
const changed = (_: unknown, error: unknown, { id }: { id: string }) =>
  error ? [] : [financeAccountsTag, financeHistoryTag(id)];

export function financeAccountEndpoints(build: AccountingEndpointBuilder) {
  return {
    getAccountingSettings: build.query<AccountingSettings, void>({
      query: () => ({ url: '/api/accounting/settings' }),
      transformResponse: mapAccountingSettings,
      transformErrorResponse: accountingApiError,
    }),
    /** All accounts, archived ones too: the page filters them with chips. */
    getFinanceAccounts: build.query<FinanceAccount[], void>({
      query: () => ({ url: accounts, params: { includeArchived: true } }),
      transformResponse: mapFinanceAccounts,
      transformErrorResponse: accountingApiError,
      providesTags: [financeAccountsTag],
    }),
    createFinanceAccount: build.mutation<FinanceAccount, FinanceAccountBody>({
      query: (body) => ({ url: accounts, method: 'POST', body }),
      transformResponse: mapFinanceAccount,
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error) => (error ? [] : [financeAccountsTag]),
    }),
    updateFinanceAccount: build.mutation<
      FinanceAccount,
      { id: string; body: FinanceAccountBody & { version: number } }
    >({
      query: ({ id, body }) => ({ url: one(id), method: 'PUT', body }),
      transformResponse: mapFinanceAccount,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    setFinanceAccountCutover: build.mutation<
      FinanceAccount,
      { id: string; body: FinanceAccountCutoverBody }
    >({
      query: ({ id, body }) => ({ url: `${one(id)}/cutover`, method: 'PUT', body }),
      transformResponse: mapFinanceAccount,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    setFinanceAccountActive: build.mutation<
      FinanceAccount,
      { id: string; active: boolean; version: number }
    >({
      query: ({ id, active, version }) => ({
        url: `${one(id)}/${active ? 'restore' : 'archive'}`,
        method: 'POST',
        body: { version },
      }),
      transformResponse: mapFinanceAccount,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    deleteFinanceAccount: build.mutation<void, { id: string; version: number }>({
      query: ({ id, version }) => ({ url: one(id), method: 'DELETE', params: { version } }),
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error) => (error ? [] : [financeAccountsTag]),
    }),
    getFinanceAccountHistory: build.query<FinanceHistoryEntry[], string>({
      query: (id) => ({ url: `${one(id)}/history` }),
      transformResponse: mapFinanceHistory,
      transformErrorResponse: accountingApiError,
      providesTags: (_, __, id) => [financeHistoryTag(id)],
    }),
  };
}
