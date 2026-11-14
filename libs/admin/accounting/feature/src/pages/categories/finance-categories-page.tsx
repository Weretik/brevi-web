import {
  categoryDirectionLabels,
  categoryDirections,
  ledgerTabOfScope,
  nextFinanceSortOrder,
} from '@admin/accounting/model';
import { FinanceCategoriesGrid, FinanceDeleteDialog } from '@admin/accounting/ui';
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

import { FinanceCategoryDrawer } from '../../components/categories/finance-category-drawer';
import { LedgerScopeTabs } from '../../components/journal/ledger-scope-tabs';
import { useFinanceCategoriesPage } from '../../hooks/categories/use-finance-categories-page';

/** «Бухгалтерія → Категорії»: current books and «Домашня бухгалтерія» on tabs (`?tab=archive`). */
export function FinanceCategoriesPage() {
  const { canCreate } = usePageRights();
  const {
    query,
    all,
    loading,
    error,
    cutoverDate,
    setSearchParams,
    scope,
    direction,
    setDirection,
    search,
    setSearch,
    active,
    setActive,
    actionMessage,
    setActionMessage,
    deleteState,
    deletion,
    counts,
    allRows,
    rows,
  } = useFinanceCategoriesPage();
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Категорії"
        subtitle="Статті надходжень і витрат: коренева категорія і підкатегорії в ній"
        actions={
          canCreate ? (
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => setActive({ mode: 'create', category: null, parentId: null })}
            >
              Додати категорію
            </Button>
          ) : null
        }
      />
      <LedgerScopeTabs
        scope={scope}
        cutoverDate={cutoverDate}
        onChange={(next) => setSearchParams(ledgerTabOfScope(next), { replace: true })}
      />
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void query.refetch()}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти категорію за назвою або приміткою"
        label="Пошук категорій"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={categoryDirections.map((value) => (
          <ReferenceFilterChip
            key={value}
            label={categoryDirectionLabels[value]}
            count={counts[value]}
            selected={direction === value}
            onClick={() => setDirection(value)}
          />
        ))}
        count={rows.length}
        total={allRows.length}
        countLabel="Кількість категорій"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FinanceCategoriesGrid
          rows={rows}
          loading={loading}
          searching={allRows.length > 0}
          unavailable={Boolean(error)}
          onView={(category) => setActive({ mode: 'view', category, parentId: null })}
          onEdit={(category) => setActive({ mode: 'edit', category, parentId: null })}
          onDelete={(id) => deletion.request(allRows.find((row) => row.id === id) ?? null)}
        />
      </Paper>
      {active && (
        <FinanceCategoryDrawer
          key={`${active.mode}-${active.category?.id ?? `new-${active.parentId ?? ''}`}`}
          mode={active.mode}
          category={active.category}
          all={all}
          scope={scope}
          direction={direction}
          newParentId={active.parentId}
          newSortOrder={nextFinanceSortOrder(
            all.filter((row) => row.scope === scope && row.parentId === active.parentId),
          )}
          onAddChild={(parent) =>
            setActive({ mode: 'create', category: null, parentId: parent.id })
          }
          onClose={() => setActive(null)}
          onSaved={(message) => {
            setActive(null);
            setActionMessage(message);
          }}
        />
      )}
      <FinanceDeleteDialog
        open={Boolean(deletion.pending)}
        title="Видалити категорію?"
        text={
          deletion.pending?.level === 0 && deletion.pending.childCount > 0
            ? `«${deletion.pending.name}» буде видалено разом із підкатегоріями: ${deletion.pending.childCount}. Якщо котрусь із них уже використано в операціях, усю гілку буде вимкнено замість видалення.`
            : `«${deletion.pending?.name ?? ''}» буде видалено. Якщо категорію вже використано в операціях, її буде вимкнено замість видалення.`
        }
        deleting={deleteState.isLoading}
        onClose={deletion.cancel}
        onConfirm={() => void deletion.confirm()}
      />
    </Box>
  );
}

export default FinanceCategoriesPage;
