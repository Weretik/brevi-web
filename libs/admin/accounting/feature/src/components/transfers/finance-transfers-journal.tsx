import { useGetFinanceTransfersQuery } from '@admin/accounting/data-access';
import {
  financeTransferParams,
  formatLedgerDate,
  formatMinor,
  previousDay,
} from '@admin/accounting/model';
import {
  FinanceDeleteDialog,
  FinanceJournalFilters,
  FinanceTransferTotals,
  FinanceTransfersGrid,
} from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { usePageRights } from '@admin/shared/ui';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { Button, Paper } from '@mui/material';
import { useState } from 'react';

import { FinanceTransferDrawer } from './finance-transfer-drawer';
import { useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import { useFinanceJournal } from '../../hooks/journal/use-finance-journal';
import { canEditTransfer } from '../../hooks/transfers/use-finance-transfer-editor';
import { useFinanceTransferVoid } from '../../hooks/transfers/use-finance-transfer-void';
import { FinanceJournalQuickBar } from '../journal/finance-journal-quick-bar';
import { LedgerScopeTabs } from '../journal/ledger-scope-tabs';

import type { FinanceMovementEditorMode } from '../../hooks/transactions/use-finance-transaction-editor';
import type { FinanceTransfer, LedgerScope } from '@admin/accounting/model';

interface JournalProps {
  scope: LedgerScope;
  cutoverDate: string;
  today: string;
  onScopeChange: (scope: LedgerScope) => void;
}

/** The transfers journal of one ledger scope: filters, grid, side panel and voiding. */
export function FinanceTransfersJournal({
  scope,
  cutoverDate,
  today,
  onScopeChange,
}: JournalProps) {
  const { canCreate } = usePageRights();
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

  return (
    <>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Перекази"
        subtitle="Гроші між власними рахунками однієї валюти. Переказ не є ні доходом, ні витратою"
        actions={
          canCreate ? (
            <Button
              variant="contained"
              startIcon={<SwapHorizOutlinedIcon />}
              onClick={() => setActive({ mode: 'create', transfer: null })}
            >
              Додати переказ
            </Button>
          ) : null
        }
      />
      <LedgerScopeTabs scope={scope} cutoverDate={cutoverDate} onChange={onScopeChange} />
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void query.refetch()}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <FinanceJournalQuickBar
        journal={journal}
        scope={scope}
        cutoverDate={cutoverDate}
        today={today}
        kind="transfers"
        searchPlaceholder="Знайти за приміткою…"
        totals={<FinanceTransferTotals totals={page?.totals ?? []} />}
      />
      {journal.open && (
        <FinanceJournalFilters
          quick
          kind="transfers"
          value={journal.draft}
          accounts={choices.allAccounts}
          problem={journal.problem}
          onChange={journal.setDraft}
          onApply={journal.apply}
          onReset={journal.reset}
        />
      )}
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FinanceTransfersGrid
          rows={rows}
          rowCount={page?.total ?? 0}
          loading={loading}
          searching={journal.activeCount > 0}
          unavailable={Boolean(error)}
          paginationModel={journal.paginationModel}
          onPaginationModelChange={journal.changePage}
          sortModel={journal.sortModel}
          onSortModelChange={journal.changeSort}
          onView={(transfer) => setActive({ mode: 'view', transfer })}
          onEdit={(transfer) =>
            setActive({ mode: canEditTransfer(transfer) ? 'edit' : 'view', transfer })
          }
          onVoid={(id) => {
            const transfer = rows.find((row) => row.id === id);
            if (transfer) requestVoid(transfer);
          }}
        />
      </Paper>
      {active && (
        <FinanceTransferDrawer
          key={`${active.mode}-${active.transfer?.id ?? 'new'}`}
          mode={active.mode}
          transfer={active.transfer}
          scope={scope}
          cutoverDate={cutoverDate}
          date={newDate}
          choices={choices}
          onClose={() => setActive(null)}
          onSaved={(message) => {
            setActive(null);
            setActionMessage(message);
          }}
          onVoid={requestVoid}
        />
      )}
      <FinanceDeleteDialog
        open={Boolean(voiding.pending)}
        title="Анулювати переказ?"
        text={
          voiding.pending
            ? `${formatLedgerDate(voiding.pending.date)}, ${voiding.pending.fromAccountName} → ${voiding.pending.toAccountName}, ${formatMinor(voiding.pending.amountMinor, voiding.pending.currency)}. Переказ залишиться в журналі й історії, але більше не змінюватиме залишки. Повернути його не можна.`
            : ''
        }
        confirmLabel="Анулювати"
        deleting={voiding.deleting}
        onClose={voiding.cancel}
        onConfirm={() => void voiding.confirm()}
      />
    </>
  );
}
