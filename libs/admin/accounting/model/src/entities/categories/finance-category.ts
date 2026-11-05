export const categoryDirections = ['Expense', 'Income'] as const;
export type CategoryDirection = (typeof categoryDirections)[number];

export const categoryDirectionLabels: Record<CategoryDirection, string> = {
  Expense: 'Витрати',
  Income: 'Надходження',
};

export const ledgerScopes = ['Current', 'LegacyArchive'] as const;
/** Current: from 01.10.2026; LegacyArchive: «Домашня бухгалтерія» before it. */
export type LedgerScope = (typeof ledgerScopes)[number];

export const ledgerScopeLabels: Record<LedgerScope, string> = {
  Current: 'Поточний облік',
  LegacyArchive: 'Домашня бухгалтерія',
};

/** A category of «Категорії»; `parentId` is null for a root. */
export interface FinanceCategory {
  id: string;
  name: string;
  direction: CategoryDirection;
  scope: LedgerScope;
  parentId: string | null;
  note: string;
  active: boolean;
  sortOrder: number;
  version: number;
}

export interface FinanceCategoryCreateBody {
  name: string;
  direction: CategoryDirection;
  scope: LedgerScope;
  parentId: string | null;
  note: string | null;
  sortOrder: number;
}

export interface FinanceCategoryUpdateBody {
  name: string;
  note: string | null;
  sortOrder: number;
  version: number;
}
