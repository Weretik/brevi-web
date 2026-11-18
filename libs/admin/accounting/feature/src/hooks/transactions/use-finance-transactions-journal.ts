import { useGetFinanceTransactionsQuery } from '@admin/accounting/data-access';
import { financeTransactionParams, previousDay } from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { useFinanceTransactionVoid } from './use-finance-transaction-void';
import { useFinanceChoices } from '../journal/use-finance-choices';
import { useFinanceJournal } from '../journal/use-finance-journal';

import type { FinanceMovementEditorMode } from './use-finance-transaction-editor';
import type { CategoryDirection, FinanceTransaction, LedgerScope } from '@admin/accounting/model';

/** State of the operations journal: filters with category choices, the page, the open side panel and voiding. */
export function useFinanceTransactionsJournal(
  scope: LedgerScope,
  cutoverDate: string,
  today: string,
) {
  const journal = useFinanceJournal(scope, cutoverDate, today);
  const choices = useFinanceChoices(scope);
  const query = useGetFinanceTransactionsQuery(
    financeTransactionParams(scope, journal.applied, journal.sort, journal.direction, journal.page),
  );
  const page = query.data;
  const loading = query.isLoading || query.isFetching;
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося завантажити операції.')
    : null;
  const [active, setActive] = useState<{
    mode: FinanceMovementEditorMode;
    transaction: FinanceTransaction | null;
    type: CategoryDirection;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const voiding = useFinanceTransactionVoid(setActionMessage);
  const rows = page?.items ?? [];
  const newDate =
    scope === 'Current' ? (today < cutoverDate ? cutoverDate : today) : previousDay(cutoverDate);
  const filterType = journal.draft.type;
  const roots = filterType
    ? choices.categoryChoices(filterType, null, journal.draft.categoryId)
    : [];
  const children =
    filterType && journal.draft.categoryId
      ? choices.categoryChoices(filterType, journal.draft.categoryId, journal.draft.subcategoryId)
      : [];

  function requestVoid(transaction: FinanceTransaction) {
    setActive(null);
    voiding.request(transaction);
  }

  return {
    journal,
    choices,
    query,
    page,
    loading,
    error,
    active,
    setActive,
    actionMessage,
    setActionMessage,
    voiding,
    rows,
    newDate,
    roots,
    children,
    requestVoid,
  };
}
