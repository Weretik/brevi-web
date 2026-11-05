import {
  useGetFinanceAccountsQuery,
  useGetFinanceCategoriesQuery,
} from '@admin/accounting/data-access';
import { financeCategoryChoices } from '@admin/accounting/model';
import { useMemo } from 'react';

import type { CategoryDirection, FinanceAccount, LedgerScope } from '@admin/accounting/model';

export interface FinanceChoice {
  id: string;
  name: string;
}

const label = (account: FinanceAccount, currencies: number) =>
  [account.name, currencies > 1 ? account.currency : null, account.active ? null : 'архів']
    .filter(Boolean)
    .join(' · ');

/** Accounts and categories the forms and filters of one area may offer. */
export function useFinanceChoices(scope: LedgerScope) {
  const accountsQuery = useGetFinanceAccountsQuery();
  const categoriesQuery = useGetFinanceCategoriesQuery();
  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data]);
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const currencies = new Set(accounts.map((account) => account.currency)).size;

  return {
    accounts,
    categories,
    /** Every account, archived ones too (filters and «Домашня бухгалтерія»). */
    allAccounts: accounts.map((account) => ({ id: account.id, name: label(account, currencies) })),
    /**
     * Accounts a record may use: the current books take active ones; the archive takes any. The
     * record's own accounts stay in the list.
     */
    accountChoices: (keep: string[]): FinanceChoice[] =>
      accounts
        .filter(
          (account) => scope === 'LegacyArchive' || account.active || keep.includes(account.id),
        )
        .map((account) => ({ id: account.id, name: label(account, currencies) })),
    currencyOf: (id: string) => accounts.find((account) => account.id === id)?.currency,
    categoryChoices: (type: CategoryDirection, parentId: string | null, keepId: string) =>
      financeCategoryChoices(categories, scope, type, parentId, keepId),
  };
}
