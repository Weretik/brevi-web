import type { ScheduledTask } from '@admin/scheduling/model';

/** The header line: what the page is, and how many tasks need attention (only problems are counted). */
export function TasksSummary({ tasks }: { tasks: ScheduledTask[] }) {
  const failed = tasks.filter((task) => task.lastRunFailed || task.overdue).length;
  const base = 'Задачі задає код; тут змінюють лише розклад і запускають вручну. Час — київський.';
  return <>{failed > 0 ? `${base} Потребують уваги: ${failed}.` : base}</>;
}
