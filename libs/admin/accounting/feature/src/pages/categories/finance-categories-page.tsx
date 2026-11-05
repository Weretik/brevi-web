import {
  useDeleteFinanceCategoryMutation,
  useGetFinanceCategoriesQuery,
} from '@admin/accounting/data-access';
import {
  categoryDirectionLabels,
  categoryDirections,
  countFinanceCategories,
  financeCategoryRows,
  formatLedgerDate,
  ledgerScopeLabels,
  ledgerScopes,
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
import { adminApiErrorMessage } from '@admin/shared/api-client';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper, Tab, Tabs } from '@mui/material';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FinanceCategoryDrawer } from '../../components/categories/finance-category-drawer';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';

import type { FinanceCategoryEditorMode } from '../../hooks/categories/use-finance-category-editor';
import type { CategoryDirection, FinanceCategoryRow, LedgerScope } from '@admin/accounting/model';

const scopeOf = (value: string | null): LedgerScope =>
  value === 'archive' ? 'LegacyArchive' : 'Current';

/** «Бухгалтерія → Категорії»: current books and «Домашня бухгалтерія» on tabs (`?tab=archive`). */
export function FinanceCategoriesPage() {
  const query = useGetFinanceCategoriesQuery();
  const all = useMemo(() => query.data ?? [], [query.data]);
  const loading = query.isLoading || query.isFetching;
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося завантажити категорії.')
    : null;
  const { cutoverDate } = useAccountingSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = scopeOf(searchParams.get('tab'));
  const [direction, setDirection] = useState<CategoryDirection>('Expense');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<{
    mode: FinanceCategoryEditorMode;
    category: FinanceCategoryRow | null;
    parentId: string | null;
  } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FinanceCategoryRow | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteCategory, deleteState] = useDeleteFinanceCategoryMutation();
  const counts = countFinanceCategories(all, scope);
  const allRows = useMemo(
    () => financeCategoryRows(all, scope, direction, ''),
    [all, scope, direction],
  );
  const rows = useMemo(
    () => (search.trim() ? financeCategoryRows(all, scope, direction, search) : allRows),
    [all, allRows, scope, direction, search],
  );
  const cutover = formatLedgerDate(cutoverDate);

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteCategory({ id: pendingDelete.id, version: pendingDelete.version }).unwrap();
      setActionMessage('Категорію видалено.');
    } catch (failure) {
      setActionMessage(
        `Не вдалося видалити категорію. ${adminApiErrorMessage(failure, 'Спробуйте ще раз.')}`,
      );
    }
    setPendingDelete(null);
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Категорії"
        subtitle="Статті надходжень і витрат: коренева категорія і підкатегорії в ній"
        actions={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            disabled={loading || Boolean(error)}
            onClick={() => setActive({ mode: 'create', category: null, parentId: null })}
          >
            Додати категорію
          </Button>
        }
      />
      <Tabs
        value={scope}
        onChange={(_, next: LedgerScope) =>
          setSearchParams(next === 'Current' ? {} : { tab: 'archive' }, { replace: true })
        }
        sx={{ mb: 2 }}
      >
        {ledgerScopes.map((value) => (
          <Tab
            key={value}
            value={value}
            label={
              value === 'Current'
                ? `${ledgerScopeLabels[value]} з ${cutover}`
                : `${ledgerScopeLabels[value]} до ${cutover}`
            }
          />
        ))}
      </Tabs>
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
          onDelete={(id) => setPendingDelete(allRows.find((row) => row.id === id) ?? null)}
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
        open={Boolean(pendingDelete)}
        title="Видалити категорію?"
        text={
          pendingDelete?.level === 0 && pendingDelete.childCount > 0
            ? `«${pendingDelete.name}» буде видалено разом із підкатегоріями: ${pendingDelete.childCount}.`
            : `«${pendingDelete?.name ?? ''}» буде видалено. В історії залишиться останній запис.`
        }
        deleting={deleteState.isLoading}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </Box>
  );
}

export default FinanceCategoriesPage;
