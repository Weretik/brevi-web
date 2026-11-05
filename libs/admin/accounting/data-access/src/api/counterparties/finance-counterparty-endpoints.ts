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
} from '../../mappers/accounting-counterparty.mapper';
import { mapFinanceHistory } from '../../mappers/accounting.mapper';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
import type {
  FinanceCounterparty,
  FinanceCounterpartyBody,
  FinanceCounterpartyChoice,
  FinanceCounterpartyPage,
  FinanceHistoryEntry,
} from '@admin/accounting/model';

const counterparties = '/api/accounting/counterparties';
const one = (id: string) => `${counterparties}/${encodeURIComponent(id)}`;

const changed = (_: unknown, error: unknown, { id }: { id: string }) =>
  error ? [] : [...financeCounterpartyTags, financeHistoryTag(id)];

const action = (path: 'verify' | 'archive' | 'restore') => ({
  query: ({ id, version }: { id: string; version: number }) => ({
    url: `${one(id)}/${path}`,
    method: 'POST',
    body: { version },
  }),
  transformResponse: mapFinanceCounterparty,
  transformErrorResponse: accountingApiError,
  invalidatesTags: changed,
});

export function financeCounterpartyEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** One tab of «Контрагенти»; build the params with `financeCounterpartyParams`. */
    getFinanceCounterparties: build.query<
      FinanceCounterpartyPage,
      Record<string, string | number | boolean>
    >({
      query: (params) => ({ url: counterparties, params }),
      transformResponse: mapFinanceCounterpartyPage,
      transformErrorResponse: accountingApiError,
      providesTags: [financeCounterpartiesTag],
    }),
    /** The counterparty field of an operation: active ones of the three kinds. */
    getFinanceCounterpartyChoices: build.query<FinanceCounterpartyChoice[], string>({
      query: (search) => ({
        url: `${counterparties}/choices`,
        params: search.trim() ? { search: search.trim() } : {},
      }),
      transformResponse: mapFinanceCounterpartyChoices,
      transformErrorResponse: accountingApiError,
      providesTags: [financeCounterpartiesTag],
    }),
    createFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      FinanceCounterpartyBody & { verified: boolean }
    >({
      query: (body) => ({ url: counterparties, method: 'POST', body }),
      transformResponse: mapFinanceCounterparty,
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error) => (error ? [] : [financeCounterpartiesTag]),
    }),
    updateFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      { id: string; body: FinanceCounterpartyBody & { version: number } }
    >({
      query: ({ id, body }) => ({ url: one(id), method: 'PUT', body }),
      transformResponse: mapFinanceCounterparty,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    verifyFinanceCounterparty: build.mutation<FinanceCounterparty, { id: string; version: number }>(
      action('verify'),
    ),
    archiveFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      { id: string; version: number }
    >(action('archive')),
    restoreFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      { id: string; version: number }
    >(action('restore')),
    /** Moves every operation of `id` to `targetId` and archives `id`; returns the target. */
    mergeFinanceCounterparty: build.mutation<
      FinanceCounterparty,
      { id: string; version: number; targetId: string; targetVersion: number }
    >({
      query: ({ id, ...body }) => ({ url: `${one(id)}/merge`, method: 'POST', body }),
      transformResponse: mapFinanceCounterparty,
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error, { id, targetId }) =>
        error
          ? []
          : [...financeCounterpartyTags, financeHistoryTag(id), financeHistoryTag(targetId)],
    }),
    getFinanceCounterpartyHistory: build.query<FinanceHistoryEntry[], string>({
      query: (id) => ({ url: `${one(id)}/history` }),
      transformResponse: mapFinanceHistory,
      transformErrorResponse: accountingApiError,
      providesTags: (_, __, id) => [financeHistoryTag(id)],
    }),
  };
}
