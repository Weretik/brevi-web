import type { LedgerScope } from '../categories/finance-category';
import type { MovementSource, MovementStatus } from '../movements/finance-movement';

/** A row of «Перекази»: money moved between two own accounts of one currency. */
export interface FinanceTransfer {
  id: string;
  /** YYYY-MM-DD. */
  date: string;
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  amountMinor: number;
  currency: string;
  note: string;
  source: MovementSource;
  scope: LedgerScope;
  status: MovementStatus;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceTransferTotal {
  currency: string;
  amountMinor: number;
}

export interface FinanceTransferPage {
  items: FinanceTransfer[];
  total: number;
  page: number;
  pageSize: number;
  totals: FinanceTransferTotal[];
}

/** Body of an update; a create adds `scope` and has no `version`. */
export interface FinanceTransferBody {
  date: string;
  fromAccountId: string;
  toAccountId: string;
  amountMinor: number;
  note: string | null;
}
