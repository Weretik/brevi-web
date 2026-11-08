import type { LedgerScope } from '../categories/finance-category';
import type { MovementStatus } from '../movements/finance-movement';

export const legacyImportKinds = [
  'Accounts',
  'Categories',
  'Counterparties',
  'Transactions',
  'Transfers',
  'AuditEntries',
] as const;
export type LegacyImportKind = (typeof legacyImportKinds)[number];

export const legacyImportKindLabels: Record<LegacyImportKind, string> = {
  Accounts: 'Рахунки і каси',
  Categories: 'Категорії',
  Counterparties: 'Фінансові контрагенти',
  Transactions: 'Операції',
  Transfers: 'Перекази',
  AuditEntries: 'Записи журналу змін',
};

export const legacyImportMovements = ['Income', 'Expense', 'Transfer'] as const;
export type LegacyImportMovement = (typeof legacyImportMovements)[number];

export const legacyImportMovementLabels: Record<LegacyImportMovement, string> = {
  Income: 'Доходи',
  Expense: 'Витрати',
  Transfer: 'Перекази',
};

/** The finance.json export of the old Calculator; the browser gzips it before sending. */
export const legacyFinanceFileLimits = { accept: '.json,application/json' } as const;

/** Records of one kind: in the file, to add, moved earlier (same id), left out on purpose. */
export interface LegacyImportCount {
  kind: LegacyImportKind;
  inFile: number;
  toAdd: number;
  alreadyMoved: number;
  skipped: number;
}

/** How old clients and suppliers used in operations are linked to Brevi. */
export interface LegacyImportParties {
  clientsLinked: number;
  clientsAsFinancial: number;
  suppliersLinked: number;
  suppliersAsFinancial: number;
  unused: number;
}

export interface LegacyImportTotal {
  scope: LedgerScope;
  movement: LegacyImportMovement;
  status: MovementStatus;
  currency: string;
  count: number;
  amountMinor: number;
}

/** An account after the move, counted from the file. */
export interface LegacyImportBalance {
  accountId: string;
  name: string;
  currency: string;
  active: boolean;
  /** On 30.09.2026: opening balance plus active archive movements. */
  archiveMinor: number;
  /** Confirmed balance on 01.10.2026; null while not confirmed. */
  cutoverMinor: number | null;
  /** Today: confirmed balance plus the current books; null while not confirmed. */
  currentMinor: number | null;
  /** Confirmed minus archive balance when they differ. */
  differenceMinor: number | null;
}

/** What the move of the old «Фінанси» finds (a check) or did (`applied`). */
export interface LegacyFinanceImportReport {
  applied: boolean;
  canApply: boolean;
  exportedAt: string | null;
  counts: LegacyImportCount[];
  parties: LegacyImportParties;
  totals: LegacyImportTotal[];
  balances: LegacyImportBalance[];
  errorCount: number;
  /** The first 100 errors. */
  errors: string[];
  warnings: string[];
}
