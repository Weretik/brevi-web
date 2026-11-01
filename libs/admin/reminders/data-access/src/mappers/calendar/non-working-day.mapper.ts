import { isoDate, list, nullableText, record } from '../../validators/reminder-response';

import type { NonWorkingDay } from '@admin/reminders/model';

export function mapNonWorkingDay(value: unknown): NonWorkingDay {
  const row = record(value, 'неробочий день');
  return { date: isoDate(row['date'], 'дата'), note: nullableText(row['note'], 'примітка') };
}

export function mapNonWorkingDays(value: unknown): NonWorkingDay[] {
  return list(value, 'неробочі дні').map(mapNonWorkingDay);
}
