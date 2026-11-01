import { reminderScheduleLimits } from '../../entities/tasks/reminder-schedule';
import { reminderTaskTitleMaxLength } from '../../entities/tasks/reminder-task';

import type { ReminderTaskFormValues } from '../../forms/tasks/reminder-task-form';

export type ReminderTaskFormErrors = Partial<
  Record<'title' | 'day' | 'monthOffset' | 'leadDays', string>
>;

function wholeNumberError(value: string, min: number, max: number): string | undefined {
  const number = Number(value);
  if (value.trim() === '' || !Number.isInteger(number)) return 'Вкажіть ціле число.';
  if (number < min || number > max) return `Від ${min} до ${max}.`;
  return undefined;
}

export function validateReminderTaskForm(values: ReminderTaskFormValues): ReminderTaskFormErrors {
  const errors: ReminderTaskFormErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = 'Вкажіть назву задачі.';
  else if (title.length > reminderTaskTitleMaxLength)
    errors.title = `Не довше ${reminderTaskTitleMaxLength} символів.`;

  if (values.dueRule === 'dayOfMonth') {
    const { min, max } = reminderScheduleLimits.dayOfMonth;
    const error = wholeNumberError(values.day, min, max);
    if (error) errors.day = error;
  }
  if (values.dueRule === 'daysAfterPeriodEnd') {
    const { min, max } = reminderScheduleLimits.daysAfterPeriodEnd;
    const error = wholeNumberError(values.day, min, max);
    if (error) errors.day = error;
  }
  if (values.dueRule !== 'daysAfterPeriodEnd') {
    const { min, max } = reminderScheduleLimits.monthOffset;
    const error = wholeNumberError(values.monthOffset, min, max);
    if (error) errors.monthOffset = error;
  }
  const { min, max } = reminderScheduleLimits.leadDays;
  const leadError = wholeNumberError(values.leadDays, min, max);
  if (leadError) errors.leadDays = leadError;
  return errors;
}

export function hasReminderTaskErrors(errors: ReminderTaskFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}
