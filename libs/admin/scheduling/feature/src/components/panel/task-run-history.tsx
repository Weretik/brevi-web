import { useGetScheduledTaskRunsQuery } from '@admin/scheduling/data-access';
import { formatKyivDateTime } from '@admin/scheduling/model';
import { Alert, CircularProgress, Divider, Stack, Typography } from '@mui/material';

import type { ScheduledTaskRun } from '@admin/scheduling/model';

const outcomes: Record<ScheduledTaskRun['outcome'], { label: string; color: string }> = {
  succeeded: { label: 'Успішно', color: 'text.secondary' },
  failed: { label: 'Помилка', color: 'error.main' },
  running: { label: 'Виконується', color: 'info.main' },
};

function how(run: ScheduledTaskRun): string {
  if (run.trigger === 'schedule') return 'За розкладом';
  return run.requestedBy ? `Вручну · ${run.requestedBy}` : 'Вручну';
}

/** The last 50 runs, newest first: when, how it started, result and message. */
export function TaskRunHistory({ taskKey }: { taskKey: string }) {
  const query = useGetScheduledTaskRunsQuery(taskKey);
  if (query.isLoading) return <CircularProgress size={20} aria-label="Завантаження історії" />;
  if (query.error) return <Alert severity="error">Не вдалося завантажити історію запусків.</Alert>;
  const runs = query.data ?? [];
  if (runs.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        Запусків ще не було.
      </Typography>
    );
  return (
    <Stack
      component="ol"
      divider={<Divider component="li" aria-hidden />}
      sx={{ p: 0, m: 0, listStyle: 'none' }}
    >
      {runs.map((run) => (
        <Stack component="li" key={run.id} sx={{ py: 1, gap: 0.25 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="body2" className="reference-mono">
              {formatKyivDateTime(run.claimedAt)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: outcomes[run.outcome].color }}
            >
              {outcomes[run.outcome].label}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {how(run)}
          </Typography>
          {run.message && <Typography variant="body2">{run.message}</Typography>}
        </Stack>
      ))}
    </Stack>
  );
}
