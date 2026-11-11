import { useImportOldSiteRedirectsMutation } from '@admin/content/data-access';
import { readRedirectImportFile } from '@admin/content/model';

import { useOldSiteTransfer } from '../old-site/use-old-site-transfer';

import type { OldSiteImportReport, RedirectImportReport } from '@admin/content/model';

/** The redirect report in the words of the shared transfer dialog: addresses without a page are listed. */
export function redirectTransferReport(report: RedirectImportReport): OldSiteImportReport {
  return {
    dryRun: report.dryRun,
    total: report.total,
    created: report.created,
    updated: report.updated,
    kept: report.kept,
    notMatched: report.rows
      .filter((row) => row.result === 'Unresolved')
      .map((row) => ({ url: row.fromPath, name: null, reason: row.note ?? '' })),
    problems: [],
  };
}

/** Transfer of the old-site addresses on «Переадресації»: check first, then one request. */
export function useOldSiteRedirectImport() {
  const [send] = useImportOldSiteRedirectsMutation();
  return useOldSiteTransfer<RedirectImportReport>({
    read: readRedirectImportFile,
    send: ({ items, dryRun, overwrite }) => send({ items, dryRun, overwrite }).unwrap(),
    changes: (report) => report.created + report.updated > 0,
    failure: 'Не вдалося перенести адреси. Нічого не змінено; спробуйте ще раз.',
  });
}
