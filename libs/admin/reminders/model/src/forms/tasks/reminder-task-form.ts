import { defaultReminderLeadDays } from '../../entities/tasks/reminder-schedule';

import type { ReminderOrganization } from '../../entities/tasks/reminder-organization';
import type {
  ReminderDueRule,
  ReminderPeriodicity,
  ReminderSchedule,
} from '../../entities/tasks/reminder-schedule';
import type { ReminderTask, ReminderTaskInput } from '../../entities/tasks/reminder-task';

/** Text inputs keep strings so a half-typed number is not lost. */
export interface ReminderTaskFormValues {
  title: string;
  organization: ReminderOrganization;
  periodicity: ReminderPeriodicity;
  dueRule: ReminderDueRule;
  day: string;
  monthOffset: string;
  leadDays: string;
  chatId: number | null;
  activeFrom: string;
  isEnabled: boolean;
}

export const emptyReminderTaskForm: ReminderTaskFormValues = {
  title: '',
  organization: 'ppBrevi',
  periodicity: 'monthly',
  dueRule: 'dayOfMonth',
  day: '20',
  monthOffset: '0',
  leadDays: String(defaultReminderLeadDays),
  chatId: null,
  activeFrom: '',
  isEnabled: true,
};

export function reminderTaskToForm(task: ReminderTask): ReminderTaskFormValues {
  return {
    title: task.title,
    organization: task.organization,
    periodicity: task.schedule.periodicity,
    dueRule: task.schedule.dueRule,
    day: String(task.schedule.day),
    monthOffset: String(task.schedule.monthOffset),
    leadDays: String(task.schedule.leadDays),
    chatId: task.chatId,
    activeFrom: task.activeFrom,
    isEnabled: task.isEnabled,
  };
}

/** The last working day rule has no day; the backend expects 0 there. */
export function reminderFormToSchedule(values: ReminderTaskFormValues): ReminderSchedule {
  return {
    periodicity: values.periodicity,
    dueRule: values.dueRule,
    day: values.dueRule === 'lastWorkingDayOfMonth' ? 0 : Number(values.day),
    monthOffset: values.dueRule === 'daysAfterPeriodEnd' ? 0 : Number(values.monthOffset),
    leadDays: Number(values.leadDays),
  };
}

export function reminderFormToInput(values: ReminderTaskFormValues): ReminderTaskInput {
  return {
    title: values.title.trim(),
    organization: values.organization,
    schedule: reminderFormToSchedule(values),
    chatId: values.chatId,
    activeFrom: values.activeFrom || null,
    isEnabled: values.isEnabled,
  };
}
