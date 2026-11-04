import { dueAtFromForm } from '../forms/task-form';

import type { TaskFormValues } from '../forms/task-form';

export const taskLimits = { title: 200, description: 4000, step: 300, steps: 30 } as const;

export type TaskFormField = 'title' | 'description' | 'assigneeUserId' | 'due' | 'steps';
export type TaskFormErrors = Partial<Record<TaskFormField, string>>;

/** The same rules as the server (TSK-001 R-03), so the panel shows them before saving. */
export function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = 'Вкажіть, що зробити.';
  else if (title.length > taskLimits.title)
    errors.title = `Не більше ${taskLimits.title} символів.`;
  if (values.description.trim().length > taskLimits.description) {
    errors.description = `Не більше ${taskLimits.description} символів.`;
  }
  if (values.assigneeUserId === null) errors.assigneeUserId = 'Оберіть менеджера.';
  if (dueAtFromForm(values) === null) errors.due = 'Вкажіть дату і час.';
  if (values.steps.length > taskLimits.steps) {
    errors.steps = `Не більше ${taskLimits.steps} кроків.`;
  } else if (values.steps.some((step) => !step.text.trim())) {
    errors.steps = 'Крок не може бути порожнім.';
  } else if (values.steps.some((step) => step.text.trim().length > taskLimits.step)) {
    errors.steps = `Крок — не більше ${taskLimits.step} символів.`;
  }
  return errors;
}
