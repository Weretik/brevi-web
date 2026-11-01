export const reminderPeriodicities = ['monthly', 'quarterly', 'yearly'] as const;
export type ReminderPeriodicity = (typeof reminderPeriodicities)[number];

export const reminderPeriodicityLabels: Record<ReminderPeriodicity, string> = {
  monthly: 'Щомісяця',
  quarterly: 'Щокварталу',
  yearly: 'Щороку',
};

export const reminderDueRules = [
  'dayOfMonth',
  'lastWorkingDayOfMonth',
  'daysAfterPeriodEnd',
] as const;
export type ReminderDueRule = (typeof reminderDueRules)[number];

export const reminderDueRuleLabels: Record<ReminderDueRule, string> = {
  dayOfMonth: 'Число місяця',
  lastWorkingDayOfMonth: 'Останній робочий день місяця',
  daysAfterPeriodEnd: 'Днів після кінця періоду',
};

/** Limits enforced by the backend validator. */
export const reminderScheduleLimits = {
  dayOfMonth: { min: 1, max: 31 },
  daysAfterPeriodEnd: { min: 1, max: 366 },
  monthOffset: { min: 0, max: 12 },
  leadDays: { min: 0, max: 60 },
} as const;

export const defaultReminderLeadDays = 5;

export interface ReminderSchedule {
  periodicity: ReminderPeriodicity;
  dueRule: ReminderDueRule;
  day: number;
  monthOffset: number;
  leadDays: number;
}
