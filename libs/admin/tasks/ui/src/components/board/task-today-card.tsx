import { formatTaskDue } from '@admin/tasks/model';
import { ButtonBase, Paper, Typography } from '@mui/material';

import type { TaskSummary } from '@admin/tasks/model';

interface Props {
  tasks: readonly TaskSummary[];
  onOpen: (id: number) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** «На сьогодні»: up to three things to do first — overdue, then due today. */
export function TaskTodayCard({ tasks, onOpen }: Props) {
  const now = new Date();
  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1.5 }}>
      <Typography variant="overline" component="h2" color="text.secondary">
        На сьогодні
      </Typography>
      {tasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
          На сьогодні термінів немає.
        </Typography>
      ) : (
        tasks.map((task, index) => (
          <ButtonBase
            key={task.id}
            onClick={() => onOpen(task.id)}
            sx={{
              display: 'flex',
              width: '100%',
              gap: 1.5,
              py: 0.75,
              textAlign: 'left',
              borderTop: index ? 1 : 0,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              sx={{ ...mono, color: 'text.secondary', width: 64, flex: 'none' }}
            >
              {task.number}
            </Typography>
            <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0, fontWeight: 600 }}>
              {task.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                ...mono,
                color: task.isOverdue ? 'error.main' : 'text.secondary',
                flex: 'none',
              }}
            >
              {formatTaskDue(task.dueAt, now, task.isOverdue)}
            </Typography>
          </ButtonBase>
        ))
      )}
    </Paper>
  );
}
