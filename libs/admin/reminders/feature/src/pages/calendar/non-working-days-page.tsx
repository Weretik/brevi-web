import { useGetNonWorkingDaysQuery } from '@admin/reminders/data-access';
import { formatReminderDate } from '@admin/reminders/model';
import {
  NonWorkingDayForm,
  NonWorkingDaysTable,
  ReminderConfirmDialog,
  ReminderNoticeSnackbar,
  RemindersLoadState,
  RemindersPageHeader,
} from '@admin/reminders/ui';
import { Alert, Box, Card, Stack } from '@mui/material';

import { reminderError } from '../../errors/reminder-error';
import { useNonWorkingDayActions } from '../../hooks/calendar/use-non-working-day-actions';
import { useReminderNotice } from '../../hooks/notice/use-reminder-notice';

export default function NonWorkingDaysPage() {
  const days = useGetNonWorkingDaysQuery();
  const notice = useReminderNotice();
  const actions = useNonWorkingDayActions(notice);
  const rows = days.currentData ?? [];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 3.5 }, minWidth: 0 }}>
      <Stack spacing={2}>
        <RemindersPageHeader
          title="Неробочі дні"
          subtitle="Субота й неділя вихідні завжди. Тут — додаткові дні."
        />
        <Alert severity="info">
          Під час воєнного стану державні свята — робочі дні. Додавайте сюди лише дні, коли
          нагадування не потрібні; «останній робочий день» зсунеться раніше.
        </Alert>
        <Card variant="outlined" sx={{ p: 2 }}>
          <NonWorkingDayForm saving={actions.adding} onAdd={actions.addDay} />
        </Card>
        <RemindersLoadState
          loading={days.isLoading}
          error={days.error ? reminderError(days.error, 'Не вдалося завантажити дні.') : null}
          empty={!!days.currentData && !rows.length}
          emptyText="Додаткових неробочих днів немає."
          loadingLabel="Завантаження неробочих днів"
          onRetry={() => void days.refetch()}
        />
        {rows.length > 0 && (
          <NonWorkingDaysTable
            days={rows}
            busyDate={actions.removingBusy ? (actions.removing?.date ?? null) : null}
            onRemove={actions.askRemove}
          />
        )}
      </Stack>
      <ReminderConfirmDialog
        open={!!actions.removing}
        title="Зробити день робочим?"
        text={`${formatReminderDate(actions.removing?.date)} знову буде робочим днем для нагадувань.`}
        confirmLabel="Прибрати"
        busy={actions.removingBusy}
        onClose={actions.cancelRemove}
        onConfirm={() => void actions.confirmRemove()}
      />
      <ReminderNoticeSnackbar notice={notice.notice} onClose={notice.close} />
    </Box>
  );
}
