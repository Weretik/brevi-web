import { describeSchedule, formatKyivDateTime } from '@admin/scheduling/model';
import { Box, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { TaskProblemPills } from './task-problem-pills';

import type { ScheduledTask } from '@admin/scheduling/model';
import type { GridColDef } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  tasks: ScheduledTask[];
  loading: boolean;
  onOpen: (task: ScheduledTask) => void;
}

function TwoLines({
  first,
  second,
  tone,
}: {
  first: string;
  second?: string | null;
  tone?: 'error';
}) {
  return (
    <Box sx={{ py: 1, minWidth: 0, whiteSpace: 'normal', lineHeight: 1.3 }}>
      <Typography variant="body2" className="reference-mono">
        {first}
      </Typography>
      {second && (
        <Typography variant="caption" color={tone === 'error' ? 'error.main' : 'text.secondary'}>
          {second}
        </Typography>
      )}
    </Box>
  );
}

const columns: GridColDef<ScheduledTask>[] = [
  {
    field: 'name',
    headerName: 'Задача',
    flex: 1.4,
    minWidth: 260,
    renderCell: ({ row }) => (
      <Box sx={{ py: 1, whiteSpace: 'normal', lineHeight: 1.3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.description}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'schedule',
    headerName: 'Розклад',
    flex: 0.8,
    minWidth: 170,
    valueGetter: (_value, row) => describeSchedule(row.schedule),
  },
  {
    field: 'nextRunAt',
    headerName: 'Наступний запуск',
    minWidth: 160,
    renderCell: ({ row }) => <TwoLines first={formatKyivDateTime(row.nextRunAt)} />,
  },
  {
    field: 'lastSuccessAt',
    headerName: 'Остання успішна',
    flex: 1,
    minWidth: 200,
    renderCell: ({ row }) => (
      <TwoLines first={formatKyivDateTime(row.lastSuccessAt)} second={row.lastSuccessSummary} />
    ),
  },
  {
    field: 'lastFailureAt',
    headerName: 'Остання помилка',
    flex: 1,
    minWidth: 200,
    renderCell: ({ row }) => (
      <TwoLines
        first={formatKyivDateTime(row.lastFailureAt)}
        second={row.lastFailureReason}
        tone="error"
      />
    ),
  },
  {
    field: 'state',
    headerName: 'Увага',
    minWidth: 190,
    sortable: false,
    renderCell: ({ row }) => (
      <Box sx={{ py: 1 }}>
        <TaskProblemPills task={row} />
      </Box>
    ),
  },
];

/** R-01: every task in the backend's order; a row opens the side panel. */
export function BackgroundTasksTable({ tasks, loading, onOpen }: Props) {
  return (
    <Paper variant="outlined" sx={{ height: 'var(--admin-table-height)', minWidth: 0 }}>
      <DataGrid
        aria-label="Фонові задачі"
        rows={tasks}
        columns={columns}
        getRowId={(row) => row.key}
        getRowHeight={() => 'auto'}
        loading={loading}
        disableRowSelectionOnClick
        disableColumnMenu
        disableVirtualization
        hideFooter
        onRowClick={({ row }) => onOpen(row)}
        localeText={{ noRowsLabel: 'Задач немає' }}
        sx={{ border: 0, '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />
    </Paper>
  );
}
