import type { WorkshopSettings, WorkshopSettingsBody } from '../../entities/orders/production-tracking';

export interface WorkshopSettingsFormValues {
  telegramEnabled: boolean;
  chatId: string;
  threadId: string;
}

export type WorkshopSettingsErrors = Partial<Record<'chatId' | 'threadId', string>>;

export const workshopSettingsFormValues = (
  settings: WorkshopSettings,
): WorkshopSettingsFormValues => ({
  telegramEnabled: settings.telegramEnabled,
  chatId: settings.telegramChatId === null ? '' : String(settings.telegramChatId),
  threadId: settings.telegramThreadId === null ? '' : String(settings.telegramThreadId),
});

export function validateWorkshopSettings(
  values: WorkshopSettingsFormValues,
): WorkshopSettingsErrors {
  const errors: WorkshopSettingsErrors = {};
  if (values.telegramEnabled && !values.chatId)
    errors.chatId = 'Оберіть групу, щоб увімкнути надсилання.';
  const thread = values.threadId.trim();
  if (thread && (!/^\d+$/.test(thread) || Number(thread) < 1))
    errors.threadId = 'Номер теми — ціле число від 1.';
  return errors;
}

export const workshopSettingsBody = (values: WorkshopSettingsFormValues): WorkshopSettingsBody => ({
  telegramEnabled: values.telegramEnabled,
  telegramChatId: values.chatId ? Number(values.chatId) : null,
  telegramThreadId: values.threadId.trim() ? Number(values.threadId.trim()) : null,
});
