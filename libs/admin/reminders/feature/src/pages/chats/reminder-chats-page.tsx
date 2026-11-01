import { useGetReminderChatsQuery } from '@admin/reminders/data-access';
import {
  AssignReminderChatDialog,
  ReminderBotSetupCard,
  ReminderChatDialog,
  ReminderChatsTable,
  ReminderNoticeSnackbar,
  RemindersLoadState,
  RemindersPageHeader,
} from '@admin/reminders/ui';
import { Box, Button, Card, Stack } from '@mui/material';

import { reminderError } from '../../errors/reminder-error';
import { useReminderChatActions } from '../../hooks/chats/use-reminder-chat-actions';
import { useReminderNotice } from '../../hooks/notice/use-reminder-notice';

export default function ReminderChatsPage() {
  const chats = useGetReminderChatsQuery();
  const notice = useReminderNotice();
  const actions = useReminderChatActions(notice);
  const rows = chats.currentData ?? [];
  const waiting = rows.filter((chat) => !chat.isApproved && chat.isBotMember).length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 3.5 }, minWidth: 0 }}>
      <Stack spacing={2}>
        <RemindersPageHeader
          title="Чати Telegram"
          subtitle={
            chats.currentData
              ? `${rows.length} чатів${waiting ? ` · ${waiting} чекають підтвердження` : ''}`
              : undefined
          }
          actions={
            <Button
              variant="outlined"
              disabled={chats.isFetching}
              onClick={() => void chats.refetch()}
            >
              Оновити
            </Button>
          }
        />
        <ReminderBotSetupCard
          connecting={actions.connecting}
          onConnect={() => void actions.connectBot()}
        />
        <RemindersLoadState
          loading={chats.isLoading}
          error={chats.error ? reminderError(chats.error, 'Не вдалося завантажити чати.') : null}
          empty={false}
          emptyText=""
          loadingLabel="Завантаження чатів"
          onRetry={() => void chats.refetch()}
        />
        {chats.currentData && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <ReminderChatsTable
              rows={rows}
              loading={chats.isFetching}
              busyId={actions.testingId}
              onEdit={actions.openEditor}
              onTest={(chat) => void actions.test(chat)}
              onAssign={actions.openAssign}
            />
          </Card>
        )}
      </Stack>
      <ReminderChatDialog
        chat={actions.editing}
        saving={actions.saving}
        error={actions.dialogError}
        onClose={actions.closeEditor}
        onSave={(input) => void actions.save(input)}
      />
      <AssignReminderChatDialog
        chat={actions.assigning}
        saving={actions.assigningBusy}
        error={actions.dialogError}
        onClose={actions.closeAssign}
        onAssign={(organizations) => void actions.assignTo(organizations)}
      />
      <ReminderNoticeSnackbar notice={notice.notice} onClose={notice.close} />
    </Box>
  );
}
