import {
  reminderActionKinds,
  reminderOccurrenceStatuses,
  reminderOrganizations,
} from '@admin/reminders/model';

import {
  dateTime,
  integer,
  isoDate,
  list,
  nullableDateTime,
  nullableInteger,
  nullableIsoDate,
  oneOf,
  record,
  text,
} from '../../validators/reminder-response';

import type {
  ReminderAction,
  ReminderActor,
  ReminderOccurrence,
  ReminderOccurrencePage,
} from '@admin/reminders/model';

export function mapReminderActor(value: unknown): ReminderActor {
  const row = record(value, 'виконавець');
  return {
    name: text(row['name'], 'імʼя'),
    telegramUserId: nullableInteger(row['telegramUserId'], 'Telegram id'),
    adminUserId: nullableInteger(row['adminUserId'], 'id користувача'),
  };
}

function mapReminderAction(value: unknown): ReminderAction {
  const row = record(value, 'дія');
  return {
    kind: oneOf(row['kind'], reminderActionKinds, 'тип дії'),
    actor: mapReminderActor(row['actor']),
    at: dateTime(row['at'], 'час дії'),
    snoozedUntil: nullableIsoDate(row['snoozedUntil'], 'перенесено до'),
  };
}

export function mapReminderOccurrence(value: unknown): ReminderOccurrence {
  const row = record(value, 'період');
  return {
    id: integer(row['id'], 'id періоду', 1),
    taskId: integer(row['taskId'], 'id задачі', 1),
    taskTitle: text(row['taskTitle'], 'назва задачі'),
    organization: oneOf(row['organization'], reminderOrganizations, 'організація'),
    period: text(row['period'], 'період'),
    dueDate: isoDate(row['dueDate'], 'термін'),
    remindFrom: isoDate(row['remindFrom'], 'початок нагадувань'),
    status: oneOf(row['status'], reminderOccurrenceStatuses, 'статус'),
    snoozedUntil: nullableIsoDate(row['snoozedUntil'], 'перенесено до'),
    closedBy: row['closedBy'] == null ? null : mapReminderActor(row['closedBy']),
    closedAt: nullableDateTime(row['closedAt'], 'закрито'),
    actions: list(row['actions'], 'історія').map(mapReminderAction),
  };
}

export function mapReminderOccurrencePage(value: unknown): ReminderOccurrencePage {
  const row = record(value, 'сторінка періодів');
  return {
    items: list(row['items'], 'періоди').map(mapReminderOccurrence),
    total: integer(row['total'], 'кількість'),
  };
}
