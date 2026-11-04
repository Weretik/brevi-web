import { formatTaskMoment } from './task-dates';
import { taskStatusLabels } from './task-labels';

import type { TaskEvent, TaskStatus } from '../entities/manager-task';

/** «Історія змін» line in Ukrainian (TSK-001 R-11). */
export function describeTaskEvent(event: TaskEvent): string {
  switch (event.kind) {
    case 'Created':
      return 'Поставив завдання';
    case 'Edited':
      return 'Змінив завдання';
    case 'Reassigned':
      return `Передав: ${event.details ?? 'іншому менеджеру'}`;
    case 'DueChanged':
      return event.details ? `Новий термін: ${formatTaskMoment(event.details)}` : 'Змінив термін';
    case 'StatusChanged':
      return `Статус: ${taskStatusLabels[event.details as TaskStatus] ?? event.details ?? ''}`;
    case 'UrgentChanged':
      return event.details === 'true' ? 'Позначив терміновим' : 'Зняв позначку «Терміново»';
    case 'StepChecked':
      return `Виконав крок «${event.details ?? ''}»`;
    case 'StepUnchecked':
      return `Повернув крок «${event.details ?? ''}»`;
  }
}
