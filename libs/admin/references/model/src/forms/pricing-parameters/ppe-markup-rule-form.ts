import {
  fractionToPercent,
  percentToFraction,
} from '../../mappers/pricing-parameters/pricing-parameter-format';

import type { PpeMarkupRule } from '../../entities/pricing-parameters/pricing-parameter';
import type { PpeMarkupRuleFormValues } from '../../validators/pricing-parameters/ppe-markup-rule-validation';

export function createPpeMarkupRuleFormValues(rule: PpeMarkupRule | null): PpeMarkupRuleFormValues {
  const percent = (value: number | undefined) =>
    value === undefined ? '' : String(fractionToPercent(value));
  return {
    name: rule?.name ?? '',
    retailMarkup: percent(rule?.retailMarkup),
    wholesaleMarkup: percent(rule?.wholesaleMarkup),
    largeWholesaleMarkup: percent(rule?.largeWholesaleMarkup),
    priceNote: rule?.priceNote ?? '',
    appliesTo: rule?.appliesTo ?? '',
  };
}

/** Request fields: percents go back as fractions. */
export function ppeMarkupRuleBody(values: PpeMarkupRuleFormValues, sortOrder: number) {
  const fraction = (value: string) => percentToFraction(Number(value.replace(',', '.')));
  return {
    retailMarkup: fraction(values.retailMarkup),
    wholesaleMarkup: fraction(values.wholesaleMarkup),
    largeWholesaleMarkup: fraction(values.largeWholesaleMarkup),
    priceNote: values.priceNote.trim() || null,
    appliesTo: values.appliesTo.trim() || null,
    sortOrder,
  };
}
