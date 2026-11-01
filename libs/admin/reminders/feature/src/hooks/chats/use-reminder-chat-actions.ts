import {
  useAssignReminderChatMutation,
  useConnectTelegramWebhookMutation,
  useSendReminderChatTestMutation,
  useUpdateReminderChatMutation,
} from '@admin/reminders/data-access';
import { reminderChatName } from '@admin/reminders/model';
import { useState } from 'react';

import { reminderError } from '../../errors/reminder-error';

import type { ReminderChat, ReminderChatInput, ReminderOrganization } from '@admin/reminders/model';

interface Notify {
  success: (text: string) => void;
  failure: (text: string) => void;
}

/** Approve/rename, test message, assignment to organizations and bot connection. */
export function useReminderChatActions(notify: Notify) {
  const [editing, setEditing] = useState<ReminderChat | null>(null);
  const [assigning, setAssigning] = useState<ReminderChat | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<number | null>(null);
  const [update, updated] = useUpdateReminderChatMutation();
  const [assign, assigned] = useAssignReminderChatMutation();
  const [sendTest] = useSendReminderChatTestMutation();
  const [connect, connected] = useConnectTelegramWebhookMutation();

  const openEditor = (chat: ReminderChat) => {
    setDialogError(null);
    setEditing(chat);
  };
  const openAssign = (chat: ReminderChat) => {
    setDialogError(null);
    setAssigning(chat);
  };
  const save = async (input: ReminderChatInput) => {
    if (!editing) return;
    try {
      await update({ id: editing.id, input }).unwrap();
      setEditing(null);
      notify.success(input.isApproved ? 'Чат підтверджено.' : 'Нагадування в цей чат вимкнено.');
    } catch (error) {
      setDialogError(reminderError(error, 'Не вдалося зберегти чат.'));
    }
  };
  const assignTo = async (organizations: ReminderOrganization[]) => {
    if (!assigning) return;
    try {
      const count = await assign({ chatId: assigning.id, organizations }).unwrap();
      setAssigning(null);
      notify.success(`Чат «${reminderChatName(assigning)}» призначено задачам: ${count}.`);
    } catch (error) {
      setDialogError(reminderError(error, 'Не вдалося призначити чат.'));
    }
  };
  const test = async (chat: ReminderChat) => {
    setTestingId(chat.id);
    try {
      await sendTest(chat.id).unwrap();
      notify.success(`Тестове повідомлення надіслано в «${reminderChatName(chat)}».`);
    } catch (error) {
      notify.failure(reminderError(error, 'Не вдалося надіслати тест.'));
    } finally {
      setTestingId(null);
    }
  };
  const connectBot = async () => {
    try {
      await connect().unwrap();
      notify.success('Бота підключено: кнопки в Telegram тепер приходять у Brevi.');
    } catch (error) {
      notify.failure(reminderError(error, 'Не вдалося підключити бота.'));
    }
  };

  return {
    editing,
    assigning,
    dialogError,
    testingId,
    saving: updated.isLoading,
    assigningBusy: assigned.isLoading,
    connecting: connected.isLoading,
    openEditor,
    closeEditor: () => setEditing(null),
    openAssign,
    closeAssign: () => setAssigning(null),
    save,
    assignTo,
    test,
    connectBot,
  };
}
