import {
  useDeleteFinanceAccountMutation,
  useGetFinanceAccountsQuery,
} from '@admin/accounting/data-access';
import {
  countFinanceAccounts,
  filterFinanceAccounts,
  formatLedgerDate,
  nextFinanceSortOrder,
} from '@admin/accounting/model';
import { FinanceAccountsGrid, FinanceDeleteDialog } from '@admin/accounting/ui';
import {
  ReferenceFilterChip,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { FinanceAccountDrawer } from '../../components/accounts/finance-account-drawer';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';

import type { FinanceAccountEditorMode } from '../../hooks/accounts/use-finance-account-editor';
import type { FinanceAccount, FinanceAccountFilter } from '@admin/accounting/model';

const filters: { value: FinanceAccountFilter; label: string }[] = [
  { value: 'active', label: 'Активні' },
  { value: 'unconfirmed', label: 'Без залишку на 01.10' },
  { value: 'archived', label: 'Архів' },
];

/** «Бухгалтерія → Рахунки і каси» with counted balances (ACC-001). */
export function FinanceAccountsPage() {
  const query = useGetFinanceAccountsQuery();
  const rows = useMemo(() => query.data ?? [], [query.data]);
  const loading = query.isLoading || query.isFetching;
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося завантажити рахунки.')
    : null;
  const { cutoverDate, today } = useAccountingSettings();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FinanceAccountFilter>('active');
  const [active, setActive] = useState<{
    mode: FinanceAccountEditorMode;
    account: FinanceAccount | null;
  } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FinanceAccount | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteAccount, deleteState] = useDeleteFinanceAccountMutation();
  const counts = countFinanceAccounts(rows);
  const filteredRows = useMemo(
    () => filterFinanceAccounts(rows, search, filter),
    [rows, search, filter],
  );
  const filterTotal = filter === 'archived' ? counts.archived : counts.active;

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteAccount({ id: pendingDelete.id, version: pendingDelete.version }).unwrap();
      setActionMessage('Рахунок видалено.');
    } catch (failure) {
      setActionMessage(
        `Не вдалося видалити рахунок. ${adminApiErrorMessage(failure, 'Спробуйте ще раз.')}`,
      );
    }
    setPendingDelete(null);
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Рахунки і каси"
        subtitle={`Банківські рахунки, картки й каси. Поточний облік починається із залишку на ${formatLedgerDate(cutoverDate)}`}
        actions={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            disabled={loading || Boolean(error)}
            onClick={() => setActive({ mode: 'create', account: null })}
          >
            Додати рахунок
          </Button>
        }
      />
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void query.refetch()}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти рахунок за назвою, IBAN або приміткою"
        label="Пошук рахунків"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={filters.map((item) => (
          <ReferenceFilterChip
            key={item.value}
            label={item.label}
            count={counts[item.value]}
            selected={filter === item.value}
            onClick={() => setFilter(item.value)}
          />
        ))}
        count={filteredRows.length}
        total={filter === 'unconfirmed' ? counts.unconfirmed : filterTotal}
        countLabel="Кількість рахунків"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FinanceAccountsGrid
          rows={filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          onView={(account) => setActive({ mode: 'view', account })}
          onEdit={(account) => setActive({ mode: 'edit', account })}
          onDelete={(id) => {
            const account = rows.find((row) => row.id === id) ?? null;
            if (account?.balance?.hasHistory)
              setActionMessage(
                `По рахунку «${account.name}» вже є рух коштів, тому його можна лише перенести в архів.`,
              );
            else setPendingDelete(account);
          }}
        />
      </Paper>
      {active && (
        <FinanceAccountDrawer
          key={`${active.mode}-${active.account?.id ?? 'new'}`}
          mode={active.mode}
          account={active.account}
          cutoverDate={cutoverDate}
          today={today}
          newSortOrder={nextFinanceSortOrder(rows)}
          onClose={() => setActive(null)}
          onSaved={(message) => {
            setActive(null);
            setActionMessage(message);
          }}
        />
      )}
      <FinanceDeleteDialog
        open={Boolean(pendingDelete)}
        title="Видалити рахунок?"
        text={`«${pendingDelete?.name ?? ''}» зникне зі списку, а в історії залишиться останній запис. Якщо рахунок лише не використовується, перенесіть його в архів.`}
        deleting={deleteState.isLoading}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </Box>
  );
}

export default FinanceAccountsPage;
