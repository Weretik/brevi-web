import { useImportEmbroideryArchiveMutation } from '@admin/embroidery/data-access';
import { parseEmbroideryArchiveFile } from '@admin/embroidery/model';
import { useState } from 'react';

import type { EmbroideryArchiveResult, EmbroideryArchiveRow } from '@admin/embroidery/model';

/** Transfer file → check on the server (dryRun) → import; the check must have no errors. */
export function useEmbroideryArchiveImport() {
  const [send] = useImportEmbroideryArchiveMutation();
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<EmbroideryArchiveRow[]>([]);
  const [result, setResult] = useState<EmbroideryArchiveResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(nextRows: EmbroideryArchiveRow[], dryRun: boolean) {
    setBusy(true);
    setMessage(null);
    const response = await send({ rows: nextRows, dryRun });
    setBusy(false);
    if ('data' in response && response.data) setResult(response.data);
    else {
      setResult(null);
      setMessage(
        (response.error as { message?: string } | undefined)?.message ??
          'Не вдалося перевірити файл.',
      );
    }
  }

  async function pick(file: File) {
    setFileName(file.name);
    setResult(null);
    const parsed = parseEmbroideryArchiveFile(await file.text());
    setRows(parsed.rows);
    if (parsed.error) setMessage(parsed.error);
    else await run(parsed.rows, true);
  }

  return {
    fileName,
    result,
    message,
    busy,
    canImport: Boolean(result?.dryRun && result.errors === 0 && result.created > 0),
    done: Boolean(result && !result.dryRun),
    pick,
    apply: () => run(rows, false),
  };
}
