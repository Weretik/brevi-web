import {
  reminderDueRules,
  reminderOrganizations,
  reminderPeriodicities,
} from '@admin/reminders/model';

import {
  integer,
  isoDate,
  flag,
  list,
  nullableInteger,
  nullableText,
  oneOf,
  record,
  text,
} from '../../validators/reminder-response';

import type { DueDatePreview, ReminderSchedule, ReminderTask } from '@admin/reminders/model';

export function mapReminderSchedule(value: unknown): ReminderSchedule {
  const row = record(value, 'графік');
  return {
    periodicity: oneOf(row['periodicity'], reminderPeriodicities, 'періодичність'),
    dueRule: oneOf(row['dueRule'], reminderDueRules, 'правило терміну'),
    day: integer(row['day'], 'число'),
    monthOffset: integer(row['monthOffset'], 'зсув місяців'),
    leadDays: integer(row['leadDays'], 'днів до терміну'),
  };
}

export function mapDueDatePreview(value: unknown): DueDatePreview {
  const row = record(value, 'термін');
  return {
    period: text(row['period'], 'період'),
    dueDate: isoDate(row['dueDate'], 'термін'),
    remindFrom: isoDate(row['remindFrom'], 'початок нагадувань'),
  };
}

export function mapDueDatePreviews(value: unknown): DueDatePreview[] {
  return list(value, 'терміни').map(mapDueDatePreview);
}

export function mapReminderTask(value: unknown): ReminderTask {
  const row = record(value, 'задача');
  return {
    id: integer(row['id'], 'id задачі', 1),
    title: text(row['title'], 'назва'),
    organization: oneOf(row['organization'], reminderOrganizations, 'організація'),
    schedule: mapReminderSchedule(row['schedule']),
    chatId: nullableInteger(row['chatId'], 'чат'),
    chatName: nullableText(row['chatName'], 'назва чату'),
    activeFrom: isoDate(row['activeFrom'], 'активна з'),
    isEnabled: flag(row['isEnabled'], 'увімкнено'),
    nextDueDates: mapDueDatePreviews(row['nextDueDates']),
  };
}

export function mapReminderTasks(value: unknown): ReminderTask[] {
  return list(value, 'задачі').map(mapReminderTask);
}
