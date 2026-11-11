import { formatSiteRequestMoment, formatSiteRequestPhone } from '@admin/leads/model';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { SiteRequestStatusPill } from '../components/status/site-request-status-pill';

import type { SiteRequest } from '@admin/leads/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  rows: readonly SiteRequest[];
  rowCount: number;
  loading: boolean;
  narrowed: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (id: number) => void;
}

const columns: GridColDef<SiteRequest>[] = [
  {
    field: 'createdAt',
    headerName: 'Надійшла',
    width: 130,
    cellClassName: 'request-mono',
    valueFormatter: (value: string) => formatSiteRequestMoment(value),
  },
  {
    field: 'phone',
    headerName: 'Телефон',
    width: 150,
    cellClassName: 'request-mono',
    valueFormatter: (value: string) => formatSiteRequestPhone(value),
  },
  {
    field: 'workwear',
    headerName: 'Що потрібно',
    flex: 1.4,
    minWidth: 240,
    renderCell: ({ row }) => (
      <Box sx={{ py: 0.75, lineHeight: 1.3, minWidth: 0 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
            {[row.workwear, row.quantity].filter(Boolean).join(' · ') || 'Без опису'}
          </Typography>
          {row.fileUrl && (
            <Tooltip title={row.fileName ?? 'Файл'}>
              <AttachFileIcon fontSize="small" color="action" aria-label="Є файл" />
            </Tooltip>
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary" noWrap component="p">
          {row.comment ?? ''}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'ownerName',
    headerName: 'Менеджер',
    width: 170,
    valueGetter: (_value, row) => row.ownerName ?? '',
  },
  {
    field: 'status',
    headerName: 'Стан',
    width: 170,
    renderCell: ({ row }) => (
      <Stack sx={{ justifyContent: 'center', height: '100%', gap: 0.25 }}>
        <Box>
          <SiteRequestStatusPill status={row.status} />
        </Box>
        {row.notifyError && (
          <Typography variant="caption" color="error.main" noWrap>
            Не надіслано в Telegram
          </Typography>
        )}
      </Stack>
    ),
  },
];

/** «Заявки з сайту»: one server page, newest first; a row opens the side panel. */
export function SiteRequestsTable({
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
          aria-label="Заявки з сайту"
          rows={rows as SiteRequest[]}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          rowHeight={56}
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
              ? 'Тут порожньо'
              : 'Заявок ще немає: вони з’являться, коли відвідувач заповнить форму на сайті',
            paginationRowsPerPage: 'Рядків на сторінці',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            '& .request-mono': {
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
