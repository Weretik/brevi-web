import { useImportPriceFilesMutation } from '@admin/references/data-access';
import { sortPriceImportRows } from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type { PriceImportResult, PriceSource } from '@admin/references/model';

/**
 * File upload of a file supplier: «Перевірити» previews with the chosen files, «Застосувати» sends the same files
 * again to save the changed prices (CAT-017 R-07).
 */
export function usePriceFileImport(
  source: PriceSource,
  onApplied: (result: PriceImportResult) => void,
) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<PriceImportResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [send, state] = useImportPriceFilesMutation();
  const fileCountError =
    files.length > 0 && files.length !== source.fileCount
      ? source.fileCount === 1
        ? 'Оберіть один файл.'
        : `Оберіть рівно ${source.fileCount} файли.`
      : null;

  async function run(dryRun: boolean) {
    if (state.isLoading || files.length !== source.fileCount) return;
    setMessage(null);
    try {
      const result = await send({ key: source.key, files, dryRun }).unwrap();
      const sorted = { ...result, rows: sortPriceImportRows(result.rows) };
      setPreview(dryRun ? sorted : null);
      if (!dryRun) {
        setFiles([]);
        onApplied(sorted);
      }
    } catch (failure) {
      const reasons = isAdminApiError(failure) ? Object.values(failure.fieldErrors) : [];
      setMessage(
        reasons.length > 0
          ? reasons.join(' ')
          : adminApiErrorMessage(failure, 'Не вдалося прочитати файли. Спробуйте ще раз.'),
      );
    }
  }

  return {
    files,
    preview,
    message,
    fileCountError,
    sending: state.isLoading,
    choose: (chosen: File[]) => {
      setFiles(chosen);
      setPreview(null);
      setMessage(null);
    },
    check: () => run(true),
    apply: () => run(false),
  };
}
