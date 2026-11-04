import { ReferenceFilterChip, ReferenceFilterRow } from '@admin/references/ui';
import { taskFilters } from '@admin/tasks/model';

import type { TaskListFilter, TaskOverview } from '@admin/tasks/model';

interface Props {
  filter: TaskListFilter;
  overview: TaskOverview | undefined;
  count: number;
  onChange: (filter: TaskListFilter) => void;
}

const counts: Record<TaskListFilter, keyof TaskOverview> = {
  Open: 'open',
  Overdue: 'overdue',
  Urgent: 'urgent',
  InProgress: 'inProgress',
  New: 'new',
  Done: 'done',
};

/** Filter chips with counts of the selected manager (or of everyone). */
export function TaskListFilters({ filter, overview, count, onChange }: Props) {
  const countOf = (value: TaskListFilter) =>
    overview ? (overview[counts[value]] as number) : undefined;
  return (
    <ReferenceFilterRow
      filters={taskFilters.map((item) => (
        <ReferenceFilterChip
          key={item.filter}
          label={item.label}
          count={countOf(item.filter)}
          selected={filter === item.filter}
          onClick={() => onChange(item.filter)}
        />
      ))}
      count={count}
      total={countOf(filter) ?? count}
      countLabel="Кількість завдань"
      selectedCount={0}
      onClearSelection={() => undefined}
    />
  );
}
