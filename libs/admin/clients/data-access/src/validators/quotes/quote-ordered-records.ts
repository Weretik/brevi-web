import { quoteArray, quoteInteger, quoteRecord } from './quote-response-values';

export function quoteOrderedRecords(value: unknown, maximum: number): Record<string, unknown>[] {
  const entries = quoteArray(value, maximum).map((entry) => {
    const row = quoteRecord(entry);
    return { row, order: quoteInteger(row['sortOrder'], 0) };
  });
  if (new Set(entries.map((entry) => entry.order)).size !== entries.length)
    throw new Error('Повторні позиції порядку у версії КП.');
  return entries.sort((left, right) => left.order - right.order).map((entry) => entry.row);
}
