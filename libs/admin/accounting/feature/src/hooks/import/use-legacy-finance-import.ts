import { useImportLegacyFinanceMutation } from '@admin/accounting/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { LegacyFinanceImportReport } from '@admin/accounting/model';

/**
 * «Перенесення архіву»: pick finance.json → the server checks it → «Перенести» after a confirmation. The move is
 * offered only when the check has no errors and something is left to add.
 */
export function useLegacyFinanceImport() {
  const [send] = useImportLegacyFinanceMutation();
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<LegacyFinanceImportReport | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [running, setRunning] = useState<'check' | 'move' | null>(null);

  async function run(next: File, dryRun: boolean) {
    setRunning(dryRun ? 'check' : 'move');
    setMessage(null);
    try {
      setReport(await send({ file: next, dryRun }).unwrap());
    } catch (error) {
      if (dryRun) setReport(null);
      setMessage(
        adminApiErrorMessage(
          error,
          dryRun ? 'Не вдалося перевірити файл.' : 'Не вдалося перенести архів.',
        ),
      );
    } finally {
      setRunning(null);
    }
  }

  const toAdd = report ? report.counts.reduce((sum, row) => sum + row.toAdd, 0) : 0;
  return {
    file,
    report,
    message,
    running,
    toAdd,
    canMove: Boolean(report && !report.applied && report.canApply && toAdd > 0 && file),
    pick: (next: File) => {
      setFile(next);
      void run(next, true);
    },
    move: () => (file ? run(file, false) : Promise.resolve()),
  };
}
