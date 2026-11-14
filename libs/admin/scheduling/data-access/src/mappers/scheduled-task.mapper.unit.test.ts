import { describe, expect, it } from 'vitest';

import { mapScheduledTaskRuns, mapScheduledTasks } from './scheduled-task.mapper';

const task = {
  key: 'leads',
  name: 'Ліди',
  description: 'Переносить ліди з таблиці «Лиды Brevi».',
  editable: true,
  enabled: true,
  schedule: {
    kind: 'daily',
    everyMinutes: null,
    fromHour: null,
    toHour: null,
    times: ['09:00'],
    days: [1, 2, 3, 4, 5],
  },
  nextRunAt: '2026-11-17T07:00:00+00:00',
  isRunning: false,
  runningSince: null,
  runRequestedAt: null,
  lastSuccessAt: '2026-11-16T07:02:00+00:00',
  lastSuccessSummary: 'Рядків 10: додано 1.',
  lastFailureAt: null,
  lastFailureReason: null,
  lastRunFailed: false,
  overdue: false,
};

describe('scheduling mappers', () => {
  it('maps tasks with their schedule', () => {
    const [mapped] = mapScheduledTasks([task]);

    expect(mapped.schedule).toEqual({
      kind: 'daily',
      everyMinutes: null,
      fromHour: null,
      toHour: null,
      times: ['09:00'],
      days: [1, 2, 3, 4, 5],
    });
    expect(mapped.lastSuccessSummary).toBe('Рядків 10: додано 1.');
  });

  it('reads a schedule without times or days and maps runs', () => {
    const interval = {
      ...task,
      schedule: { kind: 'interval', everyMinutes: 1, times: null, days: null },
    };
    expect(mapScheduledTasks([interval])[0].schedule.times).toEqual([]);

    const runs = mapScheduledTaskRuns([
      {
        id: '0193a3f1-0000-7000-8000-000000000001',
        trigger: 'manual',
        requestedBy: 'Олена',
        claimedAt: '2026-11-16T07:00:00+00:00',
        startedAt: null,
        finishedAt: null,
        outcome: 'running',
        message: null,
      },
    ]);
    expect(runs[0]).toMatchObject({ trigger: 'manual', outcome: 'running', requestedBy: 'Олена' });
  });

  it('refuses an unknown kind, day or outcome', () => {
    expect(() =>
      mapScheduledTasks([{ ...task, schedule: { ...task.schedule, kind: 'weekly' } }]),
    ).toThrow(/вид розкладу/);
    expect(() =>
      mapScheduledTasks([{ ...task, schedule: { ...task.schedule, days: [8] } }]),
    ).toThrow(/день тижня/);
    expect(() =>
      mapScheduledTaskRuns([{ id: 'x', trigger: 'cron', claimedAt: '2026-11-16T07:00:00Z' }]),
    ).toThrow();
  });
});
