import { aiModelTiers } from '@admin/ai/model';

import {
  amount,
  flag,
  integer,
  list,
  nullableDateTime,
  nullableText,
  oneOf,
  record,
  text,
} from '../validators/ai-response';

import type { AiPrompt, AiSettings, AiTestResult } from '@admin/ai/model';

function mapPrompt(value: unknown): AiPrompt {
  const row = record(value, 'умови');
  return {
    key: text(row['key'], 'ключ умов'),
    title: text(row['title'], 'назва умов'),
    text: text(row['text'], 'текст умов'),
    updatedBy: nullableText(row['updatedBy'], 'хто змінив умови'),
    updatedAt: nullableDateTime(row['updatedAt'], 'коли змінено умови'),
  };
}

export function mapAiSettings(value: unknown): AiSettings {
  const row = record(value, 'налаштування');
  const usage = record(row['usage'], 'витрати');
  return {
    hasKey: flag(row['hasKey'], 'ключ'),
    keyHint: nullableText(row['keyHint'], 'кінець ключа'),
    enabled: flag(row['enabled'], 'увімкнено'),
    fastModel: text(row['fastModel'], 'швидка модель'),
    fastInputPrice: amount(row['fastInputPrice'], 'ціна входу'),
    fastOutputPrice: amount(row['fastOutputPrice'], 'ціна виходу'),
    strongModel: text(row['strongModel'], 'сильна модель'),
    strongInputPrice: amount(row['strongInputPrice'], 'ціна входу'),
    strongOutputPrice: amount(row['strongOutputPrice'], 'ціна виходу'),
    monthlyLimitUsd: amount(row['monthlyLimitUsd'], 'ліміт'),
    version: integer(row['version'], 'версія'),
    updatedBy: nullableText(row['updatedBy'], 'хто змінив'),
    updatedAt: nullableDateTime(row['updatedAt'], 'коли змінено'),
    usage: {
      month: text(usage['month'], 'місяць'),
      requests: integer(usage['requests'], 'запити'),
      inputTokens: integer(usage['inputTokens'], 'токени входу'),
      outputTokens: integer(usage['outputTokens'], 'токени виходу'),
      costUsd: amount(usage['costUsd'], 'витрати'),
    },
    prompts: list(row['prompts'], 'умови').map(mapPrompt),
  };
}

export function mapAiTestResult(value: unknown): AiTestResult {
  const row = record(value, 'перевірка');
  return {
    tier: oneOf(row['tier'], aiModelTiers, 'модель'),
    model: text(row['model'], 'модель'),
    inputTokens: integer(row['inputTokens'], 'токени входу'),
    outputTokens: integer(row['outputTokens'], 'токени виходу'),
    costUsd: amount(row['costUsd'], 'вартість'),
  };
}
