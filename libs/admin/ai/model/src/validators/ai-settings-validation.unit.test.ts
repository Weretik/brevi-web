import { describe, expect, it } from 'vitest';

import { validateAiKey, validateAiSettings } from './ai-settings-validation';

import type { AiSettingsFormValues } from '../forms/ai-settings-form';

const values: AiSettingsFormValues = {
  enabled: true,
  fastModel: 'gpt-6-luna',
  fastInputPrice: '0.10',
  fastOutputPrice: '0,5',
  strongModel: 'gpt-6.1-terra',
  strongInputPrice: '1',
  strongOutputPrice: '5',
  monthlyLimitUsd: '5',
};

describe('validateAiSettings', () => {
  it('accepts models, prices with a comma and a limit', () => {
    expect(validateAiSettings(values, true)).toEqual({});
  });

  it('explains wrong models, prices, limit and switching on without a key', () => {
    expect(
      validateAiSettings(
        { ...values, fastModel: 'gpt 6', strongInputPrice: '-1', monthlyLimitUsd: '5.555' },
        false,
      ),
    ).toEqual({
      fastModel: 'Назва моделі, наприклад gpt-6-luna',
      strongInputPrice: 'Ціна — число, наприклад 0.10',
      monthlyLimitUsd: 'Від 0 до 10000 $, до центів',
      enabled: 'Спочатку додайте ключ OpenAI',
    });
  });
});

describe('validateAiKey', () => {
  it('needs 20–300 characters without spaces', () => {
    expect(validateAiKey('')).toBe('Вставте ключ');
    expect(validateAiKey('sk-short')).toBe('Ключ — від 20 до 300 символів без пробілів');
    expect(validateAiKey('sk-proj-abcdefghijklmnopqrstuvwxyz')).toBeUndefined();
  });
});
