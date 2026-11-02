import { reminderOrganizationLabels } from '@admin/reminders/model';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ReminderNextDueCell } from './cells/reminder-next-due-cell';
import { ReminderTaskActionsCell } from './cells/reminder-task-actions-cell';
import { ReminderTaskTitleCell } from './cells/reminder-task-title-cell';
import { ReminderStatusPill } from '../../components/status/reminder-status-pill';

import type { ReminderTask } from '@admin/reminders/model';
import type { GridColDef } from '@mui/x-data-grid';

interface Props {
  rows: readonly ReminderTask[];
  loading: boolean;
  onEdit: (task: ReminderTask) => void;
  onArchive: (task: ReminderTask) => void;
}

export function ReminderTasksTable({ rows, loading, onEdit, onArchive }: Props) {
  const columns: GridColDef<ReminderTask>[] = [
    {
      field: 'title',
      headerName: 'Задача',
      flex: 2,
      minWidth: 280,
      renderCell: ({ row }) => <ReminderTaskTitleCell task={row} />,
    },
    {
      field: 'organization',
      headerName: 'Організація',
      minWidth: 150,
      valueGetter: (_value, row) => reminderOrganizationLabels[row.organization],
    },
    {
      field: 'nextDue',
      headerName: 'Наступний термін',
      minWidth: 150,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: ({ row }) => <ReminderNextDueCell task={row} />,
    },
    {
      field: 'chatName',
      headerName: 'Чат',
      minWidth: 170,
      flex: 1,
      renderCell: ({ row }) =>
        row.chatName ?? <ReminderStatusPill tone="warning" label="Не призначено" />,
    },
    {
      field: 'isEnabled',
      headerName: 'Стан',
      minWidth: 130,
      renderCell: ({ row }) =>
        row.isEnabled ? (
          <ReminderStatusPill tone="success" label="Увімкнено" />
        ) : (
          <ReminderStatusPill tone="neutral" label="Вимкнено" />
        ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 96,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <ReminderTaskActionsCell task={row} onEdit={onEdit} onArchive={onArchive} />
      ),
    },
  ];
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        autoHeight
        aria-label="Задачі нагадувань"
        rows={rows}
        columns={columns}
        loading={loading}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        pageSizeOptions={[25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 50, page: 0 } } }}
        slots={{ noRowsOverlay: TasksEmptyOverlay }}
      />
    </Box>
  );
}

function TasksEmptyOverlay() {
  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center' }}>
      <Typography>Задач поки немає</Typography>
    </Box>
  );
}
