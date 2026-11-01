import {
  formatReminderDate,
  formatReminderDateTime,
  reminderActionKindLabels,
} from '@admin/reminders/model';
import { Box, Stack, Typography } from '@mui/material';

import type { ReminderAction } from '@admin/reminders/model';

interface Props {
  actions: readonly ReminderAction[];
}

/** Who pressed what and when, newest first. */
export function ReminderOccurrenceHistory({ actions }: Props) {
  if (!actions.length)
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Ще ніхто нічого не натискав.
      </Typography>
    );
  const ordered = [...actions].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <Stack component="ol" spacing={1.5} sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {ordered.map((action) => (
        <Box
          component="li"
          key={`${action.kind}-${action.at}`}
          sx={{ borderLeft: 2, borderColor: 'divider', pl: 1.5 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {reminderActionKindLabels[action.kind]}
            {action.snoozedUntil ? ` до ${formatReminderDate(action.snoozedUntil)}` : ''}
          </Typography>
          <Typography variant="caption" component="p" sx={{ color: 'text.secondary' }}>
            {action.actor.name} ·{' '}
            <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
              {formatReminderDateTime(action.at)}
            </Box>
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
