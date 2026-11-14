import { usePageRights } from '@admin/shared/ui';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { ReferenceGridFooter } from '../../components/reference-list/reference-grid-footer';
import { ReferenceRowMenu } from '../../components/reference-list/reference-row-menu';
import { useReferenceRowContextMenu } from '../../hooks/reference-row-actions/use-reference-row-context-menu';

import type { PageAction } from '@admin/shared/ui';
import type {
  GridColDef,
  GridColumnGroupingModel,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface ReferenceRow extends GridValidRowModel {
  /** Numeric ids in references; text ids (uuid) in other modules. */
  id: number | string;
  name: string;
}

interface Props<Row extends ReferenceRow> {
  ariaLabel: string;
  rows: Row[];
  /** Data columns; the row actions column is added at the end. */
  columns: GridColDef<Row>[];
  loading: boolean;
  /** True when the full list has rows, so an empty result means nothing matched. */
  searching?: boolean;
  unavailable?: boolean;
  emptyLabel: string;
  notFoundLabel: string;
  menuLabel: string;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (row: Row) => void;
  onEdit: (row: Row) => void;
  onDelete: (id: Row['id']) => void;
  /** Rows that are details of another row (no checkbox, no menu). */
  isDetailRow?: (row: Row) => boolean;
  /** Column sorting; off when the row order carries meaning (detail rows follow their parent). */
  sortable?: boolean;
  /** Label of the menu's view action. */
  viewLabel?: string;
  /** A full page of the row: a «Відкрити повну картку» button next to «…» and in the menu. */
  openHref?: (row: Row) => string;
  /** Label of the menu's delete action; «Видалити» by default. */
  deleteLabel?: string;
  /** The «Права доступу» action of the last menu item: delete by default, edit when it archives or voids. */
  deleteRight?: PageAction;
  /** Checkbox column and selected count; off for lists without bulk actions. */
  selectable?: boolean;
  /**
   * Paging and sorting on the server: `rows` is the current page (with its detail rows) and
   * `rowCount` the number of matching rows.
   */
  server?: {
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    sortModel: GridSortModel;
    onSortModelChange: (model: GridSortModel) => void;
  };
  /** Header groups over data columns, for example «2 кольори» over «Основна», «Додаткова», «Разом». */
  columnGroupingModel?: GridColumnGroupingModel;
  /** Taller rows for a two-line cell; 52 by default. */
  rowHeight?: number;
}

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
  const actionsColumn: GridColDef<Row> = {
    field: 'actions',
    headerName: 'Дії',
    width: openHref ? 104 : 64,
    align: 'center',
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: ({ row, tabIndex }) =>
      isDetailRow?.(row) ? null : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {openHref && (
            <Tooltip title="Відкрити повну картку">
              <IconButton
                size="small"
                href={openHref(row)}
                aria-label={`Відкрити повну картку: ${row.name}`}
                tabIndex={tabIndex}
                onClick={(event) => event.stopPropagation()}
                sx={{ width: 40, height: 40 }}
              >
                <OpenInFullOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            size="small"
            aria-label={`Дії: ${row.name}`}
            tabIndex={tabIndex}
            aria-haspopup="menu"
            aria-expanded={rowMenu?.row.id === row.id ? true : undefined}
            onClick={(event) => {
              event.stopPropagation();
              const bounds = event.currentTarget.getBoundingClientRect();
              openRowMenu(row, { left: bounds.right, top: bounds.bottom }, event.currentTarget);
            }}
            sx={{ width: 40, height: 40 }}
          >
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
  };

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
