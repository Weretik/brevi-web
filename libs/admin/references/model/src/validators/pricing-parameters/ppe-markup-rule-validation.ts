/** Form values of a PPE markup rule; markups are typed as percents (45), not fractions. */
export interface PpeMarkupRuleFormValues {
  name: string;
  retailMarkup: string;
  wholesaleMarkup: string;
  largeWholesaleMarkup: string;
  priceNote: string;
  appliesTo: string;
}

export type PpeMarkupRuleField = keyof PpeMarkupRuleFormValues;
export type PpeMarkupRuleFieldErrors = Partial<Record<PpeMarkupRuleField, string>>;

/** Text limits shared with BreviERP `PpeMarkupRule`. */
export const ppeMarkupRuleTextLimits = {
  name: 200,
  priceNote: 500,
  appliesTo: 500,
} as const satisfies Partial<Record<PpeMarkupRuleField, number>>;

const markupFields = ['retailMarkup', 'wholesaleMarkup', 'largeWholesaleMarkup'] as const;

export function validatePpeMarkupRule(values: PpeMarkupRuleFormValues): PpeMarkupRuleFieldErrors {
  const errors: PpeMarkupRuleFieldErrors = {};
  if (!values.name.trim()) errors.name = 'Вкажіть назву правила.';
  for (const field of markupFields) {
    const value = Number(values[field].replace(',', '.'));
    if (!values[field].trim() || !Number.isFinite(value) || value < 0 || value > 1000)
      errors[field] = 'Від 0 до 1000 %.';
  }
  for (const [field, limit] of Object.entries(ppeMarkupRuleTextLimits) as [
    keyof typeof ppeMarkupRuleTextLimits,
    number,
  ][]) {
    if (!errors[field] && values[field].trim().length > limit)
      errors[field] = `Не більше ${limit} символів.`;
  }
  return errors;
}
