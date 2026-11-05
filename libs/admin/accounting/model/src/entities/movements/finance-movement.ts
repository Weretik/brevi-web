export const movementSources = ['Manual', 'BankImport', 'HomeAccountingImport'] as const;
export type MovementSource = (typeof movementSources)[number];

export const movementSourceLabels: Record<MovementSource, string> = {
  Manual: 'Вручну',
  BankImport: 'Банківська виписка',
  HomeAccountingImport: 'Перенесено зі старої бухгалтерії',
};

export const movementStatuses = ['Active', 'Void'] as const;
/** `Void` — «Анульовано»: stays in the journal but never counts. */
export type MovementStatus = (typeof movementStatuses)[number];

export const verificationStatuses = [
  'Verified',
  'NeedsCategory',
  'NeedsCounterpartyReview',
] as const;
export type VerificationStatus = (typeof verificationStatuses)[number];

/** Problem marks only: a checked operation shows nothing. */
export const verificationProblemLabels: Partial<Record<VerificationStatus, string>> = {
  NeedsCategory: 'Без категорії',
  NeedsCounterpartyReview: 'Перевірити контрагента',
};

export const financeJournalSorts = ['Date', 'Amount'] as const;
export type FinanceJournalSort = (typeof financeJournalSorts)[number];
export type FinanceSortDirection = 'Desc' | 'Asc';

/** Fixed by the server. */
export const financeJournalPageSize = 50;
