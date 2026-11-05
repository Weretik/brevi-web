import type { AiSettings, AiSettingsInput } from '../entities/ai-settings';

export const aiPromptMaxLength = 4000;

/** Numbers stay text while typing, so «0,10» or an empty field can be shown with a reason. */
export interface AiSettingsFormValues {
  enabled: boolean;
  fastModel: string;
  fastInputPrice: string;
  fastOutputPrice: string;
  strongModel: string;
  strongInputPrice: string;
  strongOutputPrice: string;
  monthlyLimitUsd: string;
}

export function aiSettingsFormOf(settings: AiSettings): AiSettingsFormValues {
  return {
    enabled: settings.enabled,
    fastModel: settings.fastModel,
    fastInputPrice: String(settings.fastInputPrice),
    fastOutputPrice: String(settings.fastOutputPrice),
    strongModel: settings.strongModel,
    strongInputPrice: String(settings.strongInputPrice),
    strongOutputPrice: String(settings.strongOutputPrice),
    monthlyLimitUsd: String(settings.monthlyLimitUsd),
  };
}

export const aiNumberOf = (value: string): number => Number(value.trim().replace(',', '.'));

export function aiSettingsInputOf(values: AiSettingsFormValues, version: number): AiSettingsInput {
  return {
    enabled: values.enabled,
    fastModel: values.fastModel.trim(),
    fastInputPrice: aiNumberOf(values.fastInputPrice),
    fastOutputPrice: aiNumberOf(values.fastOutputPrice),
    strongModel: values.strongModel.trim(),
    strongInputPrice: aiNumberOf(values.strongInputPrice),
    strongOutputPrice: aiNumberOf(values.strongOutputPrice),
    monthlyLimitUsd: aiNumberOf(values.monthlyLimitUsd),
    version,
  };
}
