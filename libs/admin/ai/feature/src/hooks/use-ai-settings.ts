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

/** Each card shows its own result next to its buttons. */
export type AiArea = 'work' | 'key' | 'models' | 'prompt';

export type AiModelValues = Omit<AiSettingsFormValues, 'enabled' | 'monthlyLimitUsd'>;

const usd = (value: number) => `${value.toLocaleString('uk-UA', { maximumFractionDigits: 6 })} $`;

/**
 * «Налаштування ШІ»: every card saves itself. The switch saves at once, the limit has its own
 * button, models and prices are changed in the side panel, the key and the rules as before.
 */
export function useAiSettings() {
  const query = useGetAiSettingsQuery();
  const [update, updating] = useUpdateAiSettingsMutation();
  const [setKey, settingKey] = useSetAiKeyMutation();
  const [removeKey, removingKey] = useRemoveAiKeyMutation();
  const [test, testing] = useTestAiConnectionMutation();
  const [updatePrompt, savingPrompt] = useUpdateAiPromptMutation();
  const settings = query.data ?? null;
  const [limit, setLimit] = useState('');
  const [limitError, setLimitError] = useState<string | undefined>();
  const [models, setModels] = useState<AiModelValues | null>(null);
  const [modelErrors, setModelErrors] = useState<AiSettingsErrors>({});
  const [key, setKeyValue] = useState('');
  const [keyError, setKeyError] = useState<string | undefined>();
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [notices, setNotices] = useState<Partial<Record<AiArea, AiNotice>>>({});
  const [testingTier, setTestingTier] = useState<AiModelTier | null>(null);

  useEffect(() => {
    if (!settings) return;
    setLimit(String(settings.monthlyLimitUsd));
    setPrompts(Object.fromEntries(settings.prompts.map((prompt) => [prompt.key, prompt.text])));
  }, [settings]);

  const notify = (area: AiArea, notice: AiNotice | null) =>
    setNotices((current) => ({ ...current, [area]: notice ?? undefined }));
  const fail = (area: AiArea, error: unknown, fallback: string) =>
    notify(area, { text: adminApiErrorMessage(error, fallback), ok: false });

  /** Saves the stored settings with the given changes; errors are those of the changed fields. */
  async function saveWith(
    changes: Partial<AiSettingsFormValues>,
    area: AiArea,
    done: string,
  ): Promise<{ errors: AiSettingsErrors; saved: boolean }> {
    if (!settings) return { errors: {}, saved: false };
    const values = { ...aiSettingsFormOf(settings), ...changes };
    const all = validateAiSettings(values, settings.hasKey);
    const found = Object.fromEntries(
      Object.entries(all).filter(([field]) => field in changes),
    ) as AiSettingsErrors;
    if (Object.keys(found).length > 0) return { errors: found, saved: false };
    notify(area, null);
    try {
      await update(aiSettingsInputOf(values, settings.version)).unwrap();
      notify(area, { text: done, ok: true });
      return { errors: {}, saved: true };
    } catch (error) {
      fail(area, error, 'Не вдалося зберегти.');
      return { errors: {}, saved: false };
    }
  }

  async function toggle(enabled: boolean) {
    const { errors } = await saveWith(
      { enabled },
      'work',
      enabled ? 'ШІ увімкнено.' : 'ШІ вимкнено.',
    );
    if (errors.enabled) notify('work', { text: errors.enabled, ok: false });
  }

  async function saveLimit() {
    const { errors } = await saveWith({ monthlyLimitUsd: limit }, 'work', 'Ліміт збережено.');
    setLimitError(errors.monthlyLimitUsd);
  }

  function openModels() {
    if (!settings) return;
    const form = aiSettingsFormOf(settings);
    setModels({
      fastModel: form.fastModel,
      fastInputPrice: form.fastInputPrice,
      fastOutputPrice: form.fastOutputPrice,
      strongModel: form.strongModel,
      strongInputPrice: form.strongInputPrice,
      strongOutputPrice: form.strongOutputPrice,
    });
    setModelErrors({});
  }

  async function saveModels() {
    if (!models) return;
    const { errors, saved } = await saveWith(models, 'models', 'Моделі й ціни збережено.');
    setModelErrors(errors);
    if (saved) setModels(null);
  }

  async function saveKey() {
    const found = validateAiKey(key);
    setKeyError(found);
    if (found) return;
    notify('key', null);
    try {
      const saved = await setKey(key.trim()).unwrap();
      setKeyValue('');
      notify('key', {
        text: `Ключ збережено (…${saved.keyHint ?? ''}). Перевірте моделі нижче.`,
        ok: true,
      });
    } catch (error) {
      fail('key', error, 'Не вдалося зберегти ключ.');
    }
  }

  async function deleteKey() {
    notify('key', null);
    try {
      await removeKey().unwrap();
      notify('key', { text: 'Ключ видалено, ШІ вимкнено.', ok: true });
    } catch (error) {
      fail('key', error, 'Не вдалося видалити ключ.');
    }
  }

  async function check(tier: AiModelTier) {
    setTestingTier(tier);
    notify('models', null);
    try {
      const result = await test(tier).unwrap();
      notify('models', {
        text: `OpenAI відповів: ${result.model} працює. Перевірка коштувала ${usd(result.costUsd)}.`,
        ok: true,
      });
    } catch (error) {
      fail('models', error, 'Не вдалося перевірити модель.');
    } finally {
      setTestingTier(null);
    }
  }

  async function savePrompt(promptKey: string) {
    notify('prompt', null);
    try {
      await updatePrompt({ key: promptKey, text: prompts[promptKey] ?? '' }).unwrap();
      notify('prompt', { text: 'Умови збережено.', ok: true });
    } catch (error) {
      fail('prompt', error, 'Не вдалося зберегти умови.');
    }
  }

  return {
    settings,
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
    saving: updating.isLoading,
    notices,
    limit,
    limitError,
    limitDirty: Boolean(settings) && limit.trim() !== String(settings?.monthlyLimitUsd),
    changeLimit: (value: string) => {
      setLimit(value);
      setLimitError(undefined);
    },
    models,
    modelErrors,
    changeModels: setModels,
    openModels,
    closeModels: () => setModels(null),
    key,
    keyError,
    changeKey: (value: string) => {
      setKeyValue(value);
      setKeyError(undefined);
    },
    prompts,
    promptDirty: (promptKey: string) =>
      (prompts[promptKey] ?? '') !==
      (settings?.prompts.find((x) => x.key === promptKey)?.text ?? ''),
    changePrompt: (promptKey: string, text: string) =>
      setPrompts((current) => ({ ...current, [promptKey]: text })),
    testingTier,
    toggle,
    saveLimit,
    saveModels,
    saveKey,
    deleteKey,
    check,
    savePrompt,
  };
}
