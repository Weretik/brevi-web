import { useGetFinanceTransfersQuery } from '@admin/accounting/data-access';
import { financeTransferParams, previousDay } from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { useFinanceTransferVoid } from './use-finance-transfer-void';
import { useFinanceChoices } from '../journal/use-finance-choices';
import { useFinanceJournal } from '../journal/use-finance-journal';

import type { FinanceMovementEditorMode } from '../transactions/use-finance-transaction-editor';
import type { FinanceTransfer, LedgerScope } from '@admin/accounting/model';

/** State of the transfers journal: filters, the page of transfers, the open side panel and voiding. */
export function useFinanceTransfersJournal(scope: LedgerScope, cutoverDate: string, today: string) {
  const journal = useFinanceJournal(scope, cutoverDate, today);
  const choices = useFinanceChoices(scope);
  const query = useGetFinanceTransfersQuery(
    financeTransferParams(scope, journal.applied, journal.sort, journal.direction, journal.page),
  );
  const page = query.data;
  const loading = query.isLoading || query.isFetching;
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося завантажити перекази.')
    : null;
  const [active, setActive] = useState<{
    mode: FinanceMovementEditorMode;
    transfer: FinanceTransfer | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const voiding = useFinanceTransferVoid(setActionMessage);
  const rows = page?.items ?? [];
  const newDate =
    scope === 'Current' ? (today < cutoverDate ? cutoverDate : today) : previousDay(cutoverDate);

  const requestVoid = (transfer: FinanceTransfer) => {
    setActive(null);
    voiding.request(transfer);
  };

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
    requestVoid,
  };
}
