export const scheduleKinds = ['interval', 'daily', 'manual'] as const;

export type ScheduleKind = (typeof scheduleKinds)[number];

/** A schedule as the backend keeps it: Kyiv `HH:mm` times and ISO weekdays (1 = Monday). */
export interface TaskSchedule {
  kind: ScheduleKind;
  everyMinutes: number | null;
  fromHour: number | null;
  toHour: number | null;
  times: string[];
  days: number[];
}

/** One background task of «Фонові задачі» with its schedule and last results. */
export interface ScheduledTask {
  key: string;
  name: string;
  description: string;
  /** False for the outbox: it runs every minute and has no «Змінити розклад» or «Запустити зараз». */
  editable: boolean;
  enabled: boolean;
  schedule: TaskSchedule;
  nextRunAt: string | null;
  isRunning: boolean;
  runningSince: string | null;
  runRequestedAt: string | null;
  lastSuccessAt: string | null;
  lastSuccessSummary: string | null;
  lastFailureAt: string | null;
  lastFailureReason: string | null;
  lastRunFailed: boolean;
  overdue: boolean;
}

/** Body of `updateScheduledTaskSchedule`. */
export interface ScheduledTaskScheduleInput {
  enabled: boolean;
  schedule: TaskSchedule;
  nextRunAt: string | null;
}
