export interface FinanceCounterpartyFormValues {
  name: string;
  edrpou: string;
  iban: string;
  bankName: string;
  /** Other names, one per line. */
  aliases: string;
  /** Root of the default category; empty — none. */
  rootId: string;
  /** Empty when no subcategory is picked. */
  subcategoryId: string;
  autoApplyCategory: boolean;
  note: string;
}

export type FinanceCounterpartyField = keyof FinanceCounterpartyFormValues;
export type FinanceCounterpartyFieldErrors = Partial<Record<FinanceCounterpartyField, string>>;

/** Limits shared with BreviERP `FinanceCounterpartyDetails`. */
export const financeCounterpartyLimits = {
  name: 250,
  edrpou: 32,
  iban: 64,
  bankName: 250,
  alias: 250,
  aliases: 20,
  note: 600,
} as const;

/** One alias per non-empty line. */
export const counterpartyAliasLines = (text: string): string[] =>
  text
    .split(/[\n;]/)
    .map((line) => line.trim())
    .filter(Boolean);

export function validateFinanceCounterparty(
  values: FinanceCounterpartyFormValues,
  verified: boolean,
): FinanceCounterpartyFieldErrors {
  const errors: FinanceCounterpartyFieldErrors = {};
  const limits = financeCounterpartyLimits;
  const name = values.name.trim();
  if (!name) errors.name = 'Вкажіть назву контрагента.';
  else if (name.length > limits.name) errors.name = `Не більше ${limits.name} символів.`;
  const edrpou = values.edrpou.replace(/\s/g, '');
  if (!/^\d*$/.test(edrpou) || edrpou.length > limits.edrpou)
    errors.edrpou = `Лише цифри, не більше ${limits.edrpou}.`;
  if (values.iban.replace(/[^\p{L}\p{N}]/gu, '').length > limits.iban)
    errors.iban = `Не більше ${limits.iban} символів.`;
  if (values.bankName.trim().length > limits.bankName)
    errors.bankName = `Не більше ${limits.bankName} символів.`;
  const aliases = counterpartyAliasLines(values.aliases);
  if (aliases.length > limits.aliases || aliases.some((alias) => alias.length > limits.alias))
    errors.aliases = `Не більше ${limits.aliases} назв, кожна до ${limits.alias} символів.`;
  if (values.note.trim().length > limits.note) errors.note = `Не більше ${limits.note} символів.`;
  if (values.autoApplyCategory && (!values.rootId || !verified))
    errors.autoApplyCategory = 'Лише для підтвердженого контрагента з категорією.';
  return errors;
}
