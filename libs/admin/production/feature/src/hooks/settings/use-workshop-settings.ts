import {
  useGetWorkshopSettingsQuery,
  useSendWorkshopTelegramTestMutation,
  useUpdateWorkshopSettingsMutation,
} from '@admin/production/data-access';
import {
  validateWorkshopSettings,
  workshopSettingsBody,
  workshopSettingsFormValues,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useEffect, useState } from 'react';

import type { WorkshopSettingsErrors, WorkshopSettingsFormValues } from '@admin/production/model';

/** «Налаштування цеху»: choose the group and topic, save, send a test line. */
export function useWorkshopSettings() {
  const query = useGetWorkshopSettingsQuery();
  const [update, updating] = useUpdateWorkshopSettingsMutation();
  const [test, testing] = useSendWorkshopTelegramTestMutation();
  const [values, setValues] = useState<WorkshopSettingsFormValues | null>(null);
  const [errors, setErrors] = useState<WorkshopSettingsErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const settings = query.data ?? null;

  useEffect(() => {
    if (settings) setValues(workshopSettingsFormValues(settings));
  }, [settings]);

  async function save() {
    if (!values) return;
    const found = validateWorkshopSettings(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    try {
      await update(workshopSettingsBody(values)).unwrap();
      setMessage('Налаштування збережено.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти налаштування.'));
    }
  }

  async function sendTest() {
    try {
      await test().unwrap();
      setMessage('Перевірочне повідомлення надіслано. Подивіться в групу.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося надіслати перевірочне повідомлення.'));
    }
  }

  const saved = settings ? workshopSettingsFormValues(settings) : null;
  return {
    settings,
    values,
    errors,
    message,
    loading: query.isLoading,
    error: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося відкрити налаштування.')
      : null,
    reload: query.refetch,
    saving: updating.isLoading,
    testing: testing.isLoading,
    dirty: Boolean(values && saved && JSON.stringify(values) !== JSON.stringify(saved)),
    canTest: Boolean(settings?.botConfigured && settings.telegramChatId !== null),
    change: setValues,
    clearMessage: () => setMessage(null),
    save,
    sendTest,
  };
}
