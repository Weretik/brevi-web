import {
  useBookBankStatementMutation,
  useGetBankStatementQuery,
  useRollbackBankStatementMutation,
  useUpdateBankStatementLineMutation,
} from '@admin/accounting/data-access';
import {
  bankLineBody,
  bankStatementPageSize,
  createBankLineFormValues,
} from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { BankLineState, BankStatementLine } from '@admin/accounting/model';

/**
 * One statement: lines filtered by state, page by page, «Проводити» of a line right in the table, «Провести
 * виписку» and «Відкотити виписку» with the version the director saw.
 */
export function useBankStatement(id: string) {
  const [state, setStateFilter] = useState<BankLineState | null>(null);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [savingIds, setSavingIds] = useState<ReadonlySet<string>>(new Set());
  const query = useGetBankStatementQuery({ id, state, page });
  const [update] = useUpdateBankStatementLineMutation();
  const [book, bookState] = useBookBankStatementMutation();
  const [rollback, rollbackState] = useRollbackBankStatementMutation();
  const details = query.data;

  async function toggle(line: BankStatementLine, willBook: boolean) {
    setMessage(null);
    setSavingIds((current) => new Set(current).add(line.id));
    try {
      const values = { ...createBankLineFormValues(line), excluded: !willBook };
      await update({ statementId: id, lineId: line.id, body: bankLineBody(values, line) }).unwrap();
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося змінити рядок.'));
    } finally {
      setSavingIds((current) => {
        const next = new Set(current);
        next.delete(line.id);
        return next;
      });
    }
  }

  async function bookAll() {
    if (!details || bookState.isLoading) return false;
    setMessage(null);
    try {
      const booked = await book({ id, version: details.statement.version }).unwrap();
      setNotice(
        `Виписку проведено: ${booked.transactionCount} операцій і ${booked.transferCount} переказів.`,
      );
      return true;
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося провести виписку.'));
      return false;
    }
  }

  async function rollbackAll() {
    if (!details || rollbackState.isLoading) return;
    setMessage(null);
    try {
      await rollback({ id, version: details.statement.version }).unwrap();
      setNotice('Виписку відкочено. Виправте рядки й проведіть її знову, якщо потрібно.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося відкотити виписку.'));
    }
  }

  return {
    details,
    loading: query.isLoading || query.isFetching,
    error: query.error ? adminApiErrorMessage(query.error, 'Не вдалося відкрити виписку.') : null,
    retry: () => void query.refetch(),
    state,
    setState: (next: BankLineState | null) => {
      setStateFilter(next);
      setPage(1);
    },
    page,
    pageSize: bankStatementPageSize,
    setPage,
    message,
    notice,
    setNotice,
    savingIds,
    toggle: (line: BankStatementLine, willBook: boolean) => void toggle(line, willBook),
    booking: bookState.isLoading,
    book: bookAll,
    rollingBack: rollbackState.isLoading,
    rollback: () => void rollbackAll(),
  };
}
