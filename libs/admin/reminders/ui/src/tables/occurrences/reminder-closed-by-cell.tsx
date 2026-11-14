import { formatReminderDateTime } from '@admin/reminders/model';
import { Box, Typography } from '@mui/material';

import type { ReminderOccurrence } from '@admin/reminders/model';

export function ReminderClosedByCell({ occurrence }: { occurrence: ReminderOccurrence }) {
  if (!occurrence.closedBy) return <Typography variant="body2">—</Typography>;
  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="body2">{occurrence.closedBy.name}</Typography>
      <Typography
        variant="caption"
        component="p"
        sx={{ color: 'text.secondary', fontFamily: 'var(--admin-font-mono)' }}
      >
        {formatReminderDateTime(occurrence.closedAt)}
      </Typography>
    </Box>
  );
}
