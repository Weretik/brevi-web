import { describe, expect, it } from 'vitest';

import { hasReminderTaskErrors, validateReminderTaskForm } from './reminder-task-validation';
import { emptyReminderTaskForm } from '../../forms/tasks/reminder-task-form';

describe('validateReminderTaskForm', () => {
  it('accepts a complete monthly task', () => {
    const errors = validateReminderTaskForm({ ...emptyReminderTaskForm, title: 'ЄСВ' });
    expect(hasReminderTaskErrors(errors)).toBe(false);
  });

  it('reports title, day and lead limits', () => {
    const errors = validateReminderTaskForm({
      ...emptyReminderTaskForm,
      title: '  ',
      day: '40',
      leadDays: '61',
    });
    expect(errors).toEqual({
      title: 'Вкажіть назву задачі.',
      day: 'Від 1 до 31.',
      leadDays: 'Від 0 до 60.',
    });
  });

  it('allows up to 366 days after the period and ignores the month offset there', () => {
    const errors = validateReminderTaskForm({
      ...emptyReminderTaskForm,
      title: 'Звіт',
      dueRule: 'daysAfterPeriodEnd',
      day: '40',
      monthOffset: 'x',
    });
    expect(hasReminderTaskErrors(errors)).toBe(false);
  });

  it('does not need a day for the last working day rule', () => {
    const errors = validateReminderTaskForm({
      ...emptyReminderTaskForm,
      title: 'Зарплата',
      dueRule: 'lastWorkingDayOfMonth',
      day: '',
    });
    expect(hasReminderTaskErrors(errors)).toBe(false);
  });
});
