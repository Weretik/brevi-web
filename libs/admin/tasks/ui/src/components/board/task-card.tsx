import { UserAvatar } from '@admin/shared/ui';
import { formatTaskDue } from '@admin/tasks/model';
import { Box, ButtonBase, LinearProgress, Stack, Typography } from '@mui/material';

import type { TaskSummary } from '@admin/tasks/model';
import type { DragEvent } from 'react';

interface Props {
  task: TaskSummary;
  now: Date;
  /** Director and Admin looking at all managers see whose card it is. */
  showAssignee: boolean;
  dragging: boolean;
  onOpen: () => void;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Kanban card (K2): mono number and due time, title, client, step progress. */
export function TaskCard({
  task,
  now,
  showAssignee,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: Props) {
  const done = task.status === 'Done';
  return (
    <ButtonBase
      component="article"
      draggable
      onClick={onOpen}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      aria-label={`${task.number} ${task.title}`}
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        p: 1.25,
        borderRadius: 2,
        border: 1,
        borderColor: dragging ? 'primary.main' : 'divider',
        bgcolor: 'background.paper',
        opacity: dragging ? 0.6 : done ? 0.75 : 1,
        cursor: 'grab',
        transition: (theme) => theme.transitions.create(['border-color', 'opacity']),
        '&:hover': { borderColor: 'text.secondary' },
        '&:focus-visible': { outline: 2, outlineColor: 'primary.main' },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="caption" sx={{ ...mono, color: 'text.secondary' }}>
          {task.number}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            ...mono,
            color: task.isOverdue ? 'error.main' : 'text.secondary',
            fontWeight: task.isOverdue ? 600 : 400,
          }}
        >
          {done && task.completedAt
            ? formatTaskDue(task.completedAt, now, false)
            : formatTaskDue(task.dueAt, now, task.isOverdue)}
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        sx={{
          fontWeight: done ? 500 : 600,
          my: 0.75,
          textDecoration: done ? 'line-through' : 'none',
          lineHeight: 1.35,
        }}
      >
        {task.title}
      </Typography>
      {!done && task.stepsTotal > 0 && (
        <LinearProgress
          variant="determinate"
          value={(task.stepsDone / task.stepsTotal) * 100}
          aria-label="Виконано кроків"
          sx={{ height: 4, borderRadius: 2, mb: 0.75 }}
        />
      )}
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ minWidth: 0 }}>
          {task.customerName ??
            (task.stepsTotal > 0 ? `Кроки ${task.stepsDone} з ${task.stepsTotal}` : '')}
        </Typography>
        {showAssignee && (
          <Box sx={{ flex: 'none' }} title={task.assignee.name}>
            <UserAvatar name={task.assignee.name} size={22} />
          </Box>
        )}
      </Stack>
    </ButtonBase>
  );
}
