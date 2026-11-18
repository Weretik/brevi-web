import { useTestAiConnectionMutation } from '@admin/ai/data-access';
import { aiSettingsFormOf } from '@admin/ai/model';
import { useState } from 'react';

import type { AiModelValues, AiSettingsContext } from './use-ai-settings';
import type { AiModelTier, AiSettingsErrors } from '@admin/ai/model';

const usd = (value: number) => `${value.toLocaleString('uk-UA', { maximumFractionDigits: 6 })} $`;

/** The models card: the side panel with models and prices, and the check of each model. */
export function useAiModels({ settings, notify, fail, saveWith }: AiSettingsContext) {
  const [test, testing] = useTestAiConnectionMutation();
  const [models, setModels] = useState<AiModelValues | null>(null);
  const [modelErrors, setModelErrors] = useState<AiSettingsErrors>({});
  const [testingTier, setTestingTier] = useState<AiModelTier | null>(null);

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

  return {
    busy: testing.isLoading,
    models,
    modelErrors,
    changeModels: setModels,
    openModels,
    closeModels: () => setModels(null),
    testingTier,
    saveModels,
    check,
  };
}
