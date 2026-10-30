export interface QuoteResultPage<T> {
  readonly rows: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}
