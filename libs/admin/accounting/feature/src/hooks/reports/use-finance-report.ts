import {
  fetchFinanceExport,
  fetchFinanceReportCsv,
  useGetFinanceReportQuery,
} from '@admin/accounting/data-access';
import {
  defaultFinanceReportFilter,
  financeExportFileName,
  financeReportFileName,
  financeReportFilterProblem,
  financeReportParams,
} from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { saveFinanceFile } from '../files/save-finance-file';

import type { FinanceReportFilter } from '@admin/accounting/model';

/**
 * «Звіти»: the form, the built report (fixed by «Сформувати звіт», so editing the form does not
 * change it or its CSV) and the two downloads.
 */
export function useFinanceReport(today: string, cutoverDate: string) {
  const [draft, setDraft] = useState<FinanceReportFilter | null>(null);
  const [applied, setApplied] = useState<FinanceReportFilter | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<'csv' | 'json' | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const form = draft ?? defaultFinanceReportFilter(today, cutoverDate);

  const query = useGetFinanceReportQuery(applied ? financeReportParams(applied) : skipToken);
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося сформувати звіт.')
    : null;

  function apply() {
    const message = financeReportFilterProblem(form);
    setProblem(message);
    if (!message) setApplied(form);
  }

  async function download(kind: 'csv' | 'json') {
    setDownloading(kind);
    setDownloadError(null);
    try {
      if (kind === 'csv' && applied)
        saveFinanceFile(
          await fetchFinanceReportCsv(financeReportParams(applied)),
          financeReportFileName(applied.kind, applied.from, applied.to),
        );
      else if (kind === 'json')
        saveFinanceFile(await fetchFinanceExport(), financeExportFileName(today));
    } catch (failure) {
      setDownloadError(
        adminApiErrorMessage(
          failure,
          kind === 'csv' ? 'Не вдалося завантажити CSV.' : 'Не вдалося завантажити резервну копію.',
        ),
      );
    } finally {
      setDownloading(null);
    }
  }

  return {
    form,
    setForm: setDraft,
    applied,
    problem,
    apply,
    report: applied ? (query.data ?? null) : null,
    loading: query.isLoading || query.isFetching,
    error,
    retry: () => void query.refetch(),
    downloading,
    downloadError,
    clearDownloadError: () => setDownloadError(null),
    downloadCsv: () => void download('csv'),
    downloadBackup: () => void download('json'),
  };
}
