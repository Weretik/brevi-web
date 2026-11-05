import { useGetFinanceCategoriesQuery } from '@admin/accounting/data-access';
import {
  financeCounterpartyTabCount,
  financeCounterpartyTabLabels,
  financeCounterpartyTabs,
} from '@admin/accounting/model';
import {
  FinanceCounterpartiesGrid,
  FinanceDeleteDialog,
  FinancePartiesGrid,
  FinanceTransactionsGrid,
} from '@admin/accounting/ui';
import {
  ReferenceFilterChip,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FinanceCounterpartyDrawer } from '../../components/counterparties/finance-counterparty-drawer';
import { FinanceReviewDrawer } from '../../components/review/finance-review-drawer';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';
import { useFinanceCounterpartyActions } from '../../hooks/counterparties/use-finance-counterparty-actions';
import { useFinanceCounterpartyList } from '../../hooks/counterparties/use-finance-counterparty-list';

import type { FinanceCounterpartyEditorMode } from '../../hooks/counterparties/use-finance-counterparty-editor';
import type {
  FinanceCounterparty,
  FinanceParty,
  FinanceTransaction,
} from '@admin/accounting/model';

const noSort = [{ field: 'date', sort: 'desc' as const }];

/**
 * «Бухгалтерія → Контрагенти»: own finance counterparties, clients and suppliers (read-only here)
 * and one-off names of operations.
 */
export function FinanceCounterpartiesPage() {
  const list = useFinanceCounterpartyList();
  const navigate = useNavigate();
  const categories = useGetFinanceCategoriesQuery().data ?? [];
  const { cutoverDate } = useAccountingSettings();
  const [active, setActive] = useState<{
    mode: FinanceCounterpartyEditorMode;
    counterparty: FinanceCounterparty | null;
  } | null>(null);
  const [reviewing, setReviewing] = useState<FinanceTransaction | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const actions = useFinanceCounterpartyActions(setActionMessage);
  const page = list.page;
  const counts = page?.counts;
  const grid = {
    rowCount: page?.total ?? 0,
    loading: list.loading,
    searching: Boolean(list.search.trim()),
    unavailable: Boolean(list.error),
    paginationModel: list.paginationModel,
    onPaginationModelChange: list.changePage,
  };

  function openParty(party: FinanceParty) {
    navigate(
      party.kind === 'Client'
        ? `/crm/clients/${encodeURIComponent(party.id)}`
        : '/references/counterparties',
    );
  }

  function review(transaction: FinanceTransaction) {
    if (transaction.status === 'Active') setReviewing(transaction);
    else setActionMessage('Анульовану операцію змінити не можна.');
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Контрагенти"
        subtitle="З ким рухаються гроші. Клієнти й постачальники беруться з їхніх розділів"
        actions={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setActive({ mode: 'create', counterparty: null })}
          >
            Додати контрагента
          </Button>
        }
      />
      <ReferenceListAlerts
        error={list.error}
        loading={list.loading}
        onRetry={list.refetch}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти за назвою, іншою назвою, ЄДРПОУ або IBAN"
        label="Пошук контрагентів"
        value={list.search}
        onChange={list.setSearch}
      />
      <ReferenceFilterRow
        filters={[
          ...financeCounterpartyTabs.map((tab) => (
            <ReferenceFilterChip
              key={tab}
              label={financeCounterpartyTabLabels[tab]}
              count={counts ? financeCounterpartyTabCount(counts, tab) : undefined}
              selected={list.tab === tab}
              onClick={() => list.setTab(tab)}
            />
          )),
          <ReferenceFilterChip
            key="archived"
            label="Показати архівні"
            selected={list.includeArchived}
            onClick={list.toggleArchived}
          />,
        ]}
        count={page?.total ?? 0}
        total={page?.total ?? 0}
        countLabel="Кількість контрагентів"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      {list.tab === 'Financial' && (
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <FinanceCounterpartiesGrid
            {...grid}
            cutoverDate={cutoverDate}
            rows={page?.financial ?? []}
            onView={(counterparty) => setActive({ mode: 'view', counterparty })}
            onEdit={(counterparty) =>
              setActive({ mode: counterparty.mergedIntoId ? 'view' : 'edit', counterparty })
            }
            onArchive={(id) =>
              actions.archive.request(page?.financial.find((row) => row.id === id) ?? null)
            }
          />
        </Paper>
      )}
      {(list.tab === 'Clients' || list.tab === 'Suppliers') && (
        <FinancePartiesGrid
          {...grid}
          cutoverDate={cutoverDate}
          rows={page?.parties ?? []}
          onOpen={openParty}
        />
      )}
      {list.tab === 'Oneoffs' && (
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <FinanceTransactionsGrid
            {...grid}
            ariaLabel="Разові контрагенти"
            emptyLabel="Операцій з разовими назвами немає"
            actionLabel="Зробити постійним"
            rows={page?.oneoffs ?? []}
            sortModel={noSort}
            onSortModelChange={() => undefined}
            onView={review}
            onEdit={review}
            onVoid={(id) => actions.promote.request(page?.oneoffs.find((row) => row.id === id))}
          />
        </Paper>
      )}
      {active && (
        <FinanceCounterpartyDrawer
          key={`${active.mode}-${active.counterparty?.id ?? 'new'}`}
          mode={active.mode}
          counterparty={active.counterparty}
          categories={categories}
          onClose={() => setActive(null)}
          onSaved={(message) => {
            setActive(null);
            setActionMessage(message);
          }}
        />
      )}
      {reviewing && (
        <FinanceReviewDrawer
          key={reviewing.id}
          transaction={reviewing}
          onClose={() => setReviewing(null)}
          onSaved={(message) => {
            setReviewing(null);
            setActionMessage(message);
          }}
        />
      )}
      <FinanceDeleteDialog
        open={Boolean(actions.archive.pending)}
        title="Архівувати контрагента?"
        text={`«${actions.archive.pending?.name ?? ''}» зникне з вибору в операціях. Наявні операції залишаться з ним.`}
        confirmLabel="Архівувати"
        deleting={actions.archive.busy}
        onClose={actions.archive.cancel}
        onConfirm={actions.archive.confirm}
      />
      <FinanceDeleteDialog
        open={Boolean(actions.promote.pending)}
        title="Зробити постійним?"
        text={`Буде створено підтвердженого фінансового контрагента «${actions.promote.pending?.oneoffName ?? ''}», і ця операція перейде до нього. Інші операції з такою назвою не зміняться.`}
        confirmLabel="Зробити постійним"
        confirmColor="primary"
        deleting={actions.promote.busy}
        onClose={actions.promote.cancel}
        onConfirm={actions.promote.confirm}
      />
    </Box>
  );
}

export default FinanceCounterpartiesPage;
