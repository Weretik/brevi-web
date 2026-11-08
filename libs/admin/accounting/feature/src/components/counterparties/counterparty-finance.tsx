import { FinanceTransactionTotals, FinanceTransactionsGrid } from '@admin/accounting/ui';
import { ReferenceListAlerts } from '@admin/references/ui';
import { Button, Paper, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';
import { useCounterpartyFinance } from '../../hooks/counterparties/use-counterparty-finance';
import { useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import { canEditTransaction } from '../../hooks/transactions/use-finance-transaction-editor';
import { useFinanceTransactionVoid } from '../../hooks/transactions/use-finance-transaction-void';
import { LedgerScopeTabs } from '../journal/ledger-scope-tabs';
import { FinanceTransactionDrawer } from '../transactions/finance-transaction-drawer';

import type { CounterpartyFinanceKind } from '../../hooks/counterparties/use-counterparty-finance';
import type { FinanceMovementEditorMode } from '../../hooks/transactions/use-finance-transaction-editor';
import type { FinanceTransaction, FinanceTransactionTotal } from '@admin/accounting/model';

interface Props {
  kind: CounterpartyFinanceKind;
  /** A client's public ID or a supplier's number. */
  id: string;
}

const noSort = [{ field: 'date', sort: 'desc' as const }];
const zeroTotals: FinanceTransactionTotal[] = [
  { currency: 'UAH', incomeMinor: 0, expenseMinor: 0, differenceMinor: 0 },
];

/**
 * Tab «Фінанси» of the client card and the supplier card: incomes and expenses with this counterparty
 * (transfers between own accounts are not here), totals per currency, a period «З»/«По». A row opens the
 * operation in the same panel as «Бухгалтерія → Операції». Shown only to those with the «Бухгалтерія» right.
 */
export function CounterpartyFinance({ kind, id }: Props) {
  const finance = useCounterpartyFinance(kind, id);
  const { cutoverDate, today } = useAccountingSettings();
  const choices = useFinanceChoices(finance.scope);
  const [active, setActive] = useState<{
    mode: FinanceMovementEditorMode;
    transaction: FinanceTransaction;
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const voiding = useFinanceTransactionVoid(setMessage);
  const rows = finance.page?.items ?? [];
  const totals = finance.page?.totals.length ? finance.page.totals : zeroTotals;

  function requestVoid(transaction: FinanceTransaction) {
    setActive(null);
    voiding.request(transaction);
  }

  return (
    <Stack sx={{ gap: 1.5, minWidth: 0 }}>
      <LedgerScopeTabs
        scope={finance.scope}
        cutoverDate={cutoverDate}
        onChange={finance.setScope}
      />
      <Stack
        component="form"
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 1.5, alignItems: { sm: 'flex-start' } }}
        onSubmit={(event) => {
          event.preventDefault();
          finance.apply();
        }}
      >
        <TextField
          label="З"
          type="date"
          size="small"
          value={finance.draft.from}
          onChange={(event) => finance.setDraft({ ...finance.draft, from: event.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="По"
          type="date"
          size="small"
          value={finance.draft.to}
          onChange={(event) => finance.setDraft({ ...finance.draft, to: event.target.value })}
          error={Boolean(finance.problem)}
          helperText={finance.problem ?? ' '}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button type="submit" variant="outlined" disabled={Boolean(finance.problem)}>
          Показати
        </Button>
      </Stack>
      <ReferenceListAlerts
        error={finance.error}
        loading={finance.loading}
        onRetry={finance.refetch}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      <FinanceTransactionTotals totals={totals} />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FinanceTransactionsGrid
          ariaLabel="Операції контрагента"
          emptyLabel="Операцій із цим контрагентом немає"
          rows={rows}
          rowCount={finance.page?.total ?? 0}
          loading={finance.loading}
          searching={finance.searching}
          unavailable={Boolean(finance.error)}
          paginationModel={finance.paginationModel}
          onPaginationModelChange={finance.changePage}
          sortModel={noSort}
          onSortModelChange={() => undefined}
          onView={(transaction) => setActive({ mode: 'view', transaction })}
          onEdit={(transaction) =>
            setActive({ mode: canEditTransaction(transaction) ? 'edit' : 'view', transaction })
          }
          onVoid={(transactionId) => {
            const transaction = rows.find((row) => row.id === transactionId);
            if (transaction) requestVoid(transaction);
          }}
        />
      </Paper>
      {active && (
        <FinanceTransactionDrawer
          key={`${active.mode}-${active.transaction.id}`}
          mode={active.mode}
          transaction={active.transaction}
          scope={finance.scope}
          type={active.transaction.type}
          cutoverDate={cutoverDate}
          date={today}
          choices={choices}
          onClose={() => setActive(null)}
          onSaved={(saved) => {
            setActive(null);
            setMessage(saved);
          }}
          onVoid={requestVoid}
        />
      )}
      {voiding.dialog}
    </Stack>
  );
}
