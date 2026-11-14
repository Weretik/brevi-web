import { Box, Stack } from '@mui/material';

import type { ScheduledTask } from '@admin/scheduling/model';

type Tone = 'error' | 'warning' | 'info' | 'neutral';

/** R-02: only problems and states worth noticing; there is no «все добре» pill. */
export function taskMarks(task: ScheduledTask): { label: string; tone: Tone }[] {
  const marks: { label: string; tone: Tone }[] = [];
  if (task.lastRunFailed) marks.push({ label: 'Остання спроба з помилкою', tone: 'error' });
  if (task.overdue) marks.push({ label: 'Пропущено запуск', tone: 'warning' });
  if (task.isRunning) marks.push({ label: 'Виконується', tone: 'info' });
  else if (task.runRequestedAt) marks.push({ label: 'Запуск заплановано', tone: 'info' });
  if (!task.enabled) marks.push({ label: 'Вимкнено', tone: 'neutral' });
  return marks;
}

const colors: Record<Tone, { bgcolor: string; color: string }> = {
  error: { bgcolor: 'error.light', color: 'error.dark' },
  warning: { bgcolor: 'warning.light', color: 'warning.dark' },
  info: { bgcolor: 'info.light', color: 'info.dark' },
  neutral: { bgcolor: 'action.hover', color: 'text.secondary' },
};

export function TaskProblemPills({ task }: { task: ScheduledTask }) {
  return (
    <Stack direction="row" sx={{ gap: 0.5, flexWrap: 'wrap' }}>
      {taskMarks(task).map((mark) => (
        <Box
          key={mark.label}
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            height: 24,
            px: 1,
            borderRadius: 999,
            typography: 'caption',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            ...colors[mark.tone],
          }}
        >
          <Box
            component="span"
            aria-hidden
            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }}
          />
          {mark.label}
        </Box>
      ))}
    </Stack>
  );
}
