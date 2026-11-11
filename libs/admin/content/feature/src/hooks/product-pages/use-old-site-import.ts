import { useImportOldSiteProductPagesMutation } from '@admin/content/data-access';
import { readOldSiteImportFile } from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  OldSiteImportItems,
  OldSiteImportOptions,
  OldSiteImportReport,
} from '@admin/content/model';

const noOptions: OldSiteImportOptions = { showOnSite: false, overwrite: false };

/**
 * Transfer of old-site texts: pick the file → the server counts what would happen → «Перенести».
 * Changing an option counts again, so the numbers always match what «Перенести» will do.
 */
export function useOldSiteImport() {
  const [send] = useImportOldSiteProductPagesMutation();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<{ name: string; items: OldSiteImportItems } | null>(null);
  const [options, setOptions] = useState(noOptions);
  const [report, setReport] = useState<OldSiteImportReport | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [running, setRunning] = useState<'check' | 'transfer' | null>(null);

  async function run(items: OldSiteImportItems, next: OldSiteImportOptions, dryRun: boolean) {
    setRunning(dryRun ? 'check' : 'transfer');
    setMessage(null);
    try {
      setReport(await send({ items, dryRun, ...next }).unwrap());
    } catch (error) {
      if (dryRun) setReport(null);
      setMessage(
        adminApiErrorMessage(
          error,
          dryRun ? 'Не вдалося перевірити файл.' : 'Не вдалося перенести тексти.',
        ),
      );
    } finally {
      setRunning(null);
    }
  }

  async function pick(next: File) {
    setReport(null);
    const read = readOldSiteImportFile(await next.text());
    if (!read.ok) {
      setFile(null);
      setMessage(read.message);
      return;
    }
    setFile({ name: next.name, items: read.items });
    await run(read.items, options, true);
  }

  return {
    open,
    fileName: file?.name ?? null,
    options,
    report,
    message,
    running,
    canTransfer: Boolean(file && report?.dryRun && report.created + report.updated > 0),
    start: () => setOpen(true),
    close: () => {
      setOpen(false);
      setFile(null);
      setOptions(noOptions);
      setReport(null);
      setMessage(null);
    },
    pick: (next: File) => void pick(next),
    setOptions: (next: OldSiteImportOptions) => {
      setOptions(next);
      if (file) void run(file.items, next, true);
    },
    transfer: () => (file ? void run(file.items, options, false) : undefined),
  };
}
