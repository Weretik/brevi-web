import { requestApiBlob } from '@admin/shared/api-client';

/** The report as an Excel-ready CSV file; `params` come from `financeReportParams`. */
export function fetchFinanceReportCsv(params: Record<string, string>): Promise<Blob> {
  return requestApiBlob({ url: '/api/accounting/reports/csv', params });
}

/** «Резервна копія»: every finance record in one JSON file. */
export function fetchFinanceExport(): Promise<Blob> {
  return requestApiBlob({ url: '/api/accounting/export' });
}
