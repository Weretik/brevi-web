import {
  financeHistoryTag,
  financeMovementTags,
  financeTransfersTag,
} from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapFinanceTransfer,
  mapFinanceTransferPage,
} from '../../mappers/accounting-movement.mapper';
import { mapFinanceHistory } from '../../mappers/accounting.mapper';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
import type {
  FinanceHistoryEntry,
  FinanceTransfer,
  FinanceTransferBody,
  FinanceTransferPage,
  LedgerScope,
} from '@admin/accounting/model';

const transfers = '/api/accounting/transfers';
const one = (id: string) => `${transfers}/${encodeURIComponent(id)}`;

const changed = (_: unknown, error: unknown, { id }: { id: string }) =>
  error ? [] : [...financeMovementTags, financeHistoryTag(id)];

export function financeTransferEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** One page of «Перекази»; build the params with `financeTransferParams`. */
    getFinanceTransfers: build.query<
      FinanceTransferPage,
      Record<string, string | number | boolean>
    >({
      query: (params) => ({ url: transfers, params }),
      transformResponse: mapFinanceTransferPage,
      transformErrorResponse: accountingApiError,
      providesTags: [financeTransfersTag],
    }),
    createFinanceTransfer: build.mutation<
      FinanceTransfer,
      FinanceTransferBody & { scope: LedgerScope }
    >({
      query: (body) => ({ url: transfers, method: 'POST', body }),
      transformResponse: mapFinanceTransfer,
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error) => (error ? [] : financeMovementTags),
    }),
    updateFinanceTransfer: build.mutation<
      FinanceTransfer,
      { id: string; body: FinanceTransferBody & { version: number } }
    >({
      query: ({ id, body }) => ({ url: one(id), method: 'PUT', body }),
      transformResponse: mapFinanceTransfer,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    voidFinanceTransfer: build.mutation<FinanceTransfer, { id: string; version: number }>({
      query: ({ id, version }) => ({ url: `${one(id)}/void`, method: 'POST', body: { version } }),
      transformResponse: mapFinanceTransfer,
      transformErrorResponse: accountingApiError,
      invalidatesTags: changed,
    }),
    getFinanceTransferHistory: build.query<FinanceHistoryEntry[], string>({
      query: (id) => ({ url: `${one(id)}/history` }),
      transformResponse: mapFinanceHistory,
      transformErrorResponse: accountingApiError,
      providesTags: (_, __, id) => [financeHistoryTag(id)],
    }),
  };
}
