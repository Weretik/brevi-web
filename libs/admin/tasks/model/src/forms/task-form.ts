import type { TaskCustomerOption, TaskDetail } from '../entities/manager-task';

export interface TaskStepDraft {
  readonly key: string;
  readonly text: string;
  readonly isDone: boolean;
}

/** The side panel of Director or Admin. Date and time are the browser's local (Kyiv) values. */
export interface TaskFormValues {
  readonly version: number;
  readonly title: string;
  readonly description: string;
  readonly assigneeUserId: number | null;
  /** `yyyy-mm-dd`. */
  readonly dueDate: string;
  /** `hh:mm`. */
  readonly dueTime: string;
  readonly isUrgent: boolean;
  readonly customer: TaskCustomerOption | null;
  readonly steps: readonly TaskStepDraft[];
}

const pad = (value: number) => String(value).padStart(2, '0');

export function localDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function localTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

let stepKey = 0;
export const newStepKey = () => `step-${++stepKey}`;

/** A new task is due tomorrow at 18:00 by default. */
export function emptyTaskForm(now: Date, assigneeUserId: number | null = null): TaskFormValues {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    version: 0,
    title: '',
    description: '',
    assigneeUserId,
    dueDate: localDate(tomorrow),
    dueTime: '18:00',
    isUrgent: false,
    customer: null,
    steps: [],
  };
}

export function taskFormFromDetail(task: TaskDetail): TaskFormValues {
  const due = new Date(task.dueAt);
  return {
    version: task.version,
    title: task.title,
    description: task.description ?? '',
    assigneeUserId: task.assignee.userId,
    dueDate: localDate(due),
    dueTime: localTime(due),
    isUrgent: task.isUrgent,
    customer:
      task.customerPublicId && task.customerName
        ? { publicId: task.customerPublicId, name: task.customerName }
        : null,
    steps: task.steps.map((step) => ({ key: newStepKey(), text: step.text, isDone: step.isDone })),
  };
}

/** The due moment as ISO 8601 with the browser's offset, or null when the fields are incomplete. */
export function dueAtFromForm(values: Pick<TaskFormValues, 'dueDate' | 'dueTime'>): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.dueDate) || !/^\d{2}:\d{2}$/.test(values.dueTime)) {
    return null;
  }
  const date = new Date(`${values.dueDate}T${values.dueTime}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
