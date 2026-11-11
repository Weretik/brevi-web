import {
  useGetProductionOrderFilterOptionsQuery,
  useGetProductionOrdersQuery,
} from '@admin/production/data-access';
import { emptyProductionOrderFilters, todayIso } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { useDebouncedValue } from '../requests/use-debounced-value';

import type {
  ProductionOrderFilterField,
  ProductionOrderFilterValues,
  ProductionOrderListQuery,
  ProductionOrderStatus,
  ProductionStage,
} from '@admin/production/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

const yesterday = (today: string) => {
  const date = new Date(`${today}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return todayIso(date);
};

/**
 * «Виробничі завдання» list: search, status, «Прострочені», manager, stage and «Фільтри» (client, period, model,
 * fabric, colour, season), server pages.
 */
export function useProductionOrders() {
  const today = todayIso();
  const [search, setSearchValue] = useState('');
  const [status, setStatusValue] = useState<ProductionOrderStatus | null>(null);
  const [overdue, setOverdueValue] = useState(false);
  const [manager, setManagerValue] = useState<string | null>(null);
  const [stage, setStageValue] = useState<ProductionStage | null>(null);
  const [filters, setFiltersValue] = useState<ProductionOrderFilterValues>(
    emptyProductionOrderFilters,
  );
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 50 });
  const debouncedSearch = useDebouncedValue(search);

  const query: ProductionOrderListQuery = {
    search: debouncedSearch,
    // An overdue order is a «Нове» one whose nearest due date is already behind.
    status: overdue ? 'New' : status,
    manager,
    dueTo: overdue ? yesterday(today) : null,
    stage,
    // A period that ends before it starts is shown as an error and not sent.
    filters:
      filters.from && filters.to && filters.to < filters.from ? { ...filters, to: null } : filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
  };
  const result = useGetProductionOrdersQuery(query);
  const options = useGetProductionOrderFilterOptionsQuery();
  const firstPage = () => setPagination((current) => ({ ...current, page: 0 }));

  return {
    today,
    query,
    search,
    status,
    overdue,
    manager,
    stage,
    filters,
    filterOptions: options.data ?? null,
    pagination,
    page: result.data ?? null,
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити завдання.')
      : null,
    reload: result.refetch,
    setPagination,
    setSearch: (value: string) => {
      setSearchValue(value);
      firstPage();
    },
    setStatus: (value: ProductionOrderStatus | null) => {
      setStatusValue(value);
      setOverdueValue(false);
      firstPage();
    },
    setOverdue: (value: boolean) => {
      setOverdueValue(value);
      firstPage();
    },
    setManager: (value: string | null) => {
      setManagerValue(value);
      firstPage();
    },
    setStage: (value: ProductionStage | null) => {
      setStageValue(value);
      firstPage();
    },
    setFilter: (field: ProductionOrderFilterField, value: string | null) => {
      setFiltersValue((current) => ({ ...current, [field]: value }));
      firstPage();
    },
    resetFilters: () => {
      setFiltersValue(emptyProductionOrderFilters);
      firstPage();
    },
  };
}
