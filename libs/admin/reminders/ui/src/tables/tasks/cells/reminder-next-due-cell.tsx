import { formatReminderDate } from '@admin/reminders/model';
import { Box, Typography } from '@mui/material';

import type { ReminderTask } from '@admin/reminders/model';

export function ReminderNextDueCell({ task }: { task: ReminderTask }) {
  const next = task.nextDueDates[0];
  if (!next) return <Typography variant="body2">—</Typography>;
  return (
    <Box sx={{ py: 1, textAlign: 'right', width: '100%' }}>
      <Typography
        variant="body2"
        sx={{ fontFamily: 'var(--brevi-font-mono)', fontVariantNumeric: 'tabular-nums' }}
      >
        {formatReminderDate(next.dueDate)}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }} component="p">
        {next.period}
      </Typography>
    </Box>
  );
}
