const dayMs = 24 * 60 * 60 * 1000;

const dayFormat = new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit' });
const timeFormat = new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' });
const fullFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Due time as cards and tables show it: «сьогодні 17:00», «завтра 12:00», «05.11 · 12:00»;
 * for an overdue task the delay is added: «01.11 · −3 дн».
 */
export function formatTaskDue(dueAt: string, now: Date, overdue: boolean): string {
  const due = new Date(dueAt);
  const days = Math.round((startOfDay(due).getTime() - startOfDay(now).getTime()) / dayMs);
  const time = timeFormat.format(due);
  if (overdue) {
    const late = Math.floor((now.getTime() - due.getTime()) / dayMs);
    return late >= 1 ? `${dayFormat.format(due)} · −${late} дн` : `сьогодні ${time}`;
  }
  if (days === 0) return `сьогодні ${time}`;
  if (days === 1) return `завтра ${time}`;
  return `${dayFormat.format(due)} · ${time}`;
}

export const formatTaskMoment = (value: string): string => fullFormat.format(new Date(value));
