import {
  useGetFinanceTransfersQuery,
  useVoidFinanceTransferMutation,
} from '@admin/accounting/data-access';
import {
  financeTransferParams,
  formatLedgerDate,
  formatMinor,
  ledgerScopeOfTab,
  ledgerTabOfScope,
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
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FinanceJournalQuickBar } from '../../components/journal/finance-journal-quick-bar';
import { LedgerScopeTabs } from '../../components/journal/ledger-scope-tabs';
import { FinanceTransferDrawer } from '../../components/transfers/finance-transfer-drawer';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';
import { useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import { useFinanceJournal } from '../../hooks/journal/use-finance-journal';
import { canEditTransfer } from '../../hooks/transfers/use-finance-transfer-editor';

import type { FinanceMovementEditorMode } from '../../hooks/transactions/use-finance-transaction-editor';
import type { FinanceTransfer, LedgerScope } from '@admin/accounting/model';

/** «Бухгалтерія → Перекази» between own accounts; «Домашня бухгалтерія» on `?tab=archive`. */
export function FinanceTransfersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = ledgerScopeOfTab(searchParams.get('tab'));
  const { cutoverDate, today } = useAccountingSettings();
  return (
    <Box sx={{ minWidth: 0 }}>
      <TransfersJournal
        key={`${scope}-${cutoverDate}`}
        scope={scope}
        cutoverDate={cutoverDate}
        today={today}
        onScopeChange={(next) => setSearchParams(ledgerTabOfScope(next), { replace: true })}
      />
    </Box>
  );
}

interface JournalProps {
  scope: LedgerScope;
  cutoverDate: string;
  today: string;
  onScopeChange: (scope: LedgerScope) => void;
}

function TransfersJournal({ scope, cutoverDate, today, onScopeChange }: JournalProps) {
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
  const [pendingVoid, setPendingVoid] = useState<FinanceTransfer | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [voidTransfer, voidState] = useVoidFinanceTransferMutation();
  const rows = page?.items ?? [];
  const newDate =
    scope === 'Current' ? (today < cutoverDate ? cutoverDate : today) : previousDay(cutoverDate);

  function requestVoid(transfer: FinanceTransfer) {
    setActive(null);
    if (!canEditTransfer(transfer)) {
      setActionMessage('Цей переказ уже анульовано або він з банківської виписки.');
      return;
    }
    setPendingVoid(transfer);
  }

  async function confirmVoid() {
    if (!pendingVoid) return;
    try {
      await voidTransfer({ id: pendingVoid.id, version: pendingVoid.version }).unwrap();
      setActionMessage('Переказ анульовано.');
    } catch (failure) {
      setActionMessage(
        `Не вдалося анулювати переказ. ${adminApiErrorMessage(failure, 'Спробуйте ще раз.')}`,
      );
    }
    setPendingVoid(null);
  }

  return (
    <>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Перекази"
        subtitle="Гроші між власними рахунками однієї валюти. Переказ не є ні доходом, ні витратою"
        actions={
          <Button
            variant="contained"
            startIcon={<SwapHorizOutlinedIcon />}
            onClick={() => setActive({ mode: 'create', transfer: null })}
          >
            Додати переказ
          </Button>
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
        open={Boolean(pendingVoid)}
        title="Анулювати переказ?"
        text={
          pendingVoid
            ? `${formatLedgerDate(pendingVoid.date)}, ${pendingVoid.fromAccountName} → ${pendingVoid.toAccountName}, ${formatMinor(pendingVoid.amountMinor, pendingVoid.currency)}. Переказ залишиться в журналі й історії, але більше не змінюватиме залишки. Повернути його не можна.`
            : ''
        }
        confirmLabel="Анулювати"
        deleting={voidState.isLoading}
        onClose={() => setPendingVoid(null)}
        onConfirm={() => void confirmVoid()}
      />
    </>
  );
}

export default FinanceTransfersPage;
