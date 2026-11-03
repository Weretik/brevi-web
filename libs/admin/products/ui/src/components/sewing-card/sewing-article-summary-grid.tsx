import {
  isSewingPricePublished,
  sewingBlockerReasons,
  sewingReadyStatus,
} from '@admin/products/model';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { SewingCardStatusPill } from './sewing-card-status-pill';
import { sewingPriceFormat } from '../sewing-pricing/sewing-price-format';

import type { SewingArticleSummaryRow, SewingCostKind } from '@admin/products/model';
import type { GridColDef } from '@mui/x-data-grid';

interface Props {
  rows: SewingArticleSummaryRow[];
  loading: boolean;
  onOpen: (articleId: number) => void;
}

const labourKinds: SewingCostKind[] = ['seamstress', 'cutting', 'master', 'manager', 'bonus'];
const money = (value: number | null) => (value === null ? '—' : sewingPriceFormat(value));
const amount = (row: SewingArticleSummaryRow, kinds: SewingCostKind[]) =>
  row.calculated
    ? row.costs
        .filter((cost) => kinds.includes(cost.kind))
        .reduce((sum, cost) => sum + cost.amount, 0)
    : null;
const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short' });

function moneyColumn(
  field: string,
  headerName: string,
  value: (row: SewingArticleSummaryRow) => number | null,
  strong = false,
): GridColDef<SewingArticleSummaryRow> {
  return {
    field,
    headerName,
    width: 130,
    align: 'right',
    headerAlign: 'right',
    cellClassName: strong ? 'sewing-mono sewing-strong' : 'sewing-mono',
    valueGetter: (_value, row) => value(row),
    valueFormatter: (value: number | null) => money(value),
  };
}

const columns: GridColDef<SewingArticleSummaryRow>[] = [
  {
    field: 'saleSku',
    headerName: 'Артикул',
    width: 120,
    cellClassName: 'sewing-mono sewing-strong',
  },
  {
    field: 'status',
    headerName: 'Статус розрахунку',
    flex: 1,
    minWidth: 240,
    sortable: false,
    renderCell: ({ row }) =>
      row.calculated ? (
        <SewingCardStatusPill label={sewingReadyStatus} tone="success" />
      ) : (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', py: 1 }}>
          {sewingBlockerReasons(row.blockers).map((reason) => (
            <SewingCardStatusPill key={reason} label={reason} tone="warning" />
          ))}
        </Box>
      ),
  },
  moneyColumn('materials', 'Матеріали', (row) => amount(row, ['materials', 'otherCosts'])),
  moneyColumn('labour', 'Праця', (row) => amount(row, labourKinds)),
  moneyColumn('overhead', 'Накладні', (row) => amount(row, ['overhead'])),
  moneyColumn('fullCost', 'Собівартість', (row) => row.fullCost, true),
  moneyColumn('retail', '1–9 шт.', (row) => row.prices?.retail ?? null, true),
  moneyColumn('wholesale', '10–40 шт.', (row) => row.prices?.wholesale ?? null),
  moneyColumn('largeWholesale', 'Від 41 шт.', (row) => row.prices?.largeWholesale ?? null),
  {
    field: 'published',
    headerName: 'Ціна в прайсі',
    width: 170,
    sortable: false,
    renderCell: ({ row }) =>
      !row.published ? (
        <SewingCardStatusPill label="Не опубліковано" tone="neutral" />
      ) : isSewingPricePublished(row) || !row.calculated ? (
        <SewingCardStatusPill
          label={`Від ${dateFormat.format(new Date(row.published.publishedAt))}`}
          tone="neutral"
        />
      ) : (
        <SewingCardStatusPill label="Ціна змінилась" tone="warning" />
      ),
  },
];

/** «Артикули» tab: every site Article with live cost and three prices, as the sheet «Прайс на сайт». */
export function SewingArticleSummaryGrid({ rows, loading, onOpen }: Props) {
  const theme = useTheme();
  const sorted = useMemo(
    () => [...rows].sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id),
    [rows],
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
        aria-label="Артикули моделі"
        rows={sorted}
        columns={columns}
        loading={loading}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        disableColumnMenu
        onRowClick={({ row }) => onOpen(row.id)}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        localeText={{
          ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
          noRowsLabel: 'Артикулів поки немає',
        }}
        sx={{
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .MuiDataGrid-cell': { minHeight: 44 },
        }}
      />
    </Box>
  );
}
