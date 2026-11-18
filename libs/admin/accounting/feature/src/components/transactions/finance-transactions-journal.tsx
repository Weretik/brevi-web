import {
  FinanceJournalFilters,
  FinanceTransactionTotals,
  FinanceTransactionsGrid,
} from '@admin/accounting/ui';
import { ReferenceListAlerts } from '@admin/references/ui';
import { Paper } from '@mui/material';

import { FinanceTransactionDrawer } from './finance-transaction-drawer';
import { FinanceTransactionsHeader } from './finance-transactions-header';
import { canEditTransaction } from '../../hooks/transactions/use-finance-transaction-editor';
import { useFinanceTransactionsJournal } from '../../hooks/transactions/use-finance-transactions-journal';
import { FinanceJournalQuickBar } from '../journal/finance-journal-quick-bar';
import { LedgerScopeTabs } from '../journal/ledger-scope-tabs';

import type { CategoryDirection, LedgerScope } from '@admin/accounting/model';

interface JournalProps {
  scope: LedgerScope;
  cutoverDate: string;
  today: string;
  onScopeChange: (scope: LedgerScope) => void;
}

/** The incomes and expenses journal of one ledger scope: filters, grid, side panel and voiding. */
export function FinanceTransactionsJournal({
  scope,
  cutoverDate,
  today,
  onScopeChange,
}: JournalProps) {
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
    roots,
    children,
    requestVoid,
  } = useFinanceTransactionsJournal(scope, cutoverDate, today);
  const add = (type: CategoryDirection) => setActive({ mode: 'create', transaction: null, type });

  return (
    <>
      <FinanceTransactionsHeader onAdd={add} />
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
        kind="transactions"
        searchPlaceholder="Знайти за описом, приміткою або контрагентом…"
        totals={<FinanceTransactionTotals totals={page?.totals ?? []} />}
      />
      {journal.open && (
        <FinanceJournalFilters
          quick
          kind="transactions"
          value={journal.draft}
          accounts={choices.allAccounts}
          roots={roots}
          children={children}
          problem={journal.problem}
          onChange={journal.setDraft}
          onApply={journal.apply}
          onReset={journal.reset}
        />
      )}
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FinanceTransactionsGrid
          rows={rows}
          rowCount={page?.total ?? 0}
          loading={loading}
          searching={journal.activeCount > 0}
          unavailable={Boolean(error)}
          paginationModel={journal.paginationModel}
          onPaginationModelChange={journal.changePage}
          sortModel={journal.sortModel}
          onSortModelChange={journal.changeSort}
          onView={(transaction) => setActive({ mode: 'view', transaction, type: transaction.type })}
          onEdit={(transaction) =>
            setActive({
              mode: canEditTransaction(transaction) ? 'edit' : 'view',
              transaction,
              type: transaction.type,
            })
          }
          onVoid={(id) => {
            const transaction = rows.find((row) => row.id === id);
            if (transaction) requestVoid(transaction);
          }}
        />
      </Paper>
      {active && (
        <FinanceTransactionDrawer
          key={`${active.mode}-${active.transaction?.id ?? `new-${active.type}`}`}
          mode={active.mode}
          transaction={active.transaction}
          scope={scope}
          type={active.type}
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
      {voiding.dialog}
    </>
  );
}
