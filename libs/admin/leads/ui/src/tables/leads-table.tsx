import { formatLeadMoment, formatLeadNext } from '@admin/leads/model';
import { UserAvatar } from '@admin/shared/ui';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { LeadStagePill } from '../components/status/lead-stage-pill';

import type { LeadSummary } from '@admin/leads/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  rows: readonly LeadSummary[];
  rowCount: number;
  loading: boolean;
  narrowed: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (id: number) => void;
}

function columns(now: Date): GridColDef<LeadSummary>[] {
  return [
    { field: 'sourceId', headerName: '№', width: 72, cellClassName: 'lead-mono' },
    {
      field: 'company',
      headerName: 'Підприємство',
      flex: 1.5,
      minWidth: 240,
      renderCell: ({ row }) => (
        <Box sx={{ py: 0.75, lineHeight: 1.3, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
            {row.company}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap component="p">
            {[row.region, row.industry].filter(Boolean).join(' · ') || '—'}
          </Typography>
        </Box>
      ),
    },
    { field: 'category', headerName: 'Кат.', width: 70, cellClassName: 'lead-mono' },
    {
      field: 'callReason',
      headerName: 'Привід для дзвінка',
      flex: 1.2,
      minWidth: 200,
      valueGetter: (_value, row) => row.callReason ?? '',
    },
    {
      field: 'owner',
      headerName: 'Менеджер',
      width: 170,
      valueGetter: (_value, row) => row.owner?.name ?? '',
      renderCell: ({ row }) =>
        row.owner ? (
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, height: '100%' }}>
            <UserAvatar name={row.owner.name} size={24} />
            <Typography variant="body2" noWrap>
              {row.owner.name}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Вільний
          </Typography>
        ),
    },
    {
      field: 'lastCall',
      headerName: 'Останній дзвінок',
      width: 190,
      renderCell: ({ row }) =>
        row.lastCallAt ? (
          <Box sx={{ py: 0.75, lineHeight: 1.3, minWidth: 0 }}>
            <Typography variant="body2" noWrap>
              {row.lastResultName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="lead-mono"
              component="p"
            >
              {formatLeadMoment(row.lastCallAt)}
            </Typography>
          </Box>
        ) : (
          ''
        ),
    },
    {
      field: 'nextContactAt',
      headerName: 'Наступний контакт',
      width: 150,
      cellClassName: 'lead-mono',
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'inherit',
            color: row.isOverdue ? 'error.main' : 'text.primary',
            fontWeight: row.isOverdue ? 600 : 400,
          }}
        >
          {row.nextContactAt ? formatLeadNext(row.nextContactAt, now) : ''}
        </Typography>
      ),
    },
    {
      field: 'stage',
      headerName: 'Етап',
      width: 140,
      renderCell: ({ row }) => <LeadStagePill stage={row.stage} overdue={row.isOverdue} />,
    },
  ];
}

/** «Усі ліди»: one server page, overdue first; a row opens the side panel. */
export function LeadsTable({
  rows,
  rowCount,
  loading,
  narrowed,
  paginationModel,
  onPaginationModelChange,
  onOpen,
}: Props) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 'var(--admin-table-height)' }}>
        <DataGrid
          aria-label="Ліди"
          rows={rows as LeadSummary[]}
          columns={columns(new Date())}
          loading={loading}
          rowCount={rowCount}
          rowHeight={52}
          paginationMode="server"
          sortingMode="server"
          disableColumnSorting
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          onRowClick={({ row }) => onOpen(row.id)}
          localeText={{
            noRowsLabel: narrowed
              ? 'Нічого не знайдено'
              : 'Лідів ще немає: таблиця синхронізується щоранку',
            paginationRowsPerPage: 'Рядків на сторінці',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            '& .lead-mono': {
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
            },
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
          }}
        />
      </Box>
    </Paper>
  );
}
