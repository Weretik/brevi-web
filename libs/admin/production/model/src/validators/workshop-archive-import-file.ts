import type { ImportFileResult } from './production-import-file';
import type { WorkshopArchiveImportRow } from '../entities/reports/workshop-archive';

const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

/**
 * workshop-archive.json: lines of the old «Графік роботи» and the old requests. Only the shape is
 * checked here; the server checks the values in the preview.
 */
export function parseWorkshopArchiveImportFile(
  text: string,
): ImportFileResult<WorkshopArchiveImportRow> {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { rows: [], error: 'Файл не схожий на JSON.' };
  }
  if (!Array.isArray(value) || value.length === 0)
    return { rows: [], error: 'У файлі немає рядків.' };
  for (const [index, item] of value.entries()) {
    const row = (item ?? {}) as Record<string, unknown>;
    if (
      !isText(row['kind']) ||
      !isText(row['sourceKey']) ||
      typeof row['sourceRow'] !== 'number' ||
      !Array.isArray(row['fields']) ||
      !Array.isArray(row['links'])
    )
      return {
        rows: [],
        error: `Рядок ${index + 1}: потрібні kind, sourceKey, sourceRow, fields і links.`,
      };
  }
  return { rows: value as WorkshopArchiveImportRow[], error: null };
}
