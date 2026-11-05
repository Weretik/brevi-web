import { describe, expect, it } from 'vitest';

import { aiRuleOf, aiRulesOf, aiRulesText, validateAiRule } from './ai-prompt-rules';

describe('AI recognition conditions', () => {
  it('stores one «- rule» line per condition and reads older free text by lines', () => {
    expect(aiRulesText(['Без ПДВ для Бистрова', 'Номер без №'])).toBe(
      '- Без ПДВ для Бистрова\n- Номер без №',
    );
    expect(aiRulesOf('- Без ПДВ для Бистрова\n\n  Номер без №  \r\n')).toEqual([
      'Без ПДВ для Бистрова',
      'Номер без №',
    ]);
    expect(aiRulesOf('')).toEqual([]);
  });

  it('keeps a condition on one line and checks its length and the total', () => {
    expect(aiRuleOf('  Два\n рядки ')).toBe('Два рядки');
    expect(validateAiRule('   ', [])).toBe('Напишіть умову');
    expect(validateAiRule('x'.repeat(501), [])).toBe('Не більше 500 символів');
    expect(validateAiRule('нова', Array(9).fill('x'.repeat(450)))).toMatch(/Усі умови разом/);
    expect(validateAiRule('Номер без №', [])).toBeUndefined();
  });
});
