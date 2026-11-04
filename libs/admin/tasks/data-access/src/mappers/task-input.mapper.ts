import { dueAtFromForm } from '@admin/tasks/model';

import type { components } from '@admin/shared/contracts';
import type { TaskFormValues } from '@admin/tasks/model';

/** The side panel as the server takes it; call only after `validateTaskForm` passed. */
export function toSaveTaskInput(values: TaskFormValues): components['schemas']['CrmSaveTaskInput'] {
  const dueAt = dueAtFromForm(values);
  if (dueAt === null || values.assigneeUserId === null)
    throw new Error('Форма завдання не заповнена.');
  return {
    version: values.version,
    title: values.title.trim(),
    description: values.description.trim() || null,
    assigneeUserId: values.assigneeUserId,
    dueAt,
    isUrgent: values.isUrgent,
    customerPublicId: values.customer?.publicId ?? null,
    steps: values.steps.map((step) => ({ text: step.text.trim(), isDone: step.isDone })),
  };
}
