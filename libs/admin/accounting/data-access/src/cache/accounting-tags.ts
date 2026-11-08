export const financeAccountsTag = { type: 'FinanceAccount' as const, id: 'LIST' };
export const financeCategoriesTag = { type: 'FinanceCategory' as const, id: 'LIST' };
export const financeCounterpartiesTag = { type: 'FinanceCounterparty' as const, id: 'LIST' };
export const financeAttachmentsTag = (transactionId: string) => ({
  type: 'FinanceAttachment' as const,
  id: transactionId,
});
export const financeHistoryTag = (id: string) => ({ type: 'FinanceHistory' as const, id });
export const financeTransactionsTag = { type: 'FinanceTransaction' as const, id: 'LIST' };
export const financeTransfersTag = { type: 'FinanceTransfer' as const, id: 'LIST' };
export const financeOverviewTag = { type: 'FinanceOverview' as const, id: 'LIST' };
export const bankStatementsTag = { type: 'BankStatement' as const, id: 'LIST' };
export const bankStatementTag = (id: string) => ({ type: 'BankStatement' as const, id });

/** A movement changes balances, the overview and the journals that show names. */
export const financeMovementTags = [
  financeAccountsTag,
  financeOverviewTag,
  financeTransactionsTag,
  financeTransfersTag,
];

/** A counterparty change renames journal rows and moves operations in and out of review. */
export const financeCounterpartyTags = [
  financeCounterpartiesTag,
  financeOverviewTag,
  financeTransactionsTag,
];
