import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { ReferenceGridFooter } from './reference-grid-footer';
import { ReferenceRowMenu } from './reference-row-menu';
import { useReferenceRowContextMenu } from '../../hooks/reference-row-actions/use-reference-row-context-menu';

import type { GridColDef, GridRowSelectionModel, GridValidRowModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface ReferenceRow extends GridValidRowModel {
  id: number;
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
  onDelete: (id: number) => void;
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
}: Props<Row>) {
  const theme = useTheme();
  const { rowMenu, openRowMenu, closeRowMenu, rowSlotProps } = useReferenceRowContextMenu(rows);
  const actionsColumn: GridColDef<Row> = {
    field: 'actions',
    headerName: 'Дії',
    width: 64,
    align: 'center',
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: ({ row, tabIndex }) => (
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
    ),
  };

  return (
    <>
      <Box sx={{ width: '100%', minWidth: 0 }}>
        <DataGrid
          aria-label={ariaLabel}
          rows={rows}
          columns={[...columns, actionsColumn]}
          loading={loading}
          rowHeight={52}
          columnHeaderHeight={44}
          localeText={{
            ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
            noRowsLabel: unavailable
              ? 'Список недоступний. Повторіть запит.'
              : searching
                ? notFoundLabel
                : emptyLabel,
          }}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          disableRowSelectionExcludeModel
          keepNonExistentRowsSelected
          rowSelectionModel={selection}
          onRowSelectionModelChange={onSelectionChange}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          slots={{ footer: ReferenceGridFooter }}
          slotProps={{ row: rowSlotProps }}
          sx={{
            minWidth: 0,
            border: 0,
            borderTop: 1,
            borderColor: 'divider',
            borderRadius: 0,
            '& .reference-mono': {
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
            },
            '& .reference-strong': { fontWeight: 600 },
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
      />
    </>
  );
}
