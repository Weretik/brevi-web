import {
  useGetBankStatementsQuery,
  useGetFinanceAccountsQuery,
  useUploadBankStatementMutation,
} from '@admin/accounting/data-access';
import { bankStatementFileProblem } from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo, useState } from 'react';

import type { BankStatement } from '@admin/accounting/model';

/**
 * «Виписки банку»: the history and «Завантажити виписку» of an active bank account or card. The server reads the
 * file into a preview; `onUploaded` opens it (also when the same file was uploaded before).
 */
export function useBankStatementUpload(onUploaded: (statement: BankStatement) => void) {
  const history = useGetBankStatementsQuery();
  const accountsQuery = useGetFinanceAccountsQuery();
  const [upload, uploadState] = useUploadBankStatementMutation();
  const [picked, setPicked] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const accounts = useMemo(
    () =>
      (accountsQuery.data ?? []).filter(
        (account) => account.active && (account.type === 'Bank' || account.type === 'Card'),
      ),
    [accountsQuery.data],
  );
  // One account needs no choice; a removed choice falls back to none.
  const accountId =
    accounts.length === 1
      ? (accounts[0]?.id ?? '')
      : accounts.some((account) => account.id === picked)
        ? picked
        : '';

  async function send(file: File) {
    setMessage(null);
    if (!accountId) {
      setMessage('Спершу оберіть рахунок, з якого виписка.');
      return;
    }
    const problem = bankStatementFileProblem(file);
    if (problem) {
      setMessage(problem);
      return;
    }
    try {
      onUploaded(await upload({ accountId, file }).unwrap());
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося прочитати виписку.'));
    }
  }

  return {
    statements: history.data ?? [],
    loading: history.isLoading || history.isFetching,
    error: history.error
      ? adminApiErrorMessage(history.error, 'Не вдалося завантажити історію виписок.')
      : null,
    retry: () => void history.refetch(),
    accounts,
    accountsLoading: accountsQuery.isLoading,
    accountId,
    setAccountId: setPicked,
    uploading: uploadState.isLoading,
    message,
    send: (file: File) => void send(file),
  };
}
