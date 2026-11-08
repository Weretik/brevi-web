import { financeTransactionsTag, financeTransfersTag } from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import { mapFinanceAuditPage, mapFinanceReport } from '../../mappers/accounting-report.mapper';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
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
      query: (params) => ({ url: '/api/accounting/reports', params }),
      transformResponse: mapFinanceReport,
      transformErrorResponse: accountingApiError,
      providesTags: [financeTransactionsTag, financeTransfersTag],
    }),
    /** «Журнал змін» of all records, newest first. */
    getFinanceAudit: build.query<
      FinanceAuditPage,
      { entity: AuditEntity | null; action: AuditAction | null; page: number }
    >({
      query: ({ entity, action, page }) => ({
        url: '/api/accounting/audit',
        params: {
          page,
          ...(entity ? { entity } : {}),
          ...(action ? { action } : {}),
        },
      }),
      transformResponse: mapFinanceAuditPage,
      transformErrorResponse: accountingApiError,
    }),
  };
}
