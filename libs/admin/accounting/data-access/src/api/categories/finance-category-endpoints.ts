import { apiCall, apiClient } from '@admin/shared/api-client';

import {
  financeCategoriesTag,
  financeHistoryTag,
  financeTransactionsTag,
} from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapFinanceCategories,
  mapFinanceCategory,
  mapFinanceHistory,
} from '../../mappers/ledger/accounting.mapper';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type {
  FinanceCategory,
  FinanceCategoryCreateBody,
  FinanceCategoryUpdateBody,
  FinanceHistoryEntry,
} from '@admin/accounting/model';

export function financeCategoryEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** Both areas of the books; the page switches them with tabs. */
    getFinanceCategories: build.query<FinanceCategory[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/categories', { signal }),
          mapFinanceCategories,
          accountingApiError,
        ),
      providesTags: [financeCategoriesTag],
    }),
    createFinanceCategory: build.mutation<FinanceCategory, FinanceCategoryCreateBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/categories', { body: body, signal }),
          mapFinanceCategory,
          accountingApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [financeCategoriesTag]),
    }),
    updateFinanceCategory: build.mutation<
      FinanceCategory,
      { id: string; body: FinanceCategoryUpdateBody }
    >({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/accounting/categories/{id}', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          mapFinanceCategory,
          accountingApiError,
        ),
      invalidatesTags: (_, error, { id }) =>
        error ? [] : [financeCategoriesTag, financeHistoryTag(id), financeTransactionsTag],
    }),
    /** A root goes with its subcategories; a used branch is switched off instead. */
    deleteFinanceCategory: build.mutation<void, { id: string; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/accounting/categories/{id}', {
            params: { path: { id: id }, query: { version } },
            signal,
          }),
          undefined,
          accountingApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [financeCategoriesTag, financeTransactionsTag]),
    }),
    getFinanceCategoryHistory: build.query<FinanceHistoryEntry[], string>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/categories/{id}/history', {
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
