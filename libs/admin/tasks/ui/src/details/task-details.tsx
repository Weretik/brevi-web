import { UserAvatar, usePageRights } from '@admin/shared/ui';
import { formatTaskDue, formatTaskMoment } from '@admin/tasks/model';
import { Box, Button, Divider, Link, MenuItem, Stack, TextField, Typography } from '@mui/material';

import { TaskHistory } from './task-history';
import { taskMono as mono, TaskStepsChecklist } from './task-steps-checklist';
import { TaskStatePill } from '../components/status/task-state-pill';

import type { TaskAssignee, TaskDetail } from '@admin/tasks/model';

interface Props {
  task: TaskDetail;
  busy: boolean;
  onStatus: (status: 'InProgress' | 'Done') => void;
  onStep: (stepId: number, isDone: boolean) => void;
  /** Director and Admin: the managers the task can be given to. */
  assignees?: readonly TaskAssignee[];
  onReassign?: (assigneeUserId: number) => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack direction="row" sx={{ gap: 2, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 110, flex: 'none' }}>
        {label}
      </Typography>
      <Box sx={{ minWidth: 0, typography: 'body2' }}>{children}</Box>
    </Stack>
  );
}

/** Read view of the side panel: the manager works here — status buttons and steps (R-07, R-10). */
export function TaskDetails({ task, busy, onStatus, onStep, assignees, onReassign }: Props) {
  const now = new Date();
  // Status, steps and the assignee are «Редагування» on «Мої завдання».
  const { canEdit } = usePageRights();
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <TaskStatePill task={task} />
        {canEdit && task.status === 'New' && (
          <Button
            size="small"
            variant="outlined"
            disabled={busy}
            onClick={() => onStatus('InProgress')}
          >
            Взяти в роботу
          </Button>
        )}
        {canEdit && task.status === 'Done' && (
          <Button
            size="small"
            variant="outlined"
            disabled={busy}
            onClick={() => onStatus('InProgress')}
          >
            Повернути в роботу
          </Button>
        )}
      </Stack>

      <Box>
        <Row label="Менеджер">
          {canEdit && onReassign && assignees && assignees.length > 0 ? (
            <TextField
              select
              size="small"
              label="Виконавець"
              value={task.assignee.userId}
              disabled={busy}
              onChange={(event) => onReassign(Number(event.target.value))}
              helperText="Оберіть іншого менеджера, щоб передати завдання."
              sx={{ minWidth: 240 }}
            >
              {!assignees.some((x) => x.userId === task.assignee.userId) && (
                <MenuItem value={task.assignee.userId}>{task.assignee.name}</MenuItem>
              )}
              {assignees.map((assignee) => (
                <MenuItem key={assignee.userId} value={assignee.userId}>
                  {assignee.name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <UserAvatar name={task.assignee.name} size={24} />
              {task.assignee.name}
            </Stack>
          )}
        </Row>
        <Row label="Термін">
          <Box component="span" sx={{ ...mono, color: task.isOverdue ? 'error.main' : 'inherit' }}>
            {formatTaskDue(task.dueAt, now, task.isOverdue)}
          </Box>
        </Row>
        {task.customerName && <Row label="Клієнт">{task.customerName}</Row>}
        {task.leadId && (
          <Row label="Лід">
            <Link href={`/crm/leads?lead=${task.leadId}`}>Відкрити в «Ліди › Мій день»</Link>
          </Row>
        )}
        <Row label="Поставив">
          {task.author.name} ·{' '}
          <Box component="span" sx={mono}>
            {formatTaskMoment(task.createdAt)}
          </Box>
        </Row>
      </Box>

      {task.description && (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {task.description}
        </Typography>
      )}

      {task.steps.length > 0 && (
        <TaskStepsChecklist task={task} disabled={busy || !canEdit} onStep={onStep} />
      )}

      <Divider />
      <TaskHistory history={task.history} />
    </Stack>
  );
}
