import type { ReminderOrganization } from '../tasks/reminder-organization';

export const reminderOccurrenceStatuses = ['open', 'done'] as const;
export type ReminderOccurrenceStatus = (typeof reminderOccurrenceStatuses)[number];

export const reminderOccurrenceStatusLabels: Record<ReminderOccurrenceStatus, string> = {
  open: 'Активне',
  done: 'Виконано',
};

export const reminderActionKinds = ['done', 'postponed', 'reopened'] as const;
export type ReminderActionKind = (typeof reminderActionKinds)[number];

export const reminderActionKindLabels: Record<ReminderActionKind, string> = {
  done: 'Виконано',
  postponed: 'Перенесено',
  reopened: 'Відкрито знову',
};

export interface ReminderActor {
  name: string;
  telegramUserId: number | null;
  adminUserId: number | null;
}

export interface ReminderAction {
  kind: ReminderActionKind;
  actor: ReminderActor;
  /** ISO date-time. */
  at: string;
  snoozedUntil: string | null;
}

export interface ReminderOccurrence {
  id: number;
  taskId: number;
  taskTitle: string;
  organization: ReminderOrganization;
  period: string;
  dueDate: string;
  remindFrom: string;
  status: ReminderOccurrenceStatus;
  snoozedUntil: string | null;
  closedBy: ReminderActor | null;
  closedAt: string | null;
  actions: ReminderAction[];
}

export interface ReminderOccurrencePage {
  items: ReminderOccurrence[];
  total: number;
}

export interface ReminderOccurrenceQuery {
  status?: ReminderOccurrenceStatus;
  taskId?: number;
  page: number;
  pageSize: number;
}
