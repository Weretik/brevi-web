import {
  useDeleteFinanceAccountMutation,
  useGetFinanceAccountsQuery,
} from '@admin/accounting/data-access';
import { countFinanceAccounts, filterFinanceAccounts } from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo, useState } from 'react';

import { useAccountingSettings } from './use-accounting-settings';
import { useVersionedDeletion } from '../deletion/use-versioned-deletion';

import type { FinanceAccountEditorMode } from './use-finance-account-editor';
import type { FinanceAccount, FinanceAccountFilter } from '@admin/accounting/model';

type ActivePanel = { mode: FinanceAccountEditorMode; account: FinanceAccount | null };

/**
 * «Рахунки і каси»: the accounts with their counts, the search and the chip, the open side panel, and
 * deletion, which an account with money movement does not allow.
 */
export function useFinanceAccountsPage() {
  const query = useGetFinanceAccountsQuery();
  const all = useMemo(() => query.data ?? [], [query.data]);
  const settings = useAccountingSettings();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FinanceAccountFilter>('active');
  const [active, setActive] = useState<ActivePanel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteAccount, deleteState] = useDeleteFinanceAccountMutation();
  const deletion = useVersionedDeletion<FinanceAccount>(
    deleteAccount,
    { done: 'Рахунок видалено.', failed: 'Не вдалося видалити рахунок.' },
    setMessage,
  );
  const rows = useMemo(() => filterFinanceAccounts(all, search, filter), [all, search, filter]);
  const counts = countFinanceAccounts(all);

  return {
    all,
    rows,
    counts,
    total:
      filter === 'unconfirmed'
        ? counts.unconfirmed
        : filter === 'archived'
          ? counts.archived
          : counts.active,
    loading: query.isLoading || query.isFetching,
    error: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося завантажити рахунки.')
      : null,
    refetch: () => void query.refetch(),
    cutoverDate: settings.cutoverDate,
    today: settings.today,
    search,
    setSearch,
    filter,
    setFilter,
    active,
    open: (mode: FinanceAccountEditorMode, account: FinanceAccount | null) =>
      setActive({ mode, account }),
    close: () => setActive(null),
    saved: (text: string) => {
      setActive(null);
      setMessage(text);
    },
    message,
    setMessage,
    deletion,
    deleting: deleteState.isLoading,
    /** An account with money movement can only go to the archive, so deleting it explains that instead. */
    requestDelete: (id: string) => {
      const account = all.find((row) => row.id === id) ?? null;
      if (account?.balance?.hasHistory)
        setMessage(
          `По рахунку «${account.name}» вже є рух коштів, тому його можна лише перенести в архів.`,
        );
      else deletion.request(account);
    },
  };
}
