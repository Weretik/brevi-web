import {
  fractionToPercent,
  isPercentUnit,
  percentToFraction,
} from '../../mappers/pricing-parameters/pricing-parameter-format';

import type { PricingParameter } from '../../entities/pricing-parameters/pricing-parameter';
import type { PricingParameterFormValues } from '../../validators/pricing-parameters/pricing-parameter-validation';

export type PricingEditorMode = 'create' | 'view' | 'edit';

function toInput(value: number | null, unit: string): string {
  if (value === null) return '';
  return String(isPercentUnit(unit) ? fractionToPercent(value) : value);
}

export function createPricingParameterFormValues(
  parameter: PricingParameter | null,
): PricingParameterFormValues {
  return {
    code: parameter?.code ?? '',
    group: parameter?.group ?? '',
    name: parameter?.name ?? '',
    value: parameter ? toInput(parameter.value, parameter.unit) : '',
    unit: parameter?.unit ?? '',
    isCalculated: parameter?.isCalculated ?? false,
    comment: parameter?.comment ?? '',
  };
}

/** Request fields: a «%» value goes back as a fraction; a calculated parameter sends no value. */
export function pricingParameterBody(values: PricingParameterFormValues, sortOrder: number) {
  const number = Number(values.value.replace(',', '.'));
  return {
    group: values.group.trim(),
    name: values.name.trim(),
    value: values.isCalculated
      ? null
      : isPercentUnit(values.unit)
        ? percentToFraction(number)
        : number,
    unit: values.unit.trim(),
    isCalculated: values.isCalculated,
    comment: values.comment.trim() || null,
    sortOrder,
  };
}
