import type { TaskLane, TaskSummary, TaskViewer } from '../entities/manager-task';

/** What dropping a card on a lane does (TSK-001 R-07, R-08). */
export type TaskMove =
  | { readonly kind: 'status'; readonly status: 'InProgress' | 'Done' }
  | { readonly kind: 'urgent'; readonly isUrgent: boolean };

/**
 * «Прострочено» is never a target: it follows the due time. A Manager moves cards only to
 * «У роботі» and «Виконано»; Director and Admin also put them into or out of «Терміново».
 */
export function taskMove(task: TaskSummary, target: TaskLane, viewer: TaskViewer): TaskMove | null {
  if (target === task.lane || target === 'Overdue') return null;
  if (target === 'Done') return { kind: 'status', status: 'Done' };
  if (target === 'Urgent') {
    return viewer.isAdmin && task.status !== 'Done' && !task.isUrgent
      ? { kind: 'urgent', isUrgent: true }
      : null;
  }
  // «У роботі»: reopen a done card, take a new one into work, or (Admin) drop the urgent mark.
  if (task.status === 'Done' || task.status === 'New')
    return { kind: 'status', status: 'InProgress' };
  if (task.isUrgent && viewer.isAdmin) return { kind: 'urgent', isUrgent: false };
  return null;
}

/** Cards grouped by lane, the newest added first inside each lane (round 2, item 11). */
export function groupTasksByLane(tasks: readonly TaskSummary[]): Record<TaskLane, TaskSummary[]> {
  const lanes: Record<TaskLane, TaskSummary[]> = { Overdue: [], Urgent: [], Active: [], Done: [] };
  const newest = [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
  for (const task of newest) lanes[task.lane].push(task);
  return lanes;
}

/** «На сьогодні»: up to three open tasks — overdue ones first, then those due before tomorrow. */
export function tasksForToday(tasks: readonly TaskSummary[], now: Date): TaskSummary[] {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return tasks
    .filter((task) => task.status !== 'Done' && (task.isOverdue || new Date(task.dueAt) < tomorrow))
    .sort((a, b) => Number(b.isOverdue) - Number(a.isOverdue) || a.dueAt.localeCompare(b.dueAt))
    .slice(0, 3);
}
