import { counterpartyKindLabels } from '@admin/accounting/model';
import { Paper, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceParty } from '@admin/accounting/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

type Row = FinanceParty & { key: string };

interface Props {
  rows: FinanceParty[];
  rowCount: number;
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  /** Opens the client card or the supplier list, where the record is edited. */
  onOpen: (party: FinanceParty) => void;
}

const columns: GridColDef<Row>[] = [
  {
    field: 'name',
    headerName: 'Назва',
    flex: 1,
    minWidth: 240,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack sx={{ py: 0.5, gap: 0.5, alignItems: 'flex-start', lineHeight: 1.3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.name}
        </Typography>
        {!row.active && <FinanceProblemPill label="Архів" />}
      </Stack>
    ),
  },
  {
    field: 'taxId',
    headerName: 'ЄДРПОУ / ІПН',
    width: 170,
    sortable: false,
    cellClassName: 'party-mono',
    valueFormatter: (value: string) => value || '—',
  },
  {
    field: 'operationCount',
    headerName: 'Операцій',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    sortable: false,
    cellClassName: 'party-mono',
  },
];

/** «Контрагенти → Клієнти / Постачальники»: read-only here, edited in their own lists. */
export function FinancePartiesGrid({ rows, onOpen, searching, unavailable, ...props }: Props) {
  const kind = rows[0]?.kind;
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <DataGrid
        aria-label={kind ? counterpartyKindLabels[kind] : 'Контрагенти'}
        rows={rows.map((row) => ({ ...row, key: `${row.kind}:${row.id}` }))}
        getRowId={(row) => row.key}
        columns={columns}
        loading={props.loading}
        rowCount={props.rowCount}
        paginationMode="server"
        paginationModel={props.paginationModel}
        onPaginationModelChange={props.onPaginationModelChange}
        pageSizeOptions={[props.paginationModel.pageSize]}
        getRowHeight={() => 'auto'}
        disableColumnMenu
        disableRowSelectionOnClick
        onRowClick={({ row }) => onOpen(row)}
        localeText={{
          noRowsLabel: unavailable
            ? 'Не вдалося завантажити список'
            : searching
              ? 'Нічого не знайдено'
              : 'Список порожній',
        }}
        sx={{
          border: 0,
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .party-mono': {
            fontFamily: 'var(--admin-font-mono)',
            fontVariantNumeric: 'tabular-nums',
          },
          '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
        }}
      />
    </Paper>
  );
}
