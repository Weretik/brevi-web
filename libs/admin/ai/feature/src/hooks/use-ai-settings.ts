import {
  useGetAiSettingsQuery,
  useUpdateAiPromptMutation,
  useUpdateAiSettingsMutation,
} from '@admin/ai/data-access';
import {
  aiRulesOf,
  aiRulesText,
  aiSettingsFormOf,
  aiSettingsInputOf,
  validateAiSettings,
} from '@admin/ai/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useEffect, useState } from 'react';

import { useAiKey } from './use-ai-key';
import { useAiModels } from './use-ai-models';

import type { AiSettings, AiSettingsErrors, AiSettingsFormValues } from '@admin/ai/model';

export interface AiNotice {
  text: string;
  ok: boolean;
}

/** Each card shows its own result next to its buttons. */
export type AiArea = 'work' | 'key' | 'models' | 'prompt';

export type AiModelValues = Omit<AiSettingsFormValues, 'enabled' | 'monthlyLimitUsd'>;

/** What a card hook needs from the page: the settings, the notices and one save of the stored settings. */
export interface AiSettingsContext {
  settings: AiSettings | null;
  notify: (area: AiArea, notice: AiNotice | null) => void;
  fail: (area: AiArea, error: unknown, fallback: string) => void;
  saveWith: (
    changes: Partial<AiSettingsFormValues>,
    area: AiArea,
    done: string,
  ) => Promise<{ errors: AiSettingsErrors; saved: boolean }>;
}

/**
 * «Налаштування ШІ»: every card saves itself. The switch saves at once, the limit has its own
 * button, models and prices are changed in the side panel, the key and the rules as before.
 */
export function useAiSettings() {
  const query = useGetAiSettingsQuery();
  const [update, updating] = useUpdateAiSettingsMutation();
  const [updatePrompt, savingPrompt] = useUpdateAiPromptMutation();
  const settings = query.data ?? null;
  const [limit, setLimit] = useState('');
  const [limitError, setLimitError] = useState<string | undefined>();
  const [notices, setNotices] = useState<Partial<Record<AiArea, AiNotice>>>({});

  useEffect(() => {
    if (!settings) return;
    setLimit(String(settings.monthlyLimitUsd));
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

  const context: AiSettingsContext = { settings, notify, fail, saveWith };
  const keyCard = useAiKey(context);
  const modelCard = useAiModels(context);

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

  /** Saves the whole list after one condition is added, changed or deleted. */
  async function saveRules(promptKey: string, rules: string[], done: string): Promise<boolean> {
    notify('prompt', null);
    try {
      await updatePrompt({ key: promptKey, text: aiRulesText(rules) }).unwrap();
      notify('prompt', { text: done, ok: true });
      return true;
    } catch (error) {
      fail('prompt', error, 'Не вдалося зберегти умови.');
      return false;
    }
  }

  return {
    ...modelCard,
    ...keyCard,
    settings,
    loading: query.isLoading,
    error: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося відкрити налаштування ШІ.')
      : null,
    reload: query.refetch,
    busy: updating.isLoading || keyCard.busy || modelCard.busy || savingPrompt.isLoading,
    saving: updating.isLoading,
    notices,
    limit,
    limitError,
    limitDirty: Boolean(settings) && limit.trim() !== String(settings?.monthlyLimitUsd),
    changeLimit: (value: string) => {
      setLimit(value);
      setLimitError(undefined);
    },
    rulesOf: (promptKey: string) =>
      aiRulesOf(settings?.prompts.find((x) => x.key === promptKey)?.text ?? ''),
    toggle,
    saveLimit,
    saveRules,
  };
}
