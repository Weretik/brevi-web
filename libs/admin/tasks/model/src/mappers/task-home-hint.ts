import type { TaskOverview } from '../entities/manager-task';

/**
 * Second line of the «Робочий стіл» tile: only what burns. Nothing overdue or urgent gives null,
 * and the tile shows its neutral line instead of an "all OK" mark.
 */
export function taskHomeHint(overview: TaskOverview | undefined): string | null {
  if (!overview) return null;
  const parts = [
    overview.overdue > 0 ? `прострочено ${overview.overdue}` : null,
    overview.urgent > 0 ? `терміново ${overview.urgent}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? `Завдання: ${parts.join(' · ')}` : null;
}
