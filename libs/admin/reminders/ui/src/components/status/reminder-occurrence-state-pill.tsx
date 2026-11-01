import { formatReminderDate } from '@admin/reminders/model';

import { ReminderStatusPill } from './reminder-status-pill';

import type { ReminderPillTone } from './reminder-status-pill';
import type { ReminderOccurrence, ReminderOccurrenceState } from '@admin/reminders/model';

const tones: Record<ReminderOccurrenceState, ReminderPillTone> = {
  done: 'success',
  overdue: 'error',
  postponed: 'warning',
  open: 'info',
};

interface Props {
  occurrence: Pick<ReminderOccurrence, 'snoozedUntil'>;
  state: ReminderOccurrenceState;
}

export function ReminderOccurrenceStatePill({ occurrence, state }: Props) {
  const label = {
    done: 'Виконано',
    overdue: 'Прострочено',
    postponed: `Перенесено до ${formatReminderDate(occurrence.snoozedUntil)}`,
    open: 'Активне',
  }[state];
  return <ReminderStatusPill tone={tones[state]} label={label} />;
}
