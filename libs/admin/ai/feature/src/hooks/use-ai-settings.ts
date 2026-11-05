import {
  useGetAiSettingsQuery,
  useRemoveAiKeyMutation,
  useSetAiKeyMutation,
  useTestAiConnectionMutation,
  useUpdateAiPromptMutation,
  useUpdateAiSettingsMutation,
} from '@admin/ai/data-access';
import {
  aiSettingsFormOf,
  aiSettingsInputOf,
  validateAiKey,
  validateAiSettings,
} from '@admin/ai/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useEffect, useState } from 'react';

import type { AiModelTier, AiSettingsErrors, AiSettingsFormValues } from '@admin/ai/model';

export interface AiNotice {
  text: string;
  ok: boolean;
}

const usd = (value: number) => `${value.toLocaleString('uk-UA', { maximumFractionDigits: 6 })} $`;

/** «Налаштування ШІ»: key, models and limit, «Перевірити», extra rules. */
export function useAiSettings() {
  const query = useGetAiSettingsQuery();
  const [update, updating] = useUpdateAiSettingsMutation();
  const [setKey, settingKey] = useSetAiKeyMutation();
  const [removeKey, removingKey] = useRemoveAiKeyMutation();
  const [test, testing] = useTestAiConnectionMutation();
  const [updatePrompt, savingPrompt] = useUpdateAiPromptMutation();
  const [values, setValues] = useState<AiSettingsFormValues | null>(null);
  const [errors, setErrors] = useState<AiSettingsErrors>({});
  const [key, setKeyValue] = useState('');
  const [keyError, setKeyError] = useState<string | undefined>();
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<AiNotice | null>(null);
  const [testingTier, setTestingTier] = useState<AiModelTier | null>(null);
  const settings = query.data ?? null;

  useEffect(() => {
    if (!settings) return;
    setValues(aiSettingsFormOf(settings));
    setPrompts(Object.fromEntries(settings.prompts.map((prompt) => [prompt.key, prompt.text])));
  }, [settings]);

  const fail = (error: unknown, fallback: string) =>
    setNotice({ text: adminApiErrorMessage(error, fallback), ok: false });

  async function save() {
    if (!values || !settings) return;
    const found = validateAiSettings(values, settings.hasKey);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    try {
      await update(aiSettingsInputOf(values, settings.version)).unwrap();
      setNotice({ text: 'Налаштування збережено.', ok: true });
    } catch (error) {
      fail(error, 'Не вдалося зберегти налаштування.');
    }
  }

  async function saveKey() {
    const found = validateAiKey(key);
    setKeyError(found);
    if (found) return;
    try {
      const saved = await setKey(key.trim()).unwrap();
      setKeyValue('');
      setNotice({
        text: `Ключ збережено (…${saved.keyHint ?? ''}). Натисніть «Перевірити».`,
        ok: true,
      });
    } catch (error) {
      fail(error, 'Не вдалося зберегти ключ.');
    }
  }

  async function deleteKey() {
    try {
      await removeKey().unwrap();
      setNotice({ text: 'Ключ видалено, ШІ вимкнено.', ok: true });
    } catch (error) {
      fail(error, 'Не вдалося видалити ключ.');
    }
  }

  async function check(tier: AiModelTier) {
    setTestingTier(tier);
    try {
      const result = await test(tier).unwrap();
      setNotice({
        text: `OpenAI відповів: модель ${result.model} працює. Вартість перевірки ${usd(result.costUsd)}.`,
        ok: true,
      });
    } catch (error) {
      fail(error, 'Не вдалося перевірити підключення.');
    } finally {
      setTestingTier(null);
    }
  }

  async function savePrompt(promptKey: string) {
    try {
      await updatePrompt({ key: promptKey, text: prompts[promptKey] ?? '' }).unwrap();
      setNotice({ text: 'Умови збережено.', ok: true });
    } catch (error) {
      fail(error, 'Не вдалося зберегти умови.');
    }
  }

  const saved = settings ? aiSettingsFormOf(settings) : null;
  return {
    settings,
    values,
    errors,
    key,
    keyError,
    prompts,
    notice,
    testingTier,
    loading: query.isLoading,
    error: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося відкрити налаштування ШІ.')
      : null,
    reload: query.refetch,
    busy:
      updating.isLoading ||
      settingKey.isLoading ||
      removingKey.isLoading ||
      testing.isLoading ||
      savingPrompt.isLoading,
    dirty: Boolean(values && saved && JSON.stringify(values) !== JSON.stringify(saved)),
    promptDirty: (promptKey: string) =>
      (prompts[promptKey] ?? '') !==
      (settings?.prompts.find((x) => x.key === promptKey)?.text ?? ''),
    change: setValues,
    changeKey: (value: string) => {
      setKeyValue(value);
      setKeyError(undefined);
    },
    changePrompt: (promptKey: string, text: string) =>
      setPrompts((current) => ({ ...current, [promptKey]: text })),
    clearNotice: () => setNotice(null),
    save,
    saveKey,
    deleteKey,
    check,
    savePrompt,
  };
}
