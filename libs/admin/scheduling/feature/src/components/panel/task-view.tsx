import { describeSchedule, formatKyivDateTime } from '@admin/scheduling/model';
import { Alert, Stack, Typography } from '@mui/material';

import { TaskRunHistory } from './task-run-history';
import { TaskProblemPills } from '../table/task-problem-pills';

import type { TaskNotice } from '../../hooks/use-background-tasks';
import type { ScheduledTask } from '@admin/scheduling/model';
import type { ReactNode } from 'react';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack sx={{ gap: 0.25 }}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      {children}
    </Stack>
  );
}

function Result({ at, text, tone }: { at: string | null; text: string | null; tone?: 'error' }) {
  if (!at) return <Typography variant="body2">Ще не було</Typography>;
  return (
    <>
      <Typography variant="body2" className="reference-mono">
        {formatKyivDateTime(at)}
      </Typography>
      {text && (
        <Typography variant="body2" color={tone === 'error' ? 'error.main' : 'text.primary'}>
          {text}
        </Typography>
      )}
    </>
  );
}

/** R-03: what the task does, its schedule, last results and run history. */
export function TaskView({ task, notice }: { task: ScheduledTask; notice: TaskNotice | null }) {
  return (
    <Stack sx={{ gap: 2.5 }}>
      {notice && <Alert severity={notice.ok ? 'success' : 'error'}>{notice.text}</Alert>}
      <TaskProblemPills task={task} />
      <Typography variant="body2">{task.description}</Typography>
      <Field label="Розклад">
        <Typography variant="body2">
          {describeSchedule(task.schedule)}
          {!task.editable && ' · не змінюється'}
        </Typography>
      </Field>
      <Field label="Наступний запуск">
        <Typography variant="body2" className="reference-mono">
          {task.enabled || task.runRequestedAt ? formatKyivDateTime(task.nextRunAt) : 'Вимкнено'}
        </Typography>
      </Field>
      <Field label="Остання успішна">
        <Result at={task.lastSuccessAt} text={task.lastSuccessSummary} />
      </Field>
      <Field label="Остання помилка">
        <Result at={task.lastFailureAt} text={task.lastFailureReason} tone="error" />
      </Field>
      <Field label="Історія запусків">
        <TaskRunHistory taskKey={task.key} />
      </Field>
    </Stack>
  );
}
