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
} from '../../mappers/accounting-statement.mapper';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
import type {
  BankLineState,
  BankStatement,
  BankStatementDetails,
  BankStatementLine,
  BankStatementLineBody,
} from '@admin/accounting/model';

const statements = '/api/accounting/statements';
const one = (id: string) => `${statements}/${encodeURIComponent(id)}`;

export function bankStatementEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** «Історія виписок»: the last 100 uploads of every account. */
    getBankStatements: build.query<BankStatement[], void>({
      query: () => statements,
      transformResponse: mapBankStatements,
      transformErrorResponse: accountingApiError,
      providesTags: [bankStatementsTag],
    }),
    /** A statement with one page of its lines; `state` filters the lines. */
    getBankStatement: build.query<
      BankStatementDetails,
      { id: string; state: BankLineState | null; page: number }
    >({
      query: ({ id, state, page }) => ({
        url: one(id),
        params: state ? { state, page } : { page },
      }),
      transformResponse: mapBankStatementDetails,
      transformErrorResponse: accountingApiError,
      providesTags: (_, __, { id }) => [bankStatementTag(id)],
    }),
    /** «Завантажити виписку»: reads the file into a preview; nothing reaches the books yet. */
    uploadBankStatement: build.mutation<BankStatement, { accountId: string; file: File }>({
      query: ({ accountId, file }) => {
        const body = new FormData();
        body.append('accountId', accountId);
        body.append('file', file, file.name);
        return { url: statements, method: 'POST', body };
      },
      transformResponse: mapBankStatement,
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error) => (error ? [] : [bankStatementsTag]),
    }),
    updateBankStatementLine: build.mutation<
      BankStatementLine,
      { statementId: string; lineId: string; body: BankStatementLineBody }
    >({
      query: ({ statementId, lineId, body }) => ({
        url: `${one(statementId)}/lines/${encodeURIComponent(lineId)}`,
        method: 'PUT',
        body,
      }),
      transformResponse: mapBankStatementLine,
      transformErrorResponse: accountingApiError,
      invalidatesTags: (_, error, { statementId }) =>
        error ? [] : [bankStatementTag(statementId)],
    }),
    /** «Провести виписку»: operations, transfers and new finance counterparties in one save. */
    bookBankStatement: build.mutation<BankStatement, { id: string; version: number }>({
      query: ({ id, version }) => ({ url: `${one(id)}/book`, method: 'POST', body: { version } }),
      transformResponse: mapBankStatement,
      transformErrorResponse: accountingApiError,
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
