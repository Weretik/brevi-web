import { apiCall, apiClient } from '@admin/shared/api-client';

import { financeTransactionsTag, financeTransfersTag } from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import {
  mapFinanceAuditPage,
  mapFinanceReport,
} from '../../mappers/ledger/accounting-report.mapper';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type {
  AuditAction,
  AuditEntity,
  FinanceAuditPage,
  FinanceReport,
} from '@admin/accounting/model';

export function financeReportEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** «Звіти»; `params` come from `financeReportParams`. A movement change rebuilds it. */
    getFinanceReport: build.query<FinanceReport, Record<string, string>>({
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/reports', { params: { query: params }, signal }),
          mapFinanceReport,
          accountingApiError,
        ),
      providesTags: [financeTransactionsTag, financeTransfersTag],
    }),
    /** «Журнал змін» of all records, newest first. */
    getFinanceAudit: build.query<
      FinanceAuditPage,
      { entity: AuditEntity | null; action: AuditAction | null; page: number }
    >({
      queryFn: ({ entity, action, page }, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/audit', {
            params: {
              query: {
                page,
                ...(entity ? { entity } : {}),
                ...(action ? { action } : {}),
              },
            },
            signal,
          }),
          mapFinanceAuditPage,
          accountingApiError,
        ),
    }),
  };
}
