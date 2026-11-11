import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useTransferFabricStockMutation } from '@admin/warehouse/data-access';
import { readV133Export } from '@admin/warehouse/model';
import { useState } from 'react';

import type { StockTransferInput, StockTransferResult } from '@admin/warehouse/model';

/**
 * JSONL files of the D1 export → a check on the server (dry run, nothing is saved) → the transfer.
 * Records entered in Brevi itself are removed only after the confirmation is ticked.
 */
export function useStockTransfer() {
  const [transfer] = useTransferFabricStockMutation();
  const [fileCount, setFileCount] = useState(0);
  const [snapshot, setSnapshot] = useState('');
  const [input, setInput] = useState<StockTransferInput | null>(null);
  const [result, setResult] = useState<StockTransferResult | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(body: StockTransferInput, dryRun: boolean) {
    setBusy(true);
    setMessage(null);
    try {
      setResult(
        await transfer({ input: body, dryRun, confirmReplace: !dryRun && confirm }).unwrap(),
      );
    } catch (error) {
      setMessage(
        adminApiErrorMessage(
          error,
          dryRun ? 'Не вдалося перевірити вигрузку.' : 'Не вдалося перенести склад.',
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  async function pick(files: File[]) {
    setFileCount(files.length);
    setInput(null);
    setResult(null);
    setConfirm(false);
    setMessage(null);
    const read = readV133Export(
      await Promise.all(files.map(async (file) => ({ name: file.name, text: await file.text() }))),
      snapshot,
    );
    if (read.missing.length > 0) {
      setMessage(`Серед вибраних файлів немає: ${read.missing.join(', ')}.`);
      return;
    }
    if (read.error || !read.input) {
      setMessage(read.error);
      return;
    }
    setInput(read.input);
    await run(read.input, true);
  }

  const ready =
    input !== null &&
    result !== null &&
    !result.applied &&
    !result.unchanged &&
    result.errors.length === 0;

  return {
    fileCount,
    snapshot,
    setSnapshot,
    result,
    confirm,
    setConfirm,
    message,
    busy,
    needsConfirmation: ready && result.needsConfirmation,
    canApply: ready && (!result.needsConfirmation || confirm),
    done: Boolean(result?.applied),
    pick,
    apply: () => (input ? run({ ...input, snapshot: snapshot.trim() || null }, false) : undefined),
  };
}
