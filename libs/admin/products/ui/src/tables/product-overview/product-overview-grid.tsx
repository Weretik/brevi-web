import { ReferenceDataGrid } from '@admin/references/ui';
import { useMemo } from 'react';

import { productOverviewColumns } from './columns/product-overview-columns';

import type { ProductListRow, ProductOverview, ProductOverviewType } from '@admin/products/model';
import type { GridPaginationModel, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';

export { productSortFields } from './columns/product-overview-columns';

interface Props {
  type: ProductOverviewType;
  rows: ProductListRow[];
  sectionNames: ReadonlyMap<number, string>;
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onToggle: (productId: number) => void;
  onView: (row: ProductListRow) => void;
  onEdit: (row: ProductListRow) => void;
  onDelete: (id: number) => void;
  /** Switch «Активний» (CAT-018); without it the switch is read-only. */
  onActiveChange?: (product: ProductOverview, active: boolean) => void;
  /** The product whose switch is saving. */
  activeSavingId?: number | null;
  /** Server page (CAT-013): `rowCount` matching rows, page and sort models. */
  server: {
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    sortModel: GridSortModel;
    onSortModelChange: (model: GridSortModel) => void;
  };
}

const isVariant = (row: ProductListRow) => row.kind === 'variant';

/**
 * One «Товари» table (CAT-011 design B): a model per row with its lowest prices («від …»); the arrow
 * shows its fabric variants with their prices underneath. The server pages and sorts (CAT-013).
 */
export function ProductOverviewGrid({
  type,
  sectionNames,
  onToggle,
  onActiveChange,
  activeSavingId,
  ...props
}: Props) {
  const columns = useMemo(
    () =>
      productOverviewColumns(type, sectionNames, onToggle, {
        onChange: onActiveChange,
        savingId: activeSavingId,
      }),
    [type, sectionNames, onToggle, onActiveChange, activeSavingId],
  );
  return (
    <ReferenceDataGrid
      ariaLabel={type === 'Sewing' ? 'Швейна продукція' : 'ЗІЗ'}
      columns={columns}
      emptyLabel="Товарів поки немає"
      notFoundLabel="Товарів не знайдено"
      menuLabel="Дії товару"
      isDetailRow={isVariant}
      viewLabel="Швидкий перегляд"
      openHref={(row) => `/references/products/${row.id}`}
      {...props}
    />
  );
}
