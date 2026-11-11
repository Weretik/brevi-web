import { reminderChatKinds } from '@admin/reminders/model';

import {
  dateTime,
  flag,
  integer,
  list,
  nullableText,
  oneOf,
  record,
  text,
} from '../../validators/reminder-response';

import type { ReminderChat } from '@admin/reminders/model';

export function mapReminderChat(value: unknown): ReminderChat {
  const row = record(value, 'чат');
  return {
    id: integer(row['id'], 'id чату', 1),
    kind: oneOf(row['kind'], reminderChatKinds, 'тип чату'),
    telegramTitle: text(row['telegramTitle'], 'назва чату'),
    displayName: nullableText(row['displayName'], 'назва в адмінці'),
    isApproved: flag(row['isApproved'], 'підтверджено'),
    isBotMember: flag(row['isBotMember'], 'бот у чаті'),
    // Missing before LEAD-002 is deployed: the chat does not get site requests yet.
    receivesSiteRequests: row['receivesSiteRequests'] === true,
    discoveredAt: dateTime(row['discoveredAt'], 'знайдено'),
  };
}

export function mapReminderChats(value: unknown): ReminderChat[] {
  return list(value, 'чати').map(mapReminderChat);
}
