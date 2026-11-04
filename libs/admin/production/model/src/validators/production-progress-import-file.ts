import type { ImportFileResult } from './production-import-file';
import type { ProductionProgressImportRow } from '../entities/production-tracking';

const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

/**
 * production-progress.json from the old «Цех»: stages, file links and Telegram marks of moved
 * orders. Only the shape is checked here; the server checks the values in the preview.
 */
export function parseProductionProgressImportFile(
  text: string,
): ImportFileResult<ProductionProgressImportRow> {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { rows: [], error: 'Файл не схожий на JSON.' };
  }
  if (!Array.isArray(value) || value.length === 0)
    return { rows: [], error: 'У файлі немає завдань.' };
  for (const [index, item] of value.entries()) {
    const row = (item ?? {}) as Record<string, unknown>;
    if (
      !isText(row['legacyId']) ||
      !Array.isArray(row['items']) ||
      !Array.isArray(row['files']) ||
      typeof row['telegramSent'] !== 'boolean'
    )
      return {
        rows: [],
        error: `Рядок ${index + 1}: потрібні legacyId, items, files і telegramSent.`,
      };
  }
  return { rows: value as ProductionProgressImportRow[], error: null };
}
