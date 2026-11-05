import { describe, expect, it } from 'vitest';

import { mapAiSettings, mapAiTestResult } from './ai-settings.mapper';

const response = {
  hasKey: true,
  keyHint: '1234',
  enabled: true,
  fastModel: 'gpt-6-luna',
  fastInputPrice: 0.1,
  fastOutputPrice: 0.5,
  strongModel: 'gpt-6.1-terra',
  strongInputPrice: 1,
  strongOutputPrice: 5,
  monthlyLimitUsd: 5,
  version: 3,
  updatedBy: 'admin@brevi.com.ua',
  updatedAt: '2026-11-05T08:00:00+00:00',
  usage: { month: '2026-11', requests: 2, inputTokens: 2000, outputTokens: 300, costUsd: 0.00035 },
  prompts: [
    {
      key: 'purchase-invoices',
      title: 'Умови розпізнавання рахунків',
      baseText: 'You read one Ukrainian supplier invoice.',
      text: '',
      updatedBy: null,
      updatedAt: null,
    },
  ],
};

describe('mapAiSettings', () => {
  it('reads settings without the key', () => {
    const settings = mapAiSettings(response);
    expect(settings.keyHint).toBe('1234');
    expect(settings.usage.costUsd).toBe(0.00035);
    expect(settings.prompts[0]?.title).toBe('Умови розпізнавання рахунків');
    expect(settings.prompts[0]?.baseText).toBe('You read one Ukrainian supplier invoice.');
  });

  it('rejects a broken answer', () => {
    expect(() => mapAiSettings({ ...response, monthlyLimitUsd: '5' })).toThrow(/ліміт/);
  });

  it('reads a test result', () => {
    expect(
      mapAiTestResult({
        tier: 'Strong',
        model: 'gpt-6.1-terra',
        inputTokens: 20,
        outputTokens: 5,
        costUsd: 0.00005,
      }).model,
    ).toBe('gpt-6.1-terra');
  });
});
