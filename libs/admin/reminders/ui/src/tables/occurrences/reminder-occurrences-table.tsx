import { reminderOccurrenceState } from '@admin/reminders/model';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ReminderClosedByCell } from './cells/reminder-closed-by-cell';
import { ReminderOccurrenceActionsCell } from './cells/reminder-occurrence-actions-cell';
import { ReminderOccurrenceDueCell } from './cells/reminder-occurrence-due-cell';
import { ReminderOccurrenceTaskCell } from './cells/reminder-occurrence-task-cell';
import { ReminderOccurrenceStatePill } from '../../components/status/reminder-occurrence-state-pill';

import type { ReminderOccurrence } from '@admin/reminders/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

interface Props {
  rows: readonly ReminderOccurrence[];
  total: number;
  today: string;
  loading: boolean;
  busyId: number | null;
  pagination: GridPaginationModel;
  onPaginationChange: (model: GridPaginationModel) => void;
  onClose: (occurrence: ReminderOccurrence) => void;
  onReopen: (occurrence: ReminderOccurrence) => void;
  onHistory: (occurrence: ReminderOccurrence) => void;
}

export function ReminderOccurrencesTable(props: Props) {
  const { rows, total, today, loading, busyId, pagination, onPaginationChange } = props;
  const columns: GridColDef<ReminderOccurrence>[] = [
    {
      field: 'taskTitle',
      headerName: 'Задача',
      flex: 2,
      minWidth: 260,
      renderCell: ({ row }) => <ReminderOccurrenceTaskCell occurrence={row} />,
    },
    { field: 'period', headerName: 'Період', minWidth: 150 },
    {
      field: 'dueDate',
      headerName: 'Термін',
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <ReminderOccurrenceDueCell
          dueDate={row.dueDate}
          overdue={reminderOccurrenceState(row, today) === 'overdue'}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Статус',
      minWidth: 190,
      renderCell: ({ row }) => (
        <ReminderOccurrenceStatePill occurrence={row} state={reminderOccurrenceState(row, today)} />
      ),
    },
    {
      field: 'closedBy',
      headerName: 'Хто закрив',
      minWidth: 180,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => <ReminderClosedByCell occurrence={row} />,
    },
    {
      field: 'actions',
      headerName: '',
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <ReminderOccurrenceActionsCell
          occurrence={row}
          busy={busyId === row.id}
          onClose={props.onClose}
          onReopen={props.onReopen}
          onHistory={props.onHistory}
        />
      ),
    },
  ];
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        autoHeight
        aria-label="Періоди нагадувань"
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={total}
        paginationMode="server"
        paginationModel={pagination}
        onPaginationModelChange={onPaginationChange}
        pageSizeOptions={[25, 50, 100]}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        disableColumnSorting
        slots={{ noRowsOverlay: OccurrencesEmptyOverlay }}
      />
    </Box>
  );
}

function OccurrencesEmptyOverlay() {
  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center' }}>
      <Typography>Періодів за цими умовами немає</Typography>
    </Box>
  );
}
