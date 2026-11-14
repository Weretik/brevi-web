import type { ImportFileResult } from './production-import-file';
import type { ProductionOrderImportRow, ProductionOrderStatus } from '../entities/orders/production-order';

const statuses: readonly ProductionOrderStatus[] = ['New', 'Closed', 'Cancelled'];

const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

/**
 * production-orders.json from the old «Цех»: orders with their items. Only the shape is checked
 * here; the server checks the values and shows every problem in the preview.
 */
export function parseProductionOrderImportFile(
  text: string,
): ImportFileResult<ProductionOrderImportRow> {
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
      typeof row['number'] !== 'number' ||
      !isText(row['clientName']) ||
      !statuses.includes(row['status'] as ProductionOrderStatus) ||
      !Array.isArray(row['items']) ||
      row['items'].length === 0
    )
      return {
        rows: [],
        error: `Завдання ${index + 1}: потрібні legacyId, number, clientName, status і позиції.`,
      };
  }
  return { rows: value as ProductionOrderImportRow[], error: null };
}
