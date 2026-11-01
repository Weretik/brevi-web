import type { ReminderSchedule, ReminderTaskInput } from '@admin/reminders/model';
import type { components } from '@admin/shared/contracts';

type TaskBody = components['schemas']['ReminderTaskInput'];
type ScheduleBody = components['schemas']['ReminderScheduleInput'];

export function reminderScheduleBody(schedule: ReminderSchedule): ScheduleBody {
  return { ...schedule };
}

export function reminderTaskBody(input: ReminderTaskInput): TaskBody {
  return {
    title: input.title,
    organization: input.organization,
    schedule: reminderScheduleBody(input.schedule),
    chatId: input.chatId,
    activeFrom: input.activeFrom,
    isEnabled: input.isEnabled,
  };
}
