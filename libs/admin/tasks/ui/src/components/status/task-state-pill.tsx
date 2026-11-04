import { Box } from '@mui/material';

import type { TaskSummary } from '@admin/tasks/model';

type Tone = 'error' | 'warning' | 'info' | 'success' | 'neutral';

/** What needs attention first: overdue, then urgent, then the manager's status. */
function taskState(task: Pick<TaskSummary, 'status' | 'isOverdue' | 'isUrgent'>): [string, Tone] {
  if (task.status === 'Done') return ['Виконано', 'success'];
  if (task.isOverdue) return ['Прострочено', 'error'];
  if (task.isUrgent) return ['Терміново', 'warning'];
  return task.status === 'InProgress' ? ['У роботі', 'info'] : ['Нове', 'neutral'];
}

interface Props {
  task: Pick<TaskSummary, 'status' | 'isOverdue' | 'isUrgent'>;
}

/** «Цех» status pill: dot, soft background, always a text label. */
export function TaskStatePill({ task }: Props) {
  const [label, tone] = taskState(task);
  return (
    <Box
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
        bgcolor: tone === 'neutral' ? 'action.hover' : `${tone}.light`,
        color: tone === 'neutral' ? 'text.secondary' : `${tone}.main`,
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }}
      />
      {label}
    </Box>
  );
}
