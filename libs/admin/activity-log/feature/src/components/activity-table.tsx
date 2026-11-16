import {
  activityActionLabel,
  activityRoleLabel,
  formatActivityTime,
} from '@admin/activity-log/model';
import { UserAvatar } from '@admin/shared/ui';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ActivityChanges } from './activity-changes';

import type { ActivityEntry } from '@admin/activity-log/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  entries: ActivityEntry[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  emptyText: string;
  onPage: (page: number) => void;
  onOpen: (entry: ActivityEntry) => void;
}

const cell = { py: 1, minWidth: 0, whiteSpace: 'normal', lineHeight: 1.3 } as const;

const columns: GridColDef<ActivityEntry>[] = [
  {
    field: 'occurredAt',
    headerName: 'Коли',
    width: 150,
    renderCell: ({ row }) => (
      <Typography variant="body2" className="reference-mono" sx={{ py: 1 }}>
        {formatActivityTime(row.occurredAt)}
      </Typography>
    ),
  },
  {
    field: 'actorName',
    headerName: 'Хто',
    flex: 0.8,
    minWidth: 190,
    renderCell: ({ row }) => (
      <Stack direction="row" sx={{ ...cell, gap: 1, alignItems: 'center' }}>
        <UserAvatar name={row.actorName} size={28} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.actorName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.actorRoles.map(activityRoleLabel).join(', ')}
          </Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: 'action',
    headerName: 'Дія',
    width: 130,
    valueGetter: (_value, row) => activityActionLabel(row.action),
  },
  {
    field: 'subjectTitle',
    headerName: "Об'єкт",
    flex: 1,
    minWidth: 220,
    renderCell: ({ row }) => (
      <Box sx={cell}>
        <Typography variant="caption" color="text.secondary">
          {row.subjectTypeTitle}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.subjectTitle}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'changes',
    headerName: 'Що змінено',
    flex: 1.4,
    minWidth: 280,
    renderCell: ({ row }) => (
      <Box sx={cell}>
        {row.summary && <Typography variant="body2">{row.summary}</Typography>}
        <ActivityChanges changes={row.changes} limit={2} />
      </Box>
    ),
  },
];

/** R-01: newest first, 50 per page from the server; a row opens the side panel. */
export function ActivityTable({
  entries,
  total,
  page,
  pageSize,
  loading,
  emptyText,
  onPage,
  onOpen,
}: Props) {
  const model: GridPaginationModel = { page: page - 1, pageSize };
  return (
    <Paper variant="outlined" sx={{ height: 'var(--admin-table-height)', minWidth: 0 }}>
      <DataGrid
        aria-label="Журнал дій"
        rows={entries}
        columns={columns}
        getRowHeight={() => 'auto'}
        loading={loading}
        paginationMode="server"
        rowCount={total}
        paginationModel={model}
        pageSizeOptions={[pageSize]}
        onPaginationModelChange={(next) => onPage(next.page + 1)}
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnSorting
        disableVirtualization
        onRowClick={({ row }) => onOpen(row)}
        localeText={{ noRowsLabel: emptyText }}
        sx={{ border: 0, '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />
    </Paper>
  );
}
