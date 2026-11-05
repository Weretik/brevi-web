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
} from '../../mappers/accounting.mapper';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
import type {
  FinanceCategory,
  FinanceCategoryCreateBody,
  FinanceCategoryUpdateBody,
  FinanceHistoryEntry,
} from '@admin/accounting/model';

const categories = '/api/accounting/categories';
const one = (id: string) => `${categories}/${encodeURIComponent(id)}`;

export function financeCategoryEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** Both areas of the books; the page switches them with tabs. */
    getFinanceCategories: build.query<FinanceCategory[], void>({
      query: () => ({ url: categories }),
      transformResponse: mapFinanceCategories,
      transformErrorResponse: accountingApiError,
      providesTags: [financeCategoriesTag],
    }),
    createFinanceCategory: build.mutation<FinanceCategory, FinanceCategoryCreateBody>({
      query: (body) => ({ url: categories, method: 'POST', body }),
      transformResponse: mapFinanceCategory,
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error) => (error ? [] : [financeCategoriesTag]),
    }),
    updateFinanceCategory: build.mutation<
      FinanceCategory,
      { id: string; body: FinanceCategoryUpdateBody }
    >({
      query: ({ id, body }) => ({ url: one(id), method: 'PUT', body }),
      transformResponse: mapFinanceCategory,
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error, { id }) =>
        error ? [] : [financeCategoriesTag, financeHistoryTag(id), financeTransactionsTag],
    }),
    /** A root goes with its subcategories; a used branch is switched off instead. */
    deleteFinanceCategory: build.mutation<void, { id: string; version: number }>({
      query: ({ id, version }) => ({ url: one(id), method: 'DELETE', params: { version } }),
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error) => (error ? [] : [financeCategoriesTag, financeTransactionsTag]),
    }),
    getFinanceCategoryHistory: build.query<FinanceHistoryEntry[], string>({
      query: (id) => ({ url: `${one(id)}/history` }),
      transformResponse: mapFinanceHistory,
      transformErrorResponse: accountingApiError,
      providesTags: (_, __, id) => [financeHistoryTag(id)],
    }),
  };
}
