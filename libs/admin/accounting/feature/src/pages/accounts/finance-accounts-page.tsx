import { formatLedgerDate, nextFinanceSortOrder } from '@admin/accounting/model';
import { FinanceAccountsGrid, FinanceDeleteDialog } from '@admin/accounting/ui';
import {
  ReferenceFilterChip,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';

import { FinanceAccountDrawer } from '../../components/accounts/finance-account-drawer';
import { useFinanceAccountsPage } from '../../hooks/accounts/use-finance-accounts-page';

import type { FinanceAccountFilter } from '@admin/accounting/model';

const filters: { value: FinanceAccountFilter; label: string }[] = [
  { value: 'active', label: 'Активні' },
  { value: 'unconfirmed', label: 'Без залишку на 01.10' },
  { value: 'archived', label: 'Архів' },
];

/** «Бухгалтерія → Рахунки і каси» with counted balances (ACC-001). */
export function FinanceAccountsPage() {
  const { canCreate } = usePageRights();
  const page = useFinanceAccountsPage();
  const { counts, deletion, error, loading } = page;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Рахунки і каси"
        subtitle={`Банківські рахунки, картки й каси. Поточний облік починається із залишку на ${formatLedgerDate(page.cutoverDate)}`}
        actions={
          canCreate ? (
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => page.open('create', null)}
            >
              Додати рахунок
            </Button>
          ) : null
        }
      />
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={page.refetch}
        actionMessage={page.message}
        onCloseActionMessage={() => page.setMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти рахунок за назвою, IBAN або приміткою"
        label="Пошук рахунків"
        value={page.search}
        onChange={page.setSearch}
      />
      <ReferenceFilterRow
        filters={filters.map((item) => (
          <ReferenceFilterChip
            key={item.value}
            label={item.label}
            count={counts[item.value]}
            selected={page.filter === item.value}
            onClick={() => page.setFilter(item.value)}
          />
        ))}
        count={page.rows.length}
        total={page.total}
        countLabel="Кількість рахунків"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FinanceAccountsGrid
          rows={page.rows}
          loading={loading}
          searching={page.all.length > 0}
          unavailable={Boolean(error)}
          onView={(account) => page.open('view', account)}
          onEdit={(account) => page.open('edit', account)}
          onDelete={page.requestDelete}
        />
      </Paper>
      {page.active && (
        <FinanceAccountDrawer
          key={`${page.active.mode}-${page.active.account?.id ?? 'new'}`}
          mode={page.active.mode}
          account={page.active.account}
          cutoverDate={page.cutoverDate}
          today={page.today}
          newSortOrder={nextFinanceSortOrder(page.all)}
          onClose={page.close}
          onSaved={page.saved}
        />
      )}
      <FinanceDeleteDialog
        open={Boolean(deletion.pending)}
        title="Видалити рахунок?"
        text={`«${deletion.pending?.name ?? ''}» зникне зі списку, а в історії залишиться останній запис. Якщо рахунок лише не використовується, перенесіть його в архів.`}
        deleting={page.deleting}
        onClose={deletion.cancel}
        onConfirm={() => void deletion.confirm()}
      />
    </Box>
  );
}

export default FinanceAccountsPage;
