import type { CategoryDirection, LedgerScope } from '../categories/finance-category';
import type {
  FinanceCounterpartyLink,
  FinanceCounterpartyRef,
} from '../counterparties/finance-counterparty';
import type {
  MovementSource,
  MovementStatus,
  VerificationStatus,
} from '../movements/finance-movement';

export const transactionTypeLabels: Record<CategoryDirection, string> = {
  Income: 'Дохід',
  Expense: 'Витрата',
};

/** A row of «Операції»: `amountMinor` is positive kopecks, `type` gives the sign. */
export interface FinanceTransaction {
  id: string;
  /** YYYY-MM-DD. */
  date: string;
  type: CategoryDirection;
  accountId: string;
  accountName: string;
  amountMinor: number;
  currency: string;
  /** The chosen category: a subcategory or a root. */
  categoryId: string | null;
  categoryRootId: string | null;
  categoryRootName: string | null;
  /** Only when a subcategory was chosen. */
  subcategoryName: string | null;
  /** The chosen counterparty; null with an optional one-off name. */
  counterparty: FinanceCounterpartyRef | null;
  oneoffName: string;
  description: string;
  comment: string;
  source: MovementSource;
  verification: VerificationStatus;
  scope: LedgerScope;
  status: MovementStatus;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceTransactionTotal {
  currency: string;
  incomeMinor: number;
  expenseMinor: number;
  differenceMinor: number;
}

/** One page of 50; totals cover the whole filtered selection without cancelled rows. */
export interface FinanceTransactionPage {
  items: FinanceTransaction[];
  total: number;
  page: number;
  pageSize: number;
  totals: FinanceTransactionTotal[];
}

/** Body of an update; a create adds `scope` and has no `version`. */
export interface FinanceTransactionBody {
  date: string;
  type: CategoryDirection;
  accountId: string;
  amountMinor: number;
  categoryId: string;
  /** Cannot go together with `oneoffName`. */
  counterparty: FinanceCounterpartyLink | null;
  oneoffName: string | null;
  description: string | null;
  comment: string | null;
}

/** «Перевірити»: the category and who the operation is with. */
export interface FinanceTransactionReviewBody {
  categoryId: string;
  counterparty: FinanceCounterpartyLink | null;
  oneoffName: string | null;
  version: number;
}
