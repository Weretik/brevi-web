import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { sewingVariantColumns as columns } from './sewing-variants-grid.columns';

import type { SewingVariantRow } from '@admin/products/model';

interface Props {
  rows: SewingVariantRow[];
  loading: boolean;
  canManage: boolean;
  /** Cost columns are for Admin only (CAT-019). */
  showCost?: boolean;
  onOpen: (row: SewingVariantRow) => void;
  onEdit: (row: SewingVariantRow) => void;
  onDelete: (row: SewingVariantRow) => void;
}

/**
 * «Тканини» tab, as the sheet «Прайс на сайт»: one row per fabric of the model with its sale SKU,
 * metres, live cost and three prices. A row opens the side panel of the fabric.
 */
export function SewingVariantsGrid({
  rows,
  loading,
  canManage,
  showCost = true,
  onOpen,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();
  const gridColumns = useMemo(
    () => columns(canManage, showCost, onEdit, onDelete),
    [canManage, showCost, onDelete, onEdit],
  );
  return (
    <Box
      sx={{
        height: 'var(--admin-table-height)',
        '& .sewing-mono': {
          fontFamily: 'var(--admin-font-mono)',
          fontVariantNumeric: 'tabular-nums',
        },
        '& .sewing-strong': { fontWeight: 600 },
      }}
    >
      <DataGrid
        aria-label="Тканини моделі"
        rows={rows}
        columns={gridColumns}
        loading={loading}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        disableColumnMenu
        onRowClick={({ row }) => onOpen(row)}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        localeText={{
          ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
          noRowsLabel: 'Тканин поки немає',
        }}
        sx={{
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .MuiDataGrid-cell': { minHeight: 44 },
        }}
      />
    </Box>
  );
}
