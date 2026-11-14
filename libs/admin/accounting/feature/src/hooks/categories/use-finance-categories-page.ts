import {
  useDeleteFinanceCategoryMutation,
  useGetFinanceCategoriesQuery,
} from '@admin/accounting/data-access';
import {
  countFinanceCategories,
  financeCategoryRows,
  ledgerScopeOfTab,
} from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAccountingSettings } from '../accounts/use-accounting-settings';
import { useVersionedDeletion } from '../deletion/use-versioned-deletion';

import type { FinanceCategoryEditorMode } from './use-finance-category-editor';
import type { CategoryDirection, FinanceCategoryRow } from '@admin/accounting/model';

/** «Категорії»: the categories of the open tab and direction with the search, the side panel, the message and deletion. */
export function useFinanceCategoriesPage() {
  const query = useGetFinanceCategoriesQuery();
  const all = useMemo(() => query.data ?? [], [query.data]);
  const loading = query.isLoading || query.isFetching;
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося завантажити категорії.')
    : null;
  const { cutoverDate } = useAccountingSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = ledgerScopeOfTab(searchParams.get('tab'));
  const [direction, setDirection] = useState<CategoryDirection>('Expense');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<{
    mode: FinanceCategoryEditorMode;
    category: FinanceCategoryRow | null;
    parentId: string | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteCategory, deleteState] = useDeleteFinanceCategoryMutation();
  const deletion = useVersionedDeletion<FinanceCategoryRow>(
    deleteCategory,
    {
      done: 'Готово: невикористану категорію видалено, використану — вимкнено.',
      failed: 'Не вдалося видалити категорію.',
    },
    setActionMessage,
  );
  const counts = countFinanceCategories(all, scope);
  const allRows = useMemo(
    () => financeCategoryRows(all, scope, direction, ''),
    [all, scope, direction],
  );
  const rows = useMemo(
    () => (search.trim() ? financeCategoryRows(all, scope, direction, search) : allRows),
    [all, allRows, scope, direction, search],
  );
  return {
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
  };
}
