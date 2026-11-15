import { apiCall, apiClient } from '@admin/shared/api-client';

import { reminderChatsTag, reminderTasksTag } from '../../cache/reminder-cache-tags';
import { reminderApiError } from '../../errors/reminder-api-error';
import { mapReminderChat, mapReminderChats } from '../../mappers/chats/reminder-chat.mapper';

import type { UpdateReminderChatRequest } from '../../models/reminder-requests';
import type { RemindersEndpointBuilder } from '../base/reminders-endpoint-builder';
import type { ReminderChat } from '@admin/reminders/model';
import type { components } from '@admin/shared/contracts';

export function reminderChatEndpoints(build: RemindersEndpointBuilder) {
  return {
    getReminderChats: build.query<ReminderChat[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reminders/chats', { signal }),
          mapReminderChats,
          reminderApiError,
        ),
      providesTags: [reminderChatsTag],
    }),
    updateReminderChat: build.mutation<ReminderChat, UpdateReminderChatRequest>({
      queryFn: ({ id, input }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/reminders/chats/{id}', {
            params: { path: { id: id } },
            body: {
              displayName: input.displayName,
              isApproved: input.isApproved,
              receivesSiteRequests: input.receivesSiteRequests,
            } satisfies components['schemas']['ReminderChatInput'],
            signal,
          }),
          mapReminderChat,
          reminderApiError,
        ),
      // Task rows show the chat name.
      invalidatesTags: (_, error) => (error ? [] : [reminderChatsTag, reminderTasksTag]),
    }),
    sendReminderChatTest: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.POST('/api/reminders/chats/{id}/test-message', {
            params: { path: { id: id } },
            signal,
          }),
          undefined,
          reminderApiError,
        ),
    }),
    connectTelegramWebhook: build.mutation<string, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.POST('/api/reminders/telegram/connect', { signal }),
          (value: unknown) => (typeof value === 'string' ? value : ''),
          reminderApiError,
        ),
    }),
  };
}
