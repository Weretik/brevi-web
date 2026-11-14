import type { ImportFileResult } from './production-import-file';
import type { ProductionWorkImportFile } from '../entities/work/production-work';

/**
 * production-work.json from the old «Цех»: one object with the work records.
 * Only the shape is checked here; the server matches items and workers in the preview.
 */
export function parseProductionWorkImportFile(
  text: string,
): ImportFileResult<ProductionWorkImportFile> {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { rows: [], error: 'Файл не схожий на JSON.' };
  }
  const rows = ((value ?? {}) as Record<string, unknown>)['rows'];
  if (!Array.isArray(rows)) return { rows: [], error: 'Потрібен список rows.' };
  if (rows.length === 0) return { rows: [], error: 'У файлі немає записів роботи.' };
  return { rows: [{ rows }], error: null };
}
