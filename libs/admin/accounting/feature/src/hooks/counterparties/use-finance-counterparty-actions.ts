import {
  useArchiveFinanceCounterpartyMutation,
  usePromoteFinanceOneoffMutation,
} from '@admin/accounting/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { FinanceCounterparty, FinanceTransaction } from '@admin/accounting/model';

/** «Архівувати» a finance counterparty and «Зробити постійним» a one-off name, each confirmed. */
export function useFinanceCounterpartyActions(report: (message: string) => void) {
  const [pendingArchive, setPendingArchive] = useState<FinanceCounterparty | null>(null);
  const [pendingPromote, setPendingPromote] = useState<FinanceTransaction | null>(null);
  const [archive, archiveState] = useArchiveFinanceCounterpartyMutation();
  const [promote, promoteState] = usePromoteFinanceOneoffMutation();

  async function confirmArchive() {
    if (!pendingArchive) return;
    try {
      await archive({ id: pendingArchive.id, version: pendingArchive.version }).unwrap();
      report('Контрагента перенесено в архів.');
    } catch (failure) {
      report(
        `Не вдалося архівувати контрагента. ${adminApiErrorMessage(failure, 'Спробуйте ще раз.')}`,
      );
    }
    setPendingArchive(null);
  }

  async function confirmPromote() {
    if (!pendingPromote) return;
    try {
      await promote({ id: pendingPromote.id, version: pendingPromote.version }).unwrap();
      report(`«${pendingPromote.oneoffName}» тепер у «Фінансових».`);
    } catch (failure) {
      report(
        `Не вдалося зробити контрагента постійним. ${adminApiErrorMessage(failure, 'Спробуйте ще раз.')}`,
      );
    }
    setPendingPromote(null);
  }

  return {
    archive: {
      pending: pendingArchive,
      busy: archiveState.isLoading,
      request: (counterparty: FinanceCounterparty | null) => {
        if (counterparty && !counterparty.active) report(`«${counterparty.name}» уже в архіві.`);
        else setPendingArchive(counterparty);
      },
      cancel: () => setPendingArchive(null),
      confirm: () => void confirmArchive(),
    },
    promote: {
      pending: pendingPromote,
      busy: promoteState.isLoading,
      request: (transaction: FinanceTransaction | undefined) => {
        if (transaction?.status === 'Active') setPendingPromote(transaction);
        else report('Анульовану операцію змінити не можна.');
      },
      cancel: () => setPendingPromote(null),
      confirm: () => void confirmPromote(),
    },
  };
}
