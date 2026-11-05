import {
  useGetFinanceTransactionsQuery,
  useVoidFinanceTransactionMutation,
} from '@admin/accounting/data-access';
import {
  financeTransactionParams,
  formatLedgerDate,
  formatSignedMinor,
  ledgerScopeOfTab,
  ledgerTabOfScope,
  previousDay,
} from '@admin/accounting/model';
import {
  FinanceDeleteDialog,
  FinanceJournalFilters,
  FinanceTransactionTotals,
  FinanceTransactionsGrid,
} from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Box, Button, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FinanceJournalQuickBar } from '../../components/journal/finance-journal-quick-bar';
import { LedgerScopeTabs } from '../../components/journal/ledger-scope-tabs';
import { FinanceTransactionDrawer } from '../../components/transactions/finance-transaction-drawer';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';
import { useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import { useFinanceJournal } from '../../hooks/journal/use-finance-journal';
import { canEditTransaction } from '../../hooks/transactions/use-finance-transaction-editor';

import type { FinanceMovementEditorMode } from '../../hooks/transactions/use-finance-transaction-editor';
import type { CategoryDirection, FinanceTransaction, LedgerScope } from '@admin/accounting/model';

/** «Бухгалтерія → Операції»: incomes and expenses; «Домашня бухгалтерія» on `?tab=archive`. */
export function FinanceTransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = ledgerScopeOfTab(searchParams.get('tab'));
  const { cutoverDate, today } = useAccountingSettings();
  return (
    <Box sx={{ minWidth: 0 }}>
      <TransactionsJournal
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

function TransactionsJournal({ scope, cutoverDate, today, onScopeChange }: JournalProps) {
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
  const [pendingVoid, setPendingVoid] = useState<FinanceTransaction | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [voidTransaction, voidState] = useVoidFinanceTransactionMutation();
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
    if (!canEditTransaction(transaction)) {
      setActionMessage('Цю операцію вже анульовано або вона з банківської виписки.');
      return;
    }
    setPendingVoid(transaction);
  }

  async function confirmVoid() {
    if (!pendingVoid) return;
    try {
      await voidTransaction({ id: pendingVoid.id, version: pendingVoid.version }).unwrap();
      setActionMessage('Операцію анульовано.');
    } catch (failure) {
      setActionMessage(
        `Не вдалося анулювати операцію. ${adminApiErrorMessage(failure, 'Спробуйте ще раз.')}`,
      );
    }
    setPendingVoid(null);
  }

  const add = (type: CategoryDirection) => setActive({ mode: 'create', transaction: null, type });

  return (
    <>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Операції"
        subtitle="Надходження й витрати. Перекази між своїми рахунками — окремо"
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<AddOutlinedIcon />}
              onClick={() => add('Income')}
            >
              Надходження
            </Button>
            <Button
              variant="contained"
              startIcon={<RemoveOutlinedIcon />}
              onClick={() => add('Expense')}
            >
              Витрата
            </Button>
          </Stack>
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
      <FinanceDeleteDialog
        open={Boolean(pendingVoid)}
        title="Анулювати операцію?"
        text={
          pendingVoid
            ? `${formatLedgerDate(pendingVoid.date)}, ${formatSignedMinor(pendingVoid.type, pendingVoid.amountMinor, pendingVoid.currency)}. Операція залишиться в журналі й історії, але більше не впливатиме на залишки й підсумки. Повернути її не можна.`
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

export default FinanceTransactionsPage;
