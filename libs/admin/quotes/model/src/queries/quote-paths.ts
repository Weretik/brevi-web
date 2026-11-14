import type { QuoteKind } from '../entities/quote';

/** Where a saved КП is edited: «Товари та ціни» or «КП для знайомства». */
export function quoteEditorPath(kind: QuoteKind, id: number): string {
  return kind === 'Introduction' ? `/crm/quote-introductions/${id}` : `/crm/quotes/${id}`;
}
