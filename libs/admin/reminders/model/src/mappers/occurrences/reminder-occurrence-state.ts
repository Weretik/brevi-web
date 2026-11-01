import type { ReminderOccurrence } from '../../entities/occurrences/reminder-occurrence';

export type ReminderOccurrenceState = 'done' | 'overdue' | 'postponed' | 'open';

/** `today` is the Kyiv ISO date; ISO dates compare as strings. */
export function reminderOccurrenceState(
  occurrence: Pick<ReminderOccurrence, 'status' | 'dueDate' | 'snoozedUntil'>,
  today: string,
): ReminderOccurrenceState {
  if (occurrence.status === 'done') return 'done';
  if (occurrence.dueDate < today) return 'overdue';
  if (occurrence.snoozedUntil && occurrence.snoozedUntil > today) return 'postponed';
  return 'open';
}
