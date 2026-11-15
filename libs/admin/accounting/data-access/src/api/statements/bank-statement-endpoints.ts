import { apiCall, apiClient, formDataBody } from '@admin/shared/api-client';

import {
  bankStatementsTag,
  bankStatementTag,
  financeCounterpartyTags,
  financeMovementTags,
} from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapBankStatement,
  mapBankStatementDetails,
  mapBankStatementLine,
  mapBankStatements,
} from '../../mappers/imports/accounting-statement.mapper';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type {
  BankLineState,
  BankStatement,
  BankStatementDetails,
  BankStatementLine,
  BankStatementLineBody,
} from '@admin/accounting/model';

export function bankStatementEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** «Історія виписок»: the last 100 uploads of every account. */
    getBankStatements: build.query<BankStatement[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/statements', { signal }),
          mapBankStatements,
          accountingApiError,
        ),
      providesTags: [bankStatementsTag],
    }),
    /** A statement with one page of its lines; `state` filters the lines. */
    getBankStatement: build.query<
      BankStatementDetails,
      { id: string; state: BankLineState | null; page: number }
    >({
      queryFn: ({ id, state, page }, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/statements/{id}', {
            params: { path: { id: id }, query: state ? { state, page } : { page } },
            signal,
          }),
          mapBankStatementDetails,
          accountingApiError,
        ),
      providesTags: (_, __, { id }) => [bankStatementTag(id)],
    }),
    /** «Завантажити виписку»: reads the file into a preview; nothing reaches the books yet. */
    uploadBankStatement: build.mutation<BankStatement, { accountId: string; file: File }>({
      queryFn: ({ accountId, file }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/statements', {
            ...formDataBody({ accountId, file }),
            signal,
          }),
          mapBankStatement,
          accountingApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [bankStatementsTag]),
    }),
    updateBankStatementLine: build.mutation<
      BankStatementLine,
      { statementId: string; lineId: string; body: BankStatementLineBody }
    >({
      queryFn: ({ statementId, lineId, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/accounting/statements/{id}/lines/{lineId}', {
            params: { path: { id: statementId, lineId: lineId } },
            body: body,
            signal,
          }),
          mapBankStatementLine,
          accountingApiError,
        ),
      invalidatesTags: (_, error, { statementId }) =>
        error ? [] : [bankStatementTag(statementId)],
    }),
    /** «Провести виписку»: operations, transfers and new finance counterparties in one save. */
    bookBankStatement: build.mutation<BankStatement, { id: string; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/statements/{id}/book', {
            params: { path: { id: id } },
            body: { version },
            signal,
          }),
          mapBankStatement,
          accountingApiError,
        ),
      invalidatesTags: (_, error, { id }) =>
        error
          ? [bankStatementTag(id)]
          : [
              bankStatementsTag,
              bankStatementTag(id),
              ...financeMovementTags,
              ...financeCounterpartyTags,
            ],
    }),
    /** «Відкотити виписку»: cancels what the statement booked; it becomes a preview again. */
    rollbackBankStatement: build.mutation<BankStatement, { id: string; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.POST('/api/accounting/statements/{id}/rollback', {
            params: { path: { id: id } },
            body: { version },
            signal,
          }),
          mapBankStatement,
          accountingApiError,
        ),
      invalidatesTags: (_, error, { id }) =>
        error
          ? [bankStatementTag(id)]
          : [
              bankStatementsTag,
              bankStatementTag(id),
              ...financeMovementTags,
              ...financeCounterpartyTags,
            ],
    }),
  };
}
