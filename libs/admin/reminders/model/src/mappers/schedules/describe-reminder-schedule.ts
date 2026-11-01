import { reminderPeriodicityLabels } from '../../entities/tasks/reminder-schedule';

import type { ReminderSchedule } from '../../entities/tasks/reminder-schedule';

const periodNames = { monthly: 'місяця', quarterly: 'кварталу', yearly: 'року' } as const;

function offsetText(schedule: ReminderSchedule): string {
  if (schedule.monthOffset === 0)
    return schedule.periodicity === 'monthly'
      ? 'цього місяця'
      : `останнього місяця ${periodNames[schedule.periodicity]}`;
  if (schedule.monthOffset === 1) return 'наступного місяця';
  return `через ${schedule.monthOffset} міс.`;
}

/** Short Ukrainian rule text, for example «Щомісяця · до 20 числа наступного місяця». */
export function describeReminderSchedule(schedule: ReminderSchedule): string {
  const periodicity = reminderPeriodicityLabels[schedule.periodicity];
  switch (schedule.dueRule) {
    case 'dayOfMonth':
      return `${periodicity} · до ${schedule.day} числа ${offsetText(schedule)}`;
    case 'lastWorkingDayOfMonth':
      return `${periodicity} · останній робочий день ${offsetText(schedule)}`;
    case 'daysAfterPeriodEnd':
      return `${periodicity} · ${schedule.day} дн. після кінця ${periodNames[schedule.periodicity]}`;
  }
}
