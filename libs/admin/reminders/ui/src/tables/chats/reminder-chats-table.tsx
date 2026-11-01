import {
  formatReminderDateTime,
  reminderChatKindLabels,
  reminderChatName,
} from '@admin/reminders/model';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ReminderChatActionsCell } from './cells/reminder-chat-actions-cell';
import { ReminderStatusPill } from '../../components/status/reminder-status-pill';

import type { ReminderChat } from '@admin/reminders/model';
import type { GridColDef } from '@mui/x-data-grid';

interface Props {
  rows: readonly ReminderChat[];
  loading: boolean;
  busyId: number | null;
  onEdit: (chat: ReminderChat) => void;
  onTest: (chat: ReminderChat) => void;
  onAssign: (chat: ReminderChat) => void;
}

export function ReminderChatsTable({ rows, loading, busyId, onEdit, onTest, onAssign }: Props) {
  const columns: GridColDef<ReminderChat>[] = [
    {
      field: 'name',
      headerName: 'Чат',
      flex: 1,
      minWidth: 220,
      valueGetter: (_value, row) => reminderChatName(row),
      renderCell: ({ row }) => (
        <Box sx={{ py: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
            {reminderChatName(row)}
          </Typography>
          <Typography variant="caption" component="p" sx={{ color: 'text.secondary' }} noWrap>
            {reminderChatKindLabels[row.kind]}
            {row.displayName ? ` · ${row.telegramTitle}` : ''}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'isApproved',
      headerName: 'Стан',
      minWidth: 190,
      renderCell: ({ row }) =>
        !row.isBotMember ? (
          <ReminderStatusPill tone="error" label="Бота видалено з чату" />
        ) : row.isApproved ? (
          <ReminderStatusPill tone="success" label="Підтверджено" />
        ) : (
          <ReminderStatusPill tone="warning" label="Чекає підтвердження" />
        ),
    },
    {
      field: 'discoveredAt',
      headerName: 'Додано',
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
          {formatReminderDateTime(row.discoveredAt)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      minWidth: 330,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <ReminderChatActionsCell
          chat={row}
          busy={busyId === row.id}
          onEdit={onEdit}
          onTest={onTest}
          onAssign={onAssign}
        />
      ),
    },
  ];
  return (
    <Box sx={{ width: '100%', minHeight: 320 }}>
      <DataGrid
        aria-label="Чати Telegram"
        rows={rows}
        columns={columns}
        loading={loading}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        hideFooter={rows.length <= 25}
        slots={{ noRowsOverlay: ChatsEmptyOverlay }}
      />
    </Box>
  );
}

function ChatsEmptyOverlay() {
  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center', px: 2, textAlign: 'center' }}>
      <Typography>Чатів ще немає. Додайте бота в групу або напишіть йому /start.</Typography>
    </Box>
  );
}
