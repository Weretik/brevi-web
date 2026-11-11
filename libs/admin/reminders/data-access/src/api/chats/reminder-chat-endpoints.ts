import { reminderChatsTag, reminderTasksTag } from '../../cache/reminder-cache-tags';
import { reminderApiError } from '../../errors/reminder-api-error';
import { mapReminderChat, mapReminderChats } from '../../mappers/chats/reminder-chat.mapper';

import type { UpdateReminderChatRequest } from '../../models/reminder-requests';
import type { RemindersEndpointBuilder } from '../reminders-endpoint-builder';
import type { ReminderChat } from '@admin/reminders/model';
import type { components } from '@admin/shared/contracts';

export function reminderChatEndpoints(build: RemindersEndpointBuilder) {
  return {
    getReminderChats: build.query<ReminderChat[], void>({
      query: () => '/api/reminders/chats',
      transformResponse: mapReminderChats,
      transformErrorResponse: reminderApiError,
      providesTags: [reminderChatsTag],
    }),
    updateReminderChat: build.mutation<ReminderChat, UpdateReminderChatRequest>({
      query: ({ id, input }) => ({
        url: `/api/reminders/chats/${id}`,
        method: 'PUT',
        body: {
          displayName: input.displayName,
          isApproved: input.isApproved,
          receivesSiteRequests: input.receivesSiteRequests,
        } satisfies components['schemas']['ReminderChatInput'],
      }),
      transformResponse: mapReminderChat,
      transformErrorResponse: reminderApiError,
      // Task rows show the chat name.
      invalidatesTags: (_, error) => (error ? [] : [reminderChatsTag, reminderTasksTag]),
    }),
    sendReminderChatTest: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reminders/chats/${id}/test-message`, method: 'POST' }),
      transformErrorResponse: reminderApiError,
    }),
    connectTelegramWebhook: build.mutation<string, void>({
      query: () => ({ url: '/api/reminders/telegram/connect', method: 'POST' }),
      transformResponse: (value: unknown) => (typeof value === 'string' ? value : ''),
      transformErrorResponse: reminderApiError,
    }),
  };
}
