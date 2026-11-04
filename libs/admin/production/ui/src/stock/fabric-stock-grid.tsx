import { fabricStockProblem, formatMeters, formatMoney } from '@admin/production/model';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, Paper, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { FabricStockRow } from '@admin/production/model';
import type { GridColDef } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

type Row = FabricStockRow & { key: string };

interface Props {
  rows: readonly FabricStockRow[];
  loading: boolean;
  searching: boolean;
  seesValue: boolean;
  onOpen: (row: FabricStockRow) => void;
}

const mono = 'stock-mono';

const columns = (seesValue: boolean): GridColDef<Row>[] => [
  { field: 'fabricCode', headerName: 'Код', width: 100, cellClassName: mono },
  {
    field: 'fabricName',
    headerName: 'Тканина',
    flex: 1,
    minWidth: 220,
    renderCell: ({ row }) => {
      const problem = fabricStockProblem(row);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          {problem && (
            <Tooltip title={problem}>
              <ErrorOutlineOutlinedIcon fontSize="small" color="error" aria-label={problem} />
            </Tooltip>
          )}
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {row.fabricName}
          </Typography>
        </Box>
      );
    },
  },
  { field: 'color', headerName: 'Колір', width: 150 },
  {
    field: 'meters',
    headerName: 'Залишок',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    cellClassName: mono,
    valueFormatter: (value: number) => formatMeters(value),
  },
  {
    field: 'reserved',
    headerName: 'Бронь',
    width: 110,
    align: 'right',
    headerAlign: 'right',
    cellClassName: mono,
    valueFormatter: (value: number) => (value ? formatMeters(value) : '—'),
  },
  {
    field: 'available',
    headerName: 'Доступно',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    cellClassName: ({ row }) => (row.available < 0 ? `${mono} stock-short` : mono),
    valueFormatter: (value: number) => formatMeters(value),
  },
  ...(seesValue
    ? [
        {
          field: 'value',
          headerName: 'Вартість',
          width: 140,
          align: 'right',
          headerAlign: 'right',
          cellClassName: mono,
          valueFormatter: (value: number | null) => formatMoney(value),
        } satisfies GridColDef<Row>,
      ]
    : []),
];

/**
 * «Склад тканин»: a line per fabric and colour; only problems get a mark (below zero, not enough
 * for open orders). A row opens its card.
 */
export function FabricStockGrid({ rows, loading, searching, seesValue, onOpen }: Props) {
  const gridRows: Row[] = rows.map((row) => ({ ...row, key: `${row.fabricCode}|${row.color}` }));
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 'var(--admin-table-height)' }}>
        <DataGrid
          aria-label="Склад тканин"
          rows={gridRows}
          getRowId={(row) => row.key}
          columns={columns(seesValue)}
          loading={loading}
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 100 } } }}
          onRowClick={({ row }) => onOpen(row)}
          localeText={{
            noRowsLabel: searching ? 'Нічого не знайдено' : 'На складі поки нічого немає',
            paginationRowsPerPage: 'Рядків на сторінці',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            [`& .${mono}`]: {
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
            },
            '& .stock-short': { color: 'error.main', fontWeight: 600 },
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
          }}
        />
      </Box>
    </Paper>
  );
}
