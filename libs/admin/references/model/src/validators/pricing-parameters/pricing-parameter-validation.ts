/** Form values of a parameter; a «%» value is typed as a percent (25), not a fraction. */
export interface PricingParameterFormValues {
  code: string;
  group: string;
  name: string;
  value: string;
  unit: string;
  isCalculated: boolean;
  comment: string;
}

export type PricingParameterField = keyof PricingParameterFormValues;
export type PricingParameterFieldErrors = Partial<Record<PricingParameterField, string>>;

/** Text limits shared with BreviERP `PricingParameter`. */
export const pricingParameterTextLimits = {
  code: 64,
  group: 100,
  name: 200,
  unit: 30,
  comment: 1000,
} as const satisfies Partial<Record<PricingParameterField, number>>;

const codePattern = /^[A-Za-z][A-Za-z0-9_]*$/;

export function validatePricingParameter(
  values: PricingParameterFormValues,
): PricingParameterFieldErrors {
  const errors: PricingParameterFieldErrors = {};
  const value = Number(values.value.replace(',', '.'));
  if (!codePattern.test(values.code.trim()) || values.code.trim().length > 64)
    errors.code = 'Латинські літери, цифри та _, наприклад SALARY_SEAMSTRESS.';
  if (!values.group.trim()) errors.group = 'Вкажіть групу.';
  if (!values.name.trim()) errors.name = 'Вкажіть назву.';
  if (!values.unit.trim()) errors.unit = 'Вкажіть одиницю виміру.';
  if (!values.isCalculated && (!values.value.trim() || !Number.isFinite(value) || value < 0))
    errors.value = 'Вкажіть число, не менше 0.';
  for (const [field, limit] of Object.entries(pricingParameterTextLimits) as [
    keyof typeof pricingParameterTextLimits,
    number,
  ][]) {
    if (!errors[field] && values[field].trim().length > limit)
      errors[field] = `Не більше ${limit} символів.`;
  }
  return errors;
}
