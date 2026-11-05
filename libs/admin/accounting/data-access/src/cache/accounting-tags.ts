export const financeAccountsTag = { type: 'FinanceAccount' as const, id: 'LIST' };
export const financeCategoriesTag = { type: 'FinanceCategory' as const, id: 'LIST' };
export const financeHistoryTag = (id: string) => ({ type: 'FinanceHistory' as const, id });
