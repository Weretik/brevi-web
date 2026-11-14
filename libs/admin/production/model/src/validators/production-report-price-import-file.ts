import type { ImportFileResult } from './production-import-file';
import type { ProductionReportPriceImportRow } from '../entities/orders/production-tracking';

const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';
const isPrice = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;
const isPosition = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

/**
 * production-report-prices.json: the КП price of each item of the orders moved from the old
 * «Цех». Only the shape is checked here and only the fields the server takes are sent.
 */
export function parseProductionReportPriceImportFile(
  text: string,
): ImportFileResult<ProductionReportPriceImportRow> {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { rows: [], error: 'Файл не схожий на JSON.' };
  }
  if (!Array.isArray(value) || value.length === 0)
    return { rows: [], error: 'У файлі немає завдань.' };
  const rows: ProductionReportPriceImportRow[] = [];
  for (const [index, item] of value.entries()) {
    const row = (item ?? {}) as Record<string, unknown>;
    const items = row['items'];
    if (!isText(row['legacyId']) || !Array.isArray(items))
      return { rows: [], error: `Рядок ${index + 1}: потрібні legacyId і items.` };
    const prices: ProductionReportPriceImportRow['items'] = [];
    for (const entry of items) {
      const price = (entry ?? {}) as Record<string, unknown>;
      if (!isPosition(price['position']) || !isPrice(price['unitPrice']))
        return {
          rows: [],
          error: `Рядок ${index + 1}: кожна позиція має position і ціну більшу за нуль.`,
        };
      prices.push({ position: price['position'], unitPrice: price['unitPrice'] });
    }
    rows.push({ legacyId: row['legacyId'], items: prices });
  }
  return { rows, error: null };
}
