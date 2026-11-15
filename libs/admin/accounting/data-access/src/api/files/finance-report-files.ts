import { apiClient, apiRequest } from '@admin/shared/api-client';

/** The report as an Excel-ready CSV file; `params` come from `financeReportParams`. */
export function fetchFinanceReportCsv(params: Record<string, string>): Promise<Blob> {
  return apiRequest(
    apiClient.GET('/api/accounting/reports/csv', { params: { query: params }, parseAs: 'blob' }),
  );
}

/** «Резервна копія»: every finance record in one JSON file. */
export function fetchFinanceExport(): Promise<Blob> {
  return apiRequest(apiClient.GET('/api/accounting/export', { parseAs: 'blob' }));
}
