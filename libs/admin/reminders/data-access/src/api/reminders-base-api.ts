import { adminApi } from '@admin/shared/api-client';

export const remindersBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['ReminderTask', 'ReminderOccurrence', 'ReminderChat', 'ReminderNonWorkingDay'],
});
