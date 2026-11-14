import { runOutcomes, runTriggers, scheduleKinds } from '@admin/scheduling/model';

import {
  flag,
  list,
  nullableDateTime,
  nullableInteger,
  nullableText,
  oneOf,
  record,
  text,
} from './scheduling-response';

import type { ScheduledTask, ScheduledTaskRun, TaskSchedule } from '@admin/scheduling/model';

function mapSchedule(value: unknown): TaskSchedule {
  const row = record(value, 'розклад');
  const times =
    row['times'] === null || row['times'] === undefined ? [] : list(row['times'], 'часи');
  const days = row['days'] === null || row['days'] === undefined ? [] : list(row['days'], 'дні');
  return {
    kind: oneOf(row['kind'], scheduleKinds, 'вид розкладу'),
    everyMinutes: nullableInteger(row['everyMinutes'], 'інтервал'),
    fromHour: nullableInteger(row['fromHour'], 'година «з»'),
    toHour: nullableInteger(row['toHour'], 'година «до»'),
    times: times.map((time) => text(time, 'час')),
    days: days.map((day) => {
      const number = nullableInteger(day, 'день тижня');
      if (number === null || number < 1 || number > 7)
        throw new Error('Некоректна відповідь API фонових задач: день тижня.');
      return number;
    }),
  };
}

export function mapScheduledTask(value: unknown): ScheduledTask {
  const row = record(value, 'задача');
  return {
    key: text(row['key'], 'ключ'),
    name: text(row['name'], 'назва'),
    description: text(row['description'], 'опис'),
    editable: flag(row['editable'], 'змінюваність'),
    enabled: flag(row['enabled'], 'увімкнено'),
    schedule: mapSchedule(row['schedule']),
    nextRunAt: nullableDateTime(row['nextRunAt'], 'наступний запуск'),
    isRunning: flag(row['isRunning'], 'виконується'),
    runningSince: nullableDateTime(row['runningSince'], 'початок виконання'),
    runRequestedAt: nullableDateTime(row['runRequestedAt'], 'запит запуску'),
    lastSuccessAt: nullableDateTime(row['lastSuccessAt'], 'остання успішна'),
    lastSuccessSummary: nullableText(row['lastSuccessSummary'], 'підсумок'),
    lastFailureAt: nullableDateTime(row['lastFailureAt'], 'остання помилка'),
    lastFailureReason: nullableText(row['lastFailureReason'], 'причина'),
    lastRunFailed: flag(row['lastRunFailed'], 'остання спроба'),
    overdue: flag(row['overdue'], 'пропущений запуск'),
  };
}

export function mapScheduledTasks(value: unknown): ScheduledTask[] {
  return list(value, 'список задач').map(mapScheduledTask);
}

export function mapScheduledTaskRuns(value: unknown): ScheduledTaskRun[] {
  return list(value, 'історія').map((item) => {
    const row = record(item, 'запуск');
    const claimedAt = nullableDateTime(row['claimedAt'], 'час запуску');
    if (!claimedAt) throw new Error('Некоректна відповідь API фонових задач: час запуску.');
    return {
      id: text(row['id'], 'номер запуску'),
      trigger: oneOf(row['trigger'], runTriggers, 'як запущено'),
      requestedBy: nullableText(row['requestedBy'], 'хто запустив'),
      claimedAt,
      startedAt: nullableDateTime(row['startedAt'], 'початок'),
      finishedAt: nullableDateTime(row['finishedAt'], 'кінець'),
      outcome: oneOf(row['outcome'], runOutcomes, 'результат'),
      message: nullableText(row['message'], 'повідомлення'),
    };
  });
}
