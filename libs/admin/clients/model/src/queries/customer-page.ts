import type { CustomerSummary } from '../entities/customers/customer-summary';

export interface CustomerPage {
  readonly rows: readonly CustomerSummary[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}
