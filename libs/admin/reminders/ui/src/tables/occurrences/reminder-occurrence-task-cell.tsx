import { reminderOrganizationLabels } from '@admin/reminders/model';
import { Box, Typography } from '@mui/material';

import type { ReminderOccurrence } from '@admin/reminders/model';

export function ReminderOccurrenceTaskCell({ occurrence }: { occurrence: ReminderOccurrence }) {
  return (
    <Box sx={{ py: 1, minWidth: 0 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap title={occurrence.taskTitle}>
        {occurrence.taskTitle}
      </Typography>
      <Typography variant="caption" component="p" sx={{ color: 'text.secondary' }}>
        {reminderOrganizationLabels[occurrence.organization]}
      </Typography>
    </Box>
  );
}
