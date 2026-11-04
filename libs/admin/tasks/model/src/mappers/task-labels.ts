import type { TaskLane, TaskListFilter, TaskStatus } from '../entities/manager-task';

export const taskStatusLabels: Record<TaskStatus, string> = {
  New: 'Нове',
  InProgress: 'У роботі',
  Done: 'Виконано',
};

/** Kanban columns in the order the board shows them (K2). */
export const taskLanes: readonly { lane: TaskLane; label: string }[] = [
  { lane: 'Overdue', label: 'Прострочено' },
  { lane: 'Urgent', label: 'Терміново' },
  { lane: 'Active', label: 'У роботі' },
  { lane: 'Done', label: 'Виконано' },
];

export const taskFilters: readonly { filter: TaskListFilter; label: string }[] = [
  { filter: 'Open', label: 'Відкриті' },
  { filter: 'Overdue', label: 'Прострочені' },
  { filter: 'Urgent', label: 'Термінові' },
  { filter: 'InProgress', label: 'У роботі' },
  { filter: 'New', label: 'Нові' },
  { filter: 'Done', label: 'Виконані' },
];
