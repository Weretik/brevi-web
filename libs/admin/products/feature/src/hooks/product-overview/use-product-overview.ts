import { useListProductOverviewQuery } from '@admin/products/data-access';
import { buildProductListRows, orderSectionCounts } from '@admin/products/model';
import { productSortFields } from '@admin/products/ui';
import { useListProductSectionsQuery } from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useCallback, useMemo, useState } from 'react';

import { useDebouncedValue } from '../debounce/use-debounced-value';

import type {
  ProductOverviewListQuery,
  ProductOverviewType,
  ProductSectionFilter,
} from '@admin/products/model';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

const firstPage: GridPaginationModel = { page: 0, pageSize: 25 };

/**
 * One «Товари» tab (CAT-013): search, section, «Активні»/«Вимкнені» (CAT-018), «Без ціни», page and sort go to the server, which
 * returns the page with published prices and fabric variants in one request.
 */
export function useProductOverview(type: ProductOverviewType) {
  const [search, setSearchText] = useState('');
  const [section, setSectionFilter] = useState<ProductSectionFilter>(null);
  const [withoutPrice, setWithoutPrice] = useState(false);
  const [active, setActiveFilter] = useState<boolean | null>(null);
  const [pagination, setPagination] = useState<GridPaginationModel>(firstPage);
  const [sortModel, setSort] = useState<GridSortModel>([]);
  const [expanded, setExpanded] = useState<ReadonlySet<number>>(new Set());
  const debouncedSearch = useDebouncedValue(search, 300);

  const sort = sortModel[0];
  const query: ProductOverviewListQuery = {
    type,
    search: debouncedSearch,
    section,
    withoutPrice,
    active,
    sort: (sort && productSortFields[sort.field]) ?? 'code',
    direction: sort?.sort === 'desc' ? 'desc' : 'asc',
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
  };
  const list = useListProductOverviewQuery(query);
  const sectionsResult = useListProductSectionsQuery();

  const sections = useMemo(
    () => (sectionsResult.data ?? []).filter((item) => item.type === type),
    [sectionsResult.data, type],
  );
  const sectionNames = useMemo(
    () => new Map((sectionsResult.data ?? []).map((item) => [item.id, item.name])),
    [sectionsResult.data],
  );
  const counts = useMemo(
    () =>
      orderSectionCounts(
        list.data?.sections ?? [],
        sections.map((item) => item.id),
      ),
    [list.data?.sections, sections],
  );
  const items = list.data?.items;
  const listRows = useMemo(() => buildProductListRows(items ?? [], expanded), [items, expanded]);

  const toFirstPage = () => setPagination((current) => ({ ...current, page: 0 }));
  const toggle = useCallback(
    (productId: number) =>
      setExpanded((current) => {
        const next = new Set(current);
        if (!next.delete(productId)) next.add(productId);
        return next;
      }),
    [],
  );
  const failure = list.error ?? sectionsResult.error;

  return {
    items: items ?? [],
    listRows,
    toggle,
    search,
    setSearch: (value: string) => {
      setSearchText(value);
      toFirstPage();
    },
    section,
    setSection: (value: ProductSectionFilter) => {
      setSectionFilter(value);
      toFirstPage();
    },
    withoutPrice: {
      count: list.data?.withoutPrice ?? 0,
      selected: withoutPrice,
      onToggle: () => {
        setWithoutPrice((value) => !value);
        toFirstPage();
      },
    },
    activity: {
      value: active,
      inactive: list.data?.inactive ?? 0,
      onChange: (value: boolean | null) => {
        setActiveFilter(value);
        toFirstPage();
      },
    },
    counts,
    total: list.data?.total ?? 0,
    all: list.data?.all ?? 0,
    server: {
      rowCount: list.data?.total ?? 0,
      paginationModel: pagination,
      onPaginationModelChange: setPagination,
      sortModel,
      onSortModelChange: (model: GridSortModel) => {
        setSort(model);
        toFirstPage();
      },
    },
    sections,
    sectionNames,
    loading: list.isFetching || sectionsResult.isLoading,
    error: failure ? adminApiErrorMessage(failure, 'Не вдалося завантажити товари.') : null,
    reload: () => {
      void list.refetch();
      void sectionsResult.refetch();
    },
  };
}
