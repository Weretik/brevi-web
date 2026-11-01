import type {
  ReminderChatInput,
  ReminderOrganization,
  ReminderSchedule,
  ReminderTaskInput,
} from '@admin/reminders/model';

export interface UpdateReminderTaskRequest {
  id: number;
  input: ReminderTaskInput;
}

export interface PreviewReminderDueDatesRequest {
  schedule: ReminderSchedule;
  from?: string | null;
}

export interface AssignReminderChatRequest {
  chatId: number;
  organizations: ReminderOrganization[];
}

export interface UpdateReminderChatRequest {
  id: number;
  input: ReminderChatInput;
}
