import { aiPromptMaxLength } from './ai-settings-form';

/** One condition is one line of the stored text, written as «- rule» for the AI. */
export const aiRuleMaxLength = 500;

/** Splits the stored text into conditions; older free text keeps one condition per line. */
export function aiRulesOf(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^-\s*/, '').trim())
    .filter((line) => line.length > 0);
}

export function aiRulesText(rules: readonly string[]): string {
  return rules.map((rule) => `- ${rule}`).join('\n');
}

/** Checks one condition before it is added to the others; returns the reason or undefined. */
export function validateAiRule(rule: string, others: readonly string[]): string | undefined {
  const value = rule.replace(/\s+/g, ' ').trim();
  if (value.length === 0) return 'Напишіть умову';
  if (value.length > aiRuleMaxLength) return `Не більше ${aiRuleMaxLength} символів`;
  if (aiRulesText([...others, value]).length > aiPromptMaxLength)
    return `Усі умови разом — не більше ${aiPromptMaxLength} символів`;
  return undefined;
}

/** One line, single spaces: a newline would split the condition in two. */
export const aiRuleOf = (value: string) => value.replace(/\s+/g, ' ').trim();
