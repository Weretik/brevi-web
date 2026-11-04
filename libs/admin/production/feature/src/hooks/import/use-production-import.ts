import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ImportFileResult, ProductionImportResult } from '@admin/production/model';

type Send<Row> = (rows: Row[], dryRun: boolean) => Promise<ProductionImportResult>;

/** Transfer file → preview on the server (dryRun) → save; the preview must have no errors. */
export function useProductionImport<Row>(
  parse: (text: string) => ImportFileResult<Row>,
  send: Send<Row>,
) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [preview, setPreview] = useState<ProductionImportResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(nextRows: Row[], dryRun: boolean) {
    setBusy(true);
    setMessage(null);
    try {
      setPreview(await send(nextRows, dryRun));
    } catch (error) {
      setPreview(null);
      setMessage(adminApiErrorMessage(error, 'Не вдалося перевірити файл.'));
    } finally {
      setBusy(false);
    }
  }

  async function pick(file: File) {
    setFileName(file.name);
    setPreview(null);
    const parsed = parse(await file.text());
    setRows(parsed.rows);
    if (parsed.error) setMessage(parsed.error);
    else await run(parsed.rows, true);
  }

  return {
    fileName,
    preview,
    message,
    busy,
    canApply: Boolean(preview?.dryRun && preview.errors === 0 && rows.length > 0),
    done: Boolean(preview && !preview.dryRun),
    pick,
    apply: () => run(rows, false),
  };
}
