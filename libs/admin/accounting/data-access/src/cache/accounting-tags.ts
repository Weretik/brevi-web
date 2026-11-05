export const financeAccountsTag = { type: 'FinanceAccount' as const, id: 'LIST' };
export const financeCategoriesTag = { type: 'FinanceCategory' as const, id: 'LIST' };
export const financeHistoryTag = (id: string) => ({ type: 'FinanceHistory' as const, id });
export const financeTransactionsTag = { type: 'FinanceTransaction' as const, id: 'LIST' };
export const financeTransfersTag = { type: 'FinanceTransfer' as const, id: 'LIST' };
export const financeOverviewTag = { type: 'FinanceOverview' as const, id: 'LIST' };

/** A movement changes balances, the overview and the journals that show names. */
export const financeMovementTags = [
  financeAccountsTag,
  financeOverviewTag,
  financeTransactionsTag,
  financeTransfersTag,
];
