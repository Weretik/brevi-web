import type { ReminderOrganization } from './reminder-organization';
import type { ReminderSchedule } from './reminder-schedule';

export const reminderTaskTitleMaxLength = 200;

export interface DueDatePreview {
  period: string;
  /** ISO date `yyyy-MM-dd`. */
  dueDate: string;
  remindFrom: string;
}

export interface ReminderTask {
  id: number;
  title: string;
  organization: ReminderOrganization;
  schedule: ReminderSchedule;
  chatId: number | null;
  chatName: string | null;
  activeFrom: string;
  isEnabled: boolean;
  nextDueDates: DueDatePreview[];
}

export interface ReminderTaskInput {
  title: string;
  organization: ReminderOrganization;
  schedule: ReminderSchedule;
  chatId: number | null;
  activeFrom: string | null;
  isEnabled: boolean;
}
