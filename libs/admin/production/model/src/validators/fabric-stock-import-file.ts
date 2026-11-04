import type { ImportFileResult } from './production-import-file';
import type { FabricStockImportFile } from '../entities/fabric-stock';

/**
 * fabric-stock.json from the old «Цех»: one object with stock lines, issues and old reservations.
 * Only the shape is checked here; the server checks every movement in the preview.
 */
export function parseFabricStockImportFile(text: string): ImportFileResult<FabricStockImportFile> {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { rows: [], error: 'Файл не схожий на JSON.' };
  }
  const file = (value ?? {}) as Record<string, unknown>;
  if (
    !Array.isArray(file['stocks']) ||
    !Array.isArray(file['issues']) ||
    !Array.isArray(file['oldReservations'])
  )
    return { rows: [], error: 'Потрібні stocks, issues і oldReservations.' };
  if (file['stocks'].length === 0) return { rows: [], error: 'У файлі немає рядків складу.' };
  return {
    rows: [
      {
        stocks: file['stocks'],
        issues: file['issues'],
        oldReservations: file['oldReservations'],
      },
    ],
    error: null,
  };
}
