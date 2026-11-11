import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { OldSiteImportItems, OldSiteImportOptions } from '@admin/content/model';

const noOptions: OldSiteImportOptions = { showOnSite: false, overwrite: false };

type FileRead = { ok: true; items: OldSiteImportItems } | { ok: false; message: string };

interface Transfer<TReport> {
  read: (content: string) => FileRead;
  send: (
    request: OldSiteImportOptions & { items: OldSiteImportItems; dryRun: boolean },
  ) => Promise<TReport>;
  /** True when «Перенести» would change something. */
  changes: (report: TReport) => boolean;
  failure: string;
}

/**
 * Transfer from the old site: pick the file → the server counts what would happen → «Перенести».
 * Changing an option counts again, so the numbers always match what «Перенести» will do.
 */
export function useOldSiteTransfer<TReport extends { dryRun: boolean }>({
  read,
  send,
  changes,
  failure,
}: Transfer<TReport>) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<{ name: string; items: OldSiteImportItems } | null>(null);
  const [options, setOptions] = useState(noOptions);
  const [report, setReport] = useState<TReport | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [running, setRunning] = useState<'check' | 'transfer' | null>(null);

  async function run(items: OldSiteImportItems, next: OldSiteImportOptions, dryRun: boolean) {
    setRunning(dryRun ? 'check' : 'transfer');
    setMessage(null);
    try {
      setReport(await send({ items, dryRun, ...next }));
    } catch (error) {
      if (dryRun) setReport(null);
      setMessage(adminApiErrorMessage(error, dryRun ? 'Не вдалося перевірити файл.' : failure));
    } finally {
      setRunning(null);
    }
  }

  async function pick(next: File) {
    setReport(null);
    const found = read(await next.text());
    if (!found.ok) {
      setFile(null);
      setMessage(found.message);
      return;
    }
    setFile({ name: next.name, items: found.items });
    await run(found.items, options, true);
  }

  return {
    open,
    fileName: file?.name ?? null,
    options,
    report,
    message,
    running,
    canTransfer: Boolean(file && report?.dryRun && changes(report)),
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
