import { describeTaskEvent, formatTaskMoment } from '@admin/tasks/model';
import { Box, Stack, Typography } from '@mui/material';

import { taskMono as mono } from './task-steps-checklist';

import type { TaskDetail } from '@admin/tasks/model';

/** «Історія змін»: who changed what and when. */
export function TaskHistory({ history }: { history: TaskDetail['history'] }) {
  return (
    <Box>
      <Typography variant="subtitle2" component="h3" color="text.secondary" sx={{ mb: 1 }}>
        Історія змін
      </Typography>
      <Stack component="ol" sx={{ gap: 0.75, m: 0, p: 0, listStyle: 'none' }}>
        {history.map((event, index) => (
          <Box component="li" key={`${event.at}-${index}`} sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ ...mono, color: 'text.secondary' }}>
              {formatTaskMoment(event.at)}
            </Box>{' '}
            · {event.by.name}: {describeTaskEvent(event)}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
