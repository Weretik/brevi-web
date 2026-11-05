import { aiNumberOf } from '../forms/ai-settings-form';

import type { AiSettingsFormValues } from '../forms/ai-settings-form';

export type AiSettingsErrors = Partial<Record<keyof AiSettingsFormValues, string>>;

const modelPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,79}$/;
const decimalPattern = /^\d{1,6}([.,]\d{1,4})?$/;

function price(value: string): string | undefined {
  if (!decimalPattern.test(value.trim())) return 'Ціна — число, наприклад 0.10';
  return aiNumberOf(value) > 1000 ? 'Не більше 1000 $' : undefined;
}

/** The same rules as the backend, so the admin sees the reason before saving. */
export function validateAiSettings(
  values: AiSettingsFormValues,
  hasKey: boolean,
): AiSettingsErrors {
  const errors: AiSettingsErrors = {};
  if (!modelPattern.test(values.fastModel.trim()))
    errors.fastModel = 'Назва моделі, наприклад gpt-6-luna';
  if (!modelPattern.test(values.strongModel.trim()))
    errors.strongModel = 'Назва моделі, наприклад gpt-6.1-terra';
  for (const field of [
    'fastInputPrice',
    'fastOutputPrice',
    'strongInputPrice',
    'strongOutputPrice',
  ] as const) {
    const error = price(values[field]);
    if (error) errors[field] = error;
  }
  const limit = values.monthlyLimitUsd.trim();
  if (!/^\d{1,5}([.,]\d{1,2})?$/.test(limit) || aiNumberOf(limit) > 10000)
    errors.monthlyLimitUsd = 'Від 0 до 10000 $, до центів';
  if (values.enabled && !hasKey) errors.enabled = 'Спочатку додайте ключ OpenAI';
  return errors;
}

/** OpenAI keys have no spaces; the backend accepts 20–300 characters. */
export function validateAiKey(value: string): string | undefined {
  const key = value.trim();
  if (key.length === 0) return 'Вставте ключ';
  if (key.length < 20 || key.length > 300 || /\s/.test(key))
    return 'Ключ — від 20 до 300 символів без пробілів';
  return undefined;
}
