import { usePageRights } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { referenceActionsColumn } from './reference-actions-column';
import { ReferenceGridFooter } from '../../components/reference-list/reference-grid-footer';
import { ReferenceRowMenu } from '../../components/reference-list/reference-row-menu';
import { useReferenceRowContextMenu } from '../../hooks/reference-row-actions/use-reference-row-context-menu';

import type { ReferenceDataGridProps as Props, ReferenceRow } from './reference-data-grid.props';
import type {} from '@mui/x-data-grid/themeAugmentation';

/**
 * «Цех» reference table: checkbox selection, mono cells (`reference-mono` class), a row menu on
 * the «…» button, right click and Shift+F10, and a footer with the selected count.
 */
export function ReferenceDataGrid<Row extends ReferenceRow>({
  ariaLabel,
  rows,
  columns,
  loading,
  searching = false,
  unavailable = false,
  emptyLabel,
  notFoundLabel,
  menuLabel,
  selection,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  isDetailRow,
  sortable = true,
  viewLabel,
  openHref,
  deleteLabel,
  deleteRight,
  selectable = true,
  server,
  columnGroupingModel,
  rowHeight = 52,
}: Props<Row>) {
  const theme = useTheme();
  // Rows are selected only for bulk delete, so without «Видалення» there is nothing to select.
  const { canDelete } = usePageRights();
  const selecting = selectable && canDelete;
  const menuRows = isDetailRow ? rows.filter((row) => !isDetailRow(row)) : rows;
  const { rowMenu, openRowMenu, closeRowMenu, rowSlotProps } = useReferenceRowContextMenu(menuRows);
  const actionsColumn = referenceActionsColumn<Row>({
    isDetailRow,
    openHref,
    openRowId: rowMenu?.row.id,
    onOpenMenu: (row, target) => {
      const bounds = target.getBoundingClientRect();
      openRowMenu(row, { left: bounds.right, top: bounds.bottom }, target);
    },
  });

  return (
    <>
      <Box sx={{ width: '100%', minWidth: 0 }}>
        <DataGrid
          aria-label={ariaLabel}
          rows={rows}
          columns={(sortable
            ? columns
            : columns.map((column) => ({ ...column, sortable: false }))
          ).concat(actionsColumn)}
          isRowSelectable={isDetailRow ? ({ row }) => !isDetailRow(row) : undefined}
          getRowClassName={
            isDetailRow ? ({ row }) => (isDetailRow(row) ? 'reference-detail-row' : '') : undefined
          }
          loading={loading}
          rowHeight={rowHeight}
          columnGroupingModel={columnGroupingModel}
          columnHeaderHeight={44}
          localeText={{
            ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
            noRowsLabel: unavailable
              ? 'Список недоступний. Повторіть запит.'
              : searching
                ? notFoundLabel
                : emptyLabel,
          }}
          checkboxSelection={selecting}
          disableRowSelectionOnClick
          disableRowSelectionExcludeModel
          keepNonExistentRowsSelected
          rowSelectionModel={selection}
          onRowSelectionModelChange={onSelectionChange}
          pageSizeOptions={[10, 25, 50, 100]}
          {...(server
            ? {
                paginationMode: 'server' as const,
                sortingMode: 'server' as const,
                rowCount: server.rowCount,
                paginationModel: server.paginationModel,
                onPaginationModelChange: server.onPaginationModelChange,
                sortModel: server.sortModel,
                onSortModelChange: server.onSortModelChange,
              }
            : { initialState: { pagination: { paginationModel: { pageSize: 10, page: 0 } } } })}
          slots={selecting ? { footer: ReferenceGridFooter } : undefined}
          slotProps={{ row: rowSlotProps }}
          sx={{
            minWidth: 0,
            height: 'var(--admin-table-height)',
            border: 0,
            borderTop: 1,
            borderColor: 'divider',
            borderRadius: 0,
            '& .reference-mono': {
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
            },
            '& .reference-strong': { fontWeight: 600 },
            '& .reference-detail-row': { bgcolor: 'action.hover' },
            '& .reference-detail-row .MuiDataGrid-cellCheckbox > *': { visibility: 'hidden' },
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
          }}
        />
      </Box>
      <ReferenceRowMenu
        anchorPosition={rowMenu?.anchorPosition ?? null}
        row={rowMenu?.row ?? null}
        fallbackLabel={menuLabel}
        onClose={closeRowMenu}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        viewLabel={viewLabel}
        openHref={openHref}
        deleteLabel={deleteLabel}
        deleteRight={deleteRight}
      />
    </>
  );
}
