import {
  countFinanceJournalFilters,
  defaultFinanceJournalFilter,
  financeJournalFilterProblem,
  financeJournalPageSize,
} from '@admin/accounting/model';
import { useState } from 'react';

import type {
  FinanceJournalFilter,
  FinanceJournalSort,
  FinanceSortDirection,
  LedgerScope,
} from '@admin/accounting/model';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

const sortKeys: Record<string, FinanceJournalSort> = { date: 'Date', amountMinor: 'Amount' };

/**
 * Filters, page and sort of «Операції» or «Перекази» in one area. Typed filters apply on
 * «Застосувати», which also goes back to page 1 and folds the filters; quick choices apply at once.
 */
export function useFinanceJournal(scope: LedgerScope, cutoverDate: string, today: string) {
  const defaults = defaultFinanceJournalFilter(scope, cutoverDate, today);
  const [draft, setDraft] = useState(defaults);
  const [applied, setApplied] = useState(defaults);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'date', sort: 'desc' }]);
  const sort = sortKeys[sortModel[0]?.field ?? 'date'] ?? 'Date';
  const direction: FinanceSortDirection = sortModel[0]?.sort === 'asc' ? 'Asc' : 'Desc';

  function applyNow(patch: Partial<FinanceJournalFilter>) {
    const next = { ...applied, ...patch };
    if (financeJournalFilterProblem(next)) return;
    setDraft(next);
    setApplied(next);
    setPage(0);
  }

  return {
    draft,
    /** The whole area, as the journal opens. */
    defaults,
    applied,
    open,
    problem: financeJournalFilterProblem(draft),
    activeCount: countFinanceJournalFilters(applied, defaults),
    sort,
    direction,
    /** The server counts pages from 1. */
    page: page + 1,
    paginationModel: { page, pageSize: financeJournalPageSize } satisfies GridPaginationModel,
    sortModel,
    setDraft: (next: FinanceJournalFilter) => setDraft(next),
    toggle: () => setOpen((value) => !value),
    apply: () => {
      if (financeJournalFilterProblem(draft)) return;
      setApplied(draft);
      setPage(0);
      setOpen(false);
    },
    /** Applies a quick choice (period, type, search) at once, keeping the other filters. */
    applyNow,
    reset: () => {
      setDraft(defaults);
      setApplied(defaults);
      setPage(0);
    },
    changePage: (model: GridPaginationModel) => setPage(model.page),
    changeSort: (model: GridSortModel) => {
      setSortModel(model.length ? model : [{ field: 'date', sort: 'desc' }]);
      setPage(0);
    },
  };
}
