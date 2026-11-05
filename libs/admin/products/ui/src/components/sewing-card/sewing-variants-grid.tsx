import { sewingBlockerReasons } from '@admin/products/model';
import { ReferenceStatusPill } from '@admin/references/ui';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { SewingCardStatusPill } from './sewing-card-status-pill';
import { sewingPriceFormat } from '../sewing-pricing/sewing-price-format';

import type { SewingCostKind, SewingVariantRow } from '@admin/products/model';
import type { GridColDef } from '@mui/x-data-grid';

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

const labourKinds: SewingCostKind[] = ['seamstress', 'cutting', 'master', 'manager', 'bonus'];
const money = (value: number | null) => (value === null ? '—' : sewingPriceFormat(value));
const metres = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 });
const amount = (row: SewingVariantRow, kinds: SewingCostKind[]) =>
  row.summary?.calculated
    ? row.summary.costs
        .filter((cost) => kinds.includes(cost.kind))
        .reduce((sum, cost) => sum + cost.amount, 0)
    : null;

function moneyColumn(
  field: string,
  headerName: string,
  value: (row: SewingVariantRow) => number | null,
  strong = false,
): GridColDef<SewingVariantRow> {
  return {
    field,
    headerName,
    width: 120,
    sortable: false,
    align: 'right',
    headerAlign: 'right',
    cellClassName: strong ? 'sewing-mono sewing-strong' : 'sewing-mono',
    valueGetter: (_value, row) => value(row),
    valueFormatter: (value: number | null) => money(value),
  };
}

function columns(
  canManage: boolean,
  showCost: boolean,
  onEdit: Props['onEdit'],
  onDelete: Props['onDelete'],
): GridColDef<SewingVariantRow>[] {
  return [
    {
      field: 'fabricName',
      headerName: 'Тканина',
      flex: 1.4,
      minWidth: 200,
      sortable: false,
      cellClassName: 'sewing-strong',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, py: 1 }}>
          <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.fabricName ?? (row.fabricId === null ? 'Без тканини' : `Тканина ${row.fabricId}`)}
          </Box>
          {!row.active && (
            <ReferenceStatusPill active={false} activeLabel="" inactiveLabel="Вимкнена" />
          )}
        </Box>
      ),
    },
    {
      field: 'saleSku',
      headerName: 'Артикул',
      width: 100,
      sortable: false,
      cellClassName: 'sewing-mono',
    },
    {
      field: 'fabricQuantity',
      headerName: 'Розхід, м',
      width: 100,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      cellClassName: 'sewing-mono',
      valueFormatter: (value: number | null) => (value === null ? '—' : metres.format(value)),
    },
    ...(showCost
      ? [
          moneyColumn('materials', 'Матеріали', (row) => amount(row, ['materials', 'otherCosts'])),
          moneyColumn('labour', 'Праця', (row) => amount(row, labourKinds)),
          moneyColumn('overhead', 'Накладні', (row) => amount(row, ['overhead'])),
          moneyColumn('fullCost', 'Собівартість', (row) => row.summary?.fullCost ?? null, true),
        ]
      : []),
    {
      ...moneyColumn('retail', '1–9 шт.', (row) => row.summary?.prices?.retail ?? null, true),
      minWidth: 150,
      // Only a problem is shown: the reasons replace the missing price (CAT-013).
      renderCell: ({ row }) =>
        !row.summary || row.summary.calculated ? (
          money(row.summary?.prices?.retail ?? null)
        ) : (
          <Box
            sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', py: 1, justifyContent: 'flex-end' }}
          >
            {sewingBlockerReasons(row.summary.blockers).map((reason) => (
              <SewingCardStatusPill key={reason} label={reason} tone="warning" />
            ))}
          </Box>
        ),
    },
    moneyColumn('wholesale', '10–40 шт.', (row) => row.summary?.prices?.wholesale ?? null),
    moneyColumn(
      'largeWholesale',
      'Від 41 шт.',
      (row) => row.summary?.prices?.largeWholesale ?? null,
    ),
    ...(canManage
      ? [
          {
            field: 'actions',
            headerName: '',
            width: 96,
            sortable: false,
            renderCell: ({ row }) => (
              <Box sx={{ display: 'flex' }}>
                <Tooltip title="Змінити">
                  <IconButton
                    size="small"
                    aria-label={`Змінити тканину: ${row.fabricName ?? row.saleSku}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(row);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Видалити">
                  <IconButton
                    size="small"
                    aria-label={`Видалити тканину: ${row.fabricName ?? row.saleSku}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(row);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ),
          } satisfies GridColDef<SewingVariantRow>,
        ]
      : []),
  ];
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
