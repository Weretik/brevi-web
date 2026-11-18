import { useSetAiKeyMutation, useRemoveAiKeyMutation } from '@admin/ai/data-access';
import { validateAiKey } from '@admin/ai/model';
import { useState } from 'react';

import type { AiSettingsContext } from './use-ai-settings';

/** The OpenAI key card: enter, save and delete the key. */
export function useAiKey({ notify, fail }: AiSettingsContext) {
  const [setKey, settingKey] = useSetAiKeyMutation();
  const [removeKey, removingKey] = useRemoveAiKeyMutation();
  const [key, setKeyValue] = useState('');
  const [keyError, setKeyError] = useState<string | undefined>();

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

  return {
    busy: settingKey.isLoading || removingKey.isLoading,
    key,
    keyError,
    changeKey: (value: string) => {
      setKeyValue(value);
      setKeyError(undefined);
    },
    saveKey,
    deleteKey,
  };
}
