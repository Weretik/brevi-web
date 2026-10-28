import type { QuoteSummary } from '../../entities/quotes/quote-summary';

export interface QuotePage {
  readonly rows: readonly QuoteSummary[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}
