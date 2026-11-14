import {
  useGetProductionOrderFilterOptionsQuery,
  useGetProductionOrdersQuery,
} from '@admin/production/data-access';
import {
  PRODUCTION_DUE_SOON_DAYS,
  emptyProductionOrderFilters,
  todayIso,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { useDebouncedValue } from '../requests/use-debounced-value';

import type {
  ProductionOrderFilterField,
  ProductionOrderFilterValues,
  ProductionOrderListQuery,
  ProductionOrderSort,
  ProductionOrderStatus,
  ProductionStage,
} from '@admin/production/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

const addDays = (today: string, days: number) => {
  const date = new Date(`${today}T00:00:00`);
  date.setDate(date.getDate() + days);
  return todayIso(date);
};

/** «Прострочені»: due before today; «Термін горить»: also due today or within three days. */
export type ProductionOrderUrgency = 'overdue' | 'dueSoon';

/**
 * «Виробничі завдання» list: search, status, «Прострочені» / «Термін горить», manager, stage and «Фільтри» (client,
 * period, model, fabric, colour, season), server sort and pages. It opens on «Нові», nearest due date first.
 */
export function useProductionOrders() {
  const today = todayIso();
  const [search, setSearchValue] = useState('');
  const [status, setStatusValue] = useState<ProductionOrderStatus | null>('New');
  const [urgency, setUrgencyValue] = useState<ProductionOrderUrgency | null>(null);
  const [sort, setSortValue] = useState<ProductionOrderSort>('due');
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
    status: urgency ? 'New' : status,
    manager,
    dueTo:
      urgency === 'overdue'
        ? addDays(today, -1)
        : urgency === 'dueSoon'
          ? addDays(today, PRODUCTION_DUE_SOON_DAYS)
          : null,
    stage,
    // A period that ends before it starts is shown as an error and not sent.
    filters:
      filters.from && filters.to && filters.to < filters.from ? { ...filters, to: null } : filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sort,
  };
  const result = useGetProductionOrdersQuery(query);
  const options = useGetProductionOrderFilterOptionsQuery();
  const firstPage = () => setPagination((current) => ({ ...current, page: 0 }));

  return {
    today,
    query,
    search,
    status,
    urgency,
    sort,
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
      setUrgencyValue(null);
      // The «конвеєр» counts only «Нове» orders, so a stage does not stay on another status.
      if (value !== 'New') setStageValue(null);
      firstPage();
    },
    setUrgency: (value: ProductionOrderUrgency | null) => {
      setUrgencyValue(value);
      firstPage();
    },
    setSort: (value: ProductionOrderSort) => {
      setSortValue(value);
      firstPage();
    },
    setManager: (value: string | null) => {
      setManagerValue(value);
      firstPage();
    },
    setStage: (value: ProductionStage | null) => {
      setStageValue(value);
      // A stage of the «конвеєр» is a stage of «Нове» orders.
      if (value) setStatusValue('New');
      firstPage();
    },
    setFilter: (field: ProductionOrderFilterField, value: string | null) => {
      setFiltersValue((current) => ({ ...current, [field]: value }));
      firstPage();
    },
    /** «Скинути» of «Фільтри»: the panel's fields and the manager. */
    resetFilters: () => {
      setFiltersValue(emptyProductionOrderFilters);
      setManagerValue(null);
      firstPage();
    },
  };
}
