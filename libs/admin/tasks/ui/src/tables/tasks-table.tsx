import { UserAvatar } from '@admin/shared/ui';
import { formatTaskDue } from '@admin/tasks/model';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { TaskStatePill } from '../components/status/task-state-pill';

import type { TaskSummary } from '@admin/tasks/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  rows: readonly TaskSummary[];
  rowCount: number;
  loading: boolean;
  narrowed: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (id: number) => void;
}

function columns(now: Date): GridColDef<TaskSummary>[] {
  return [
    { field: 'number', headerName: '№', width: 96, cellClassName: 'task-mono' },
    {
      field: 'title',
      headerName: 'Завдання',
      flex: 1.6,
      minWidth: 240,
      renderCell: ({ row }) => (
        <Box sx={{ py: 0.75, lineHeight: 1.3, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
            {row.title}
          </Typography>
          {row.customerName && (
            <Typography variant="caption" color="text.secondary" noWrap component="p">
              Клієнт: {row.customerName}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'assignee',
      headerName: 'Менеджер',
      flex: 0.8,
      minWidth: 170,
      valueGetter: (_value, row) => row.assignee.name,
      renderCell: ({ row }) => (
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, height: '100%' }}>
          <UserAvatar name={row.assignee.name} size={24} />
          <Typography variant="body2" noWrap>
            {row.assignee.name}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'dueAt',
      headerName: 'Термін',
      width: 150,
      cellClassName: 'task-mono',
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'inherit',
            color: row.isOverdue ? 'error.main' : 'text.primary',
            fontWeight: row.isOverdue ? 600 : 400,
          }}
        >
          {formatTaskDue(row.dueAt, now, row.isOverdue)}
        </Typography>
      ),
    },
    {
      field: 'steps',
      headerName: 'Кроки',
      width: 90,
      align: 'right',
      headerAlign: 'right',
      cellClassName: 'task-mono',
      valueGetter: (_value, row) => (row.stepsTotal ? `${row.stepsDone}/${row.stepsTotal}` : ''),
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 140,
      renderCell: ({ row }) => <TaskStatePill task={row} />,
    },
  ];
}

/** «Завдання менеджерам» table: one server page, overdue first; a row opens the side panel. */
export function TasksTable({
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
          aria-label="Завдання менеджерам"
          rows={rows as TaskSummary[]}
          columns={columns(new Date())}
          loading={loading}
          rowCount={rowCount}
          rowHeight={52}
          paginationMode="server"
          sortingMode="server"
          disableColumnSorting
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          onRowClick={({ row }) => onOpen(row.id)}
          getRowClassName={({ row }) =>
            row.isUrgent && row.status !== 'Done' ? 'task-urgent' : ''
          }
          localeText={{
            noRowsLabel: narrowed ? 'Нічого не знайдено' : 'Завдань ще немає',
            paginationRowsPerPage: 'Рядків на сторінці',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            '& .task-urgent': { bgcolor: 'primary.light' },
            '& .task-mono': {
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
