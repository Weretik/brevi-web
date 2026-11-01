export const reminderTasksTag = { type: 'ReminderTask' as const, id: 'LIST' };
export const reminderOccurrencesTag = { type: 'ReminderOccurrence' as const, id: 'LIST' };
export const reminderChatsTag = { type: 'ReminderChat' as const, id: 'LIST' };
export const nonWorkingDaysTag = { type: 'ReminderNonWorkingDay' as const, id: 'LIST' };

/** Days off move "last working day" deadlines, so task previews and periods refresh too. */
export const calendarChangeTags = [nonWorkingDaysTag, reminderTasksTag, reminderOccurrencesTag];
