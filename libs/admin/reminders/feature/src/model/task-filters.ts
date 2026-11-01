import { reminderOrganizationLabels, reminderOrganizations } from '@admin/reminders/model';

import type { ReminderOrganization, ReminderTask } from '@admin/reminders/model';

export type TaskOrganizationFilter = ReminderOrganization | 'all';

export function filterTasks(
  tasks: readonly ReminderTask[],
  filter: TaskOrganizationFilter,
): ReminderTask[] {
  return filter === 'all' ? [...tasks] : tasks.filter((task) => task.organization === filter);
}

/** Chip options with counts, for example «ПП «Бреві» 12». */
export function taskFilterOptions(tasks: readonly ReminderTask[]) {
  return [
    { value: 'all' as TaskOrganizationFilter, label: 'Усі', count: tasks.length },
    ...reminderOrganizations.map((code) => ({
      value: code as TaskOrganizationFilter,
      label: reminderOrganizationLabels[code],
      count: tasks.filter((task) => task.organization === code).length,
    })),
  ];
}
