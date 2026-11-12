import { useGetReminderChatsQuery, useGetReminderTasksQuery } from '@admin/reminders/data-access';
import {
  ReminderConfirmDialog,
  ReminderFilterChips,
  ReminderNoticeSnackbar,
  ReminderTaskDialog,
  ReminderTasksTable,
  RemindersLoadState,
  RemindersPageHeader,
} from '@admin/reminders/ui';
import { usePageRights } from '@admin/shared/ui';
import { Box, Button, Card, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { reminderError } from '../../errors/reminder-error';
import { useReminderNotice } from '../../hooks/notice/use-reminder-notice';
import { useReminderTaskArchive } from '../../hooks/tasks/use-reminder-task-archive';
import { useReminderTaskEditor } from '../../hooks/tasks/use-reminder-task-editor';
import { filterTasks, taskFilterOptions } from '../../model/task-filters';

import type { TaskOrganizationFilter } from '../../model/task-filters';

export default function ReminderTasksPage() {
  const tasks = useGetReminderTasksQuery();
  const chats = useGetReminderChatsQuery();
  const notice = useReminderNotice();
  const editor = useReminderTaskEditor(notice.success);
  const archive = useReminderTaskArchive(notice);
  const [filter, setFilter] = useState<TaskOrganizationFilter>('all');
  const { canCreate } = usePageRights();

  const all = tasks.currentData ?? [];
  const rows = useMemo(() => filterTasks(all, filter), [all, filter]);
  const approvedChats = (chats.currentData ?? []).filter((chat) => chat.isApproved);
  const withoutChat = all.filter((task) => task.isEnabled && task.chatId === null).length;
  const subtitle = tasks.currentData
    ? `${all.length} задач${withoutChat ? ` · ${withoutChat} без чату, вони не надсилаються` : ''}`
    : undefined;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 3.5 }, minWidth: 0 }}>
      <Stack spacing={2}>
        <RemindersPageHeader
          title="Задачі"
          subtitle={subtitle}
          actions={
            canCreate ? (
              <Button
                variant="contained"
                disabled={!tasks.currentData}
                onClick={() => editor.open()}
              >
                Нова задача
              </Button>
            ) : null
          }
        />
        <RemindersLoadState
          loading={tasks.isLoading}
          error={tasks.error ? reminderError(tasks.error, 'Не вдалося завантажити задачі.') : null}
          empty={false}
          emptyText=""
          loadingLabel="Завантаження задач"
          onRetry={() => void tasks.refetch()}
        />
        {tasks.currentData && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <ReminderFilterChips
                label="Організація"
                options={taskFilterOptions(all)}
                value={filter}
                onChange={setFilter}
              />
              <ReminderTasksTable
                rows={rows}
                loading={tasks.isFetching}
                onEdit={editor.open}
                onArchive={archive.ask}
              />
            </Stack>
          </Card>
        )}
      </Stack>
      <ReminderTaskDialog
        {...editor.dialog}
        chats={approvedChats}
        onChange={editor.change}
        onClose={editor.close}
        onSave={() => void editor.save()}
      />
      <ReminderConfirmDialog
        open={!!archive.target}
        title="Видалити задачу?"
        text={`«${archive.target?.title ?? ''}» більше не нагадуватиме. Історія виконання залишиться.`}
        confirmLabel="Видалити"
        busy={archive.busy}
        onClose={archive.cancel}
        onConfirm={() => void archive.confirm()}
      />
      <ReminderNoticeSnackbar notice={notice.notice} onClose={notice.close} />
    </Box>
  );
}
