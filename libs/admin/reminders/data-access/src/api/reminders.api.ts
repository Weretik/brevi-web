import { nonWorkingDayEndpoints } from './calendar/non-working-day-endpoints';
import { reminderChatEndpoints } from './chats/reminder-chat-endpoints';
import { reminderOccurrenceEndpoints } from './occurrences/reminder-occurrence-endpoints';
import { remindersBaseApi } from './reminders-base-api';
import { reminderTaskEndpoints } from './tasks/reminder-task-endpoints';

export const remindersApi = remindersBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...reminderTaskEndpoints(build),
    ...reminderOccurrenceEndpoints(build),
    ...reminderChatEndpoints(build),
    ...nonWorkingDayEndpoints(build),
  }),
});

export const {
  useGetReminderTasksQuery,
  useCreateReminderTaskMutation,
  useUpdateReminderTaskMutation,
  useArchiveReminderTaskMutation,
  usePreviewReminderDueDatesQuery,
  useAssignReminderChatMutation,
  useGetReminderOccurrencesQuery,
  useCloseReminderOccurrenceMutation,
  useReopenReminderOccurrenceMutation,
  useGetReminderChatsQuery,
  useUpdateReminderChatMutation,
  useSendReminderChatTestMutation,
  useConnectTelegramWebhookMutation,
  useGetNonWorkingDaysQuery,
  useAddNonWorkingDayMutation,
  useRemoveNonWorkingDayMutation,
} = remindersApi;
