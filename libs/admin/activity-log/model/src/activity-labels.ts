import { staffRoleLabels } from '@admin/users/model';

import type { ActivityEntry } from './activity-entry';
import type { StaffRole } from '@admin/users/model';

const actionLabels: Readonly<Record<string, string>> = {
  Created: 'Створено',
  Changed: 'Змінено',
  Deleted: 'Видалено',
  Sent: 'Надіслано',
  Closed: 'Закрито',
  Cancelled: 'Скасовано',
  Reopened: 'Відновлено в роботі',
  Voided: 'Анульовано',
  Restored: 'Відновлено',
  Imported: 'Імпорт',
};

/** «Змінено» for `Changed`; an unknown action stays as the backend wrote it. */
export function activityActionLabel(action: string): string {
  return actionLabels[action] ?? action;
}

/** The roles the «Роль» filter offers, in the order of «Права доступу». */
export const activityRoles: readonly string[] = [
  'Manager',
  'WorkshopChief',
  'Accountant',
  'Seo',
  'Admin',
  'Director',
];

/** «Менеджер» for `Manager`; a role made on «Права доступу» keeps its name. */
export function activityRoleLabel(role: string): string {
  return staffRoleLabels[role as StaffRole] ?? role;
}

const subjectPaths: Readonly<Record<string, (id: string) => string>> = {
  quote: (id) => `/crm/quotes/${id}`,
  'production-order': (id) => `/production/orders/${id}`,
  customer: (id) => `/crm/clients/${id}`,
  product: (id) => `/references/products/${id}`,
};

/** The admin page of the entry's object, or null when it has none or the entry deleted it. */
export function activitySubjectPath(
  entry: Pick<ActivityEntry, 'action' | 'subjectType' | 'subjectId'>,
): string | null {
  if (entry.action === 'Deleted') return null;
  return subjectPaths[entry.subjectType]?.(entry.subjectId) ?? null;
}

const kyivTime = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** «16.11.2026, 14:30» in Kyiv time. */
export function formatActivityTime(value: string): string {
  return kyivTime.format(new Date(value));
}
