export const aiModelTiers = ['Fast', 'Strong'] as const;
/** Fast is tried first; Strong is the retry when the fast answer fails its checks. */
export type AiModelTier = (typeof aiModelTiers)[number];

/** Use of the current month (UTC), counted from tokens and the prices in settings. */
export interface AiUsage {
  month: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

/** Extra rules the admin adds to one kind of request, e.g. invoice recognition. */
export interface AiPrompt {
  key: string;
  title: string;
  text: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

/**
 * «Налаштування ШІ». The OpenAI key itself never comes back: only whether it is set and its
 * last four characters.
 */
export interface AiSettings {
  hasKey: boolean;
  keyHint: string | null;
  enabled: boolean;
  fastModel: string;
  fastInputPrice: number;
  fastOutputPrice: number;
  strongModel: string;
  strongInputPrice: number;
  strongOutputPrice: number;
  monthlyLimitUsd: number;
  version: number;
  updatedBy: string | null;
  updatedAt: string | null;
  usage: AiUsage;
  prompts: readonly AiPrompt[];
}

export interface AiSettingsInput {
  enabled: boolean;
  fastModel: string;
  fastInputPrice: number;
  fastOutputPrice: number;
  strongModel: string;
  strongInputPrice: number;
  strongOutputPrice: number;
  monthlyLimitUsd: number;
  version: number;
}

/** «Перевірити»: OpenAI answered with this model. */
export interface AiTestResult {
  tier: AiModelTier;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}
