import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { SupplierLinkCell } from './supplier-link-cell';
import { SupplierRowMenu } from './supplier-row-menu';
import { SupplierStatusPill } from './supplier-status-pill';
import { SuppliersGridFooter } from './suppliers-grid-footer';
import { useReferenceRowContextMenu } from '../../hooks/reference-row-actions/use-reference-row-context-menu';

import type { Supplier } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  rows: Supplier[];
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: number) => void;
}

export function SuppliersGrid({
  rows,
  loading,
  searching = false,
  unavailable = false,
  selection,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();
  const { rowMenu, openRowMenu, closeRowMenu, rowSlotProps } = useReferenceRowContextMenu(rows);
  const columns: GridColDef<Supplier>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 72,
      align: 'right',
      headerAlign: 'right',
      cellClassName: 'supplier-mono',
    },
    {
      field: 'name',
      headerName: 'Назва',
      flex: 1.5,
      minWidth: 220,
      renderCell: ({ row }) => (
        <Stack sx={{ justifyContent: 'center', height: '100%', minWidth: 0 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {row.name}
          </Typography>
          {row.keepinCrmId && (
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ fontFamily: 'var(--admin-font-mono)', lineHeight: 1.2 }}
            >
              KeepinCRM {row.keepinCrmId}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: 'purchaseCategories',
      headerName: 'Що закуповуємо',
      flex: 1,
      minWidth: 160,
      valueFormatter: (value: string | null) => value || '—',
    },
    {
      field: 'contactPerson',
      headerName: 'Контактна особа',
      flex: 1,
      minWidth: 170,
      valueFormatter: (value: string | null) => value || '—',
    },
    {
      field: 'phoneNumber',
      headerName: 'Телефон',
      width: 180,
      cellClassName: 'supplier-mono',
      valueFormatter: (value: string | null) => value || '—',
    },
    {
      field: 'link',
      headerName: 'Сайт',
      flex: 1,
      minWidth: 160,
      renderCell: ({ value, tabIndex }) => (
        <SupplierLinkCell value={value ?? null} tabIndex={tabIndex} />
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
      valueFormatter: (value: string | null) => value || '—',
    },
    {
      field: 'isActive',
      headerName: 'Статус',
      width: 170,
      type: 'boolean',
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <SupplierStatusPill active={Boolean(value)} />,
    },
    {
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
    },
  ];

  return (
    <>
      <Box sx={{ width: '100%', minWidth: 0 }}>
        <DataGrid
          aria-label="Постачальники"
          rows={rows}
          columns={columns}
          loading={loading}
          rowHeight={52}
          columnHeaderHeight={44}
          localeText={{
            ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
            noRowsLabel: unavailable
              ? 'Список недоступний. Повторіть запит.'
              : searching
                ? 'Постачальників не знайдено'
                : 'Постачальників поки немає',
          }}
          checkboxSelection
          disableRowSelectionOnClick
          disableRowSelectionExcludeModel
          keepNonExistentRowsSelected
          rowSelectionModel={selection}
          onRowSelectionModelChange={onSelectionChange}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          slots={{ footer: SuppliersGridFooter }}
          slotProps={{ row: rowSlotProps }}
          sx={{
            minWidth: 0,
            height: 538,
            border: 0,
            borderTop: 1,
            borderColor: 'divider',
            borderRadius: 0,
            '& .supplier-mono': {
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
            },
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
          }}
        />
      </Box>
      <SupplierRowMenu
        anchorPosition={rowMenu?.anchorPosition ?? null}
        row={rowMenu?.row ?? null}
        onClose={closeRowMenu}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
