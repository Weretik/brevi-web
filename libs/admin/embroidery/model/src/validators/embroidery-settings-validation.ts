import type {
  EmbroideryExpenseDraft,
  EmbroideryHoopDraft,
  EmbroiderySettingsDraft,
  EmbroiderySettingsSectionId,
} from '../forms/embroidery-settings-form';

export const embroiderySettingsLimits = {
  maxAmount: 1_000_000,
  nameMaxLength: 120,
  minHoops: 1,
  maxHoops: 30,
  maxExpenses: 100,
} as const;

/** Field problems by path: `rates.threadRate`, `markups.0.name`, `hoops.<id>.label`, `hoops` (the list). */
export type EmbroiderySettingsErrors = Readonly<Record<string, string>>;

const { maxAmount, nameMaxLength } = embroiderySettingsLimits;
const amount = (value: number | null) => value !== null && value >= 0 && value <= maxAmount;
const positive = (value: number | null) => value !== null && value > 0 && value <= maxAmount;
const amountError = `Число від 0 до ${maxAmount.toLocaleString('uk-UA')}.`;

function nameError(name: string, empty: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return empty;
  return trimmed.length > nameMaxLength ? `Не довше ${nameMaxLength} символів.` : null;
}

/** One hoop in its side panel; `others` are the other hoops, for a repeated name. */
export function validateEmbroideryHoop(
  hoop: EmbroideryHoopDraft,
  others: readonly EmbroideryHoopDraft[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  const label = nameError(hoop.label, 'Вкажіть назву п’ялець.');
  if (label) errors['label'] = label;
  else if (others.some((other) => other.label.trim() === hoop.label.trim()))
    errors['label'] = 'Такі п’яльця вже є.';
  if (!positive(hoop.blankWidthCm)) errors['blankWidthCm'] = 'Більше нуля.';
  if (!positive(hoop.blankLengthCm)) errors['blankLengthCm'] = 'Більше нуля.';
  if (hoop.glueRate !== null && !amount(hoop.glueRate)) errors['glueRate'] = amountError;
  return errors;
}

/** One extra cost in its side panel. An empty rate is allowed: it means «not set yet». */
export function validateEmbroideryExpense(expense: EmbroideryExpenseDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = nameError(expense.name, 'Вкажіть назву статті.');
  if (name) errors['name'] = name;
  if (expense.rate !== null && !amount(expense.rate)) errors['rate'] = amountError;
  return errors;
}

/** Every problem of the page; the server checks the same rules. */
export function validateEmbroiderySettings(
  draft: EmbroiderySettingsDraft,
): EmbroiderySettingsErrors {
  const errors: Record<string, string> = {};
  for (const [key, value] of Object.entries(draft.rates))
    if (!amount(value)) errors[`rates.${key}`] = amountError;
  draft.markups.forEach((markup, index) => {
    const name = nameError(markup.name, 'Вкажіть назву.');
    if (name) errors[`markups.${index}.name`] = name;
    if (!amount(markup.percent)) errors[`markups.${index}.percent`] = amountError;
  });
  for (const material of ['stabilizer', 'fabric'] as const) {
    if (!amount(draft[material].pricePerMetre)) errors[`${material}.pricePerMetre`] = amountError;
    if (!positive(draft[material].widthCm)) errors[`${material}.widthCm`] = 'Більше нуля.';
  }
  if (!amount(draft.fabricIncreasePercent)) errors['fabricIncreasePercent'] = amountError;

  const { minHoops, maxHoops, maxExpenses } = embroiderySettingsLimits;
  if (draft.hoops.length < minHoops || draft.hoops.length > maxHoops)
    errors['hoops'] = `Потрібно від ${minHoops} до ${maxHoops} п’ялець.`;
  draft.hoops.forEach((hoop) => {
    const others = draft.hoops.filter((other) => other.id !== hoop.id);
    for (const [field, message] of Object.entries(validateEmbroideryHoop(hoop, others)))
      errors[`hoops.${hoop.id}.${field}`] = message;
  });
  if (draft.expenses.length > maxExpenses) errors['expenses'] = `Не більше ${maxExpenses} статей.`;
  draft.expenses.forEach((expense) => {
    for (const [field, message] of Object.entries(validateEmbroideryExpense(expense)))
      errors[`expenses.${expense.id}.${field}`] = message;
  });
  return errors;
}

const sectionOf = (path: string): EmbroiderySettingsSectionId => {
  const head = path.split('.')[0];
  if (head === 'rates' || head === 'markups' || head === 'hoops' || head === 'expenses')
    return head;
  return 'materials';
};

/** How many problems each section has. */
export function embroiderySettingsErrorCounts(
  errors: EmbroiderySettingsErrors,
): Partial<Record<EmbroiderySettingsSectionId, number>> {
  const counts: Partial<Record<EmbroiderySettingsSectionId, number>> = {};
  for (const path of Object.keys(errors)) {
    const id = sectionOf(path);
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}
