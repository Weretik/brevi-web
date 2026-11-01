import { formatReminderDate } from '@admin/reminders/model';
import { Typography } from '@mui/material';

export function ReminderOccurrenceDueCell({
  dueDate,
  overdue,
}: {
  dueDate: string;
  overdue: boolean;
}) {
  return (
    <Typography
      variant="body2"
      sx={{
        fontFamily: 'var(--brevi-font-mono)',
        fontVariantNumeric: 'tabular-nums',
        color: overdue ? 'error.main' : undefined,
      }}
    >
      {formatReminderDate(dueDate)}
    </Typography>
  );
}
