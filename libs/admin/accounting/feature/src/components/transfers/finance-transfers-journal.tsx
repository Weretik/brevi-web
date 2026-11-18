import {
  FinanceJournalFilters,
  FinanceTransferTotals,
  FinanceTransfersGrid,
} from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { Button, Paper } from '@mui/material';

import { FinanceTransferDrawer } from './finance-transfer-drawer';
import { FinanceTransferVoidDialog } from './finance-transfer-void-dialog';
import { canEditTransfer } from '../../hooks/transfers/use-finance-transfer-editor';
import { useFinanceTransfersJournal } from '../../hooks/transfers/use-finance-transfers-journal';
import { FinanceJournalQuickBar } from '../journal/finance-journal-quick-bar';
import { LedgerScopeTabs } from '../journal/ledger-scope-tabs';

import type { LedgerScope } from '@admin/accounting/model';

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
  const {
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
  } = useFinanceTransfersJournal(scope, cutoverDate, today);

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
      <FinanceTransferVoidDialog voiding={voiding} />
    </>
  );
}
