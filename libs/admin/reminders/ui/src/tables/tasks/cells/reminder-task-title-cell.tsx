import { describeReminderSchedule } from '@admin/reminders/model';
import { Box, Typography } from '@mui/material';

import type { ReminderTask } from '@admin/reminders/model';

export function ReminderTaskTitleCell({ task }: { task: ReminderTask }) {
  return (
    <Box sx={{ py: 1, minWidth: 0 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap title={task.title}>
        {task.title}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap component="p">
        {describeReminderSchedule(task.schedule)} · за {task.schedule.leadDays} дн.
      </Typography>
    </Box>
  );
}
