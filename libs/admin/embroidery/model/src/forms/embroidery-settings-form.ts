import type { EmbroideryExpenseBasis, EmbroideryExpenseMode } from '../entities/embroidery-codes';
import type {
  EmbroiderySettings,
  EmbroiderySettingsContent,
} from '../entities/embroidery-settings';

export interface EmbroideryHoopDraft {
  id: string;
  label: string;
  blankWidthCm: number | null;
  blankLengthCm: number | null;
  /** Null uses the general «Клей» rate. */
  glueRate: number | null;
}

export interface EmbroideryExpenseDraft {
  id: string;
  name: string;
  basis: EmbroideryExpenseBasis;
  /** Null = not set yet: the prices become «Орієнтовна» while it is ticked. */
  rate: number | null;
  enabled: boolean;
  mode: EmbroideryExpenseMode;
}

/** «Налаштування» as typed; an empty required number is null and fails validation. */
export interface EmbroiderySettingsDraft {
  version: number;
  rates: {
    threadRate: number | null;
    hoopingRate: number | null;
    programHourRate: number | null;
    taxPercent: number | null;
  };
  markups: readonly { name: string; percent: number | null }[];
  stabilizer: { pricePerMetre: number | null; widthCm: number | null };
  fabric: { pricePerMetre: number | null; widthCm: number | null };
  fabricIncreasePercent: number | null;
  hoops: readonly EmbroideryHoopDraft[];
  expenses: readonly EmbroideryExpenseDraft[];
}

export type EmbroiderySettingsSectionId = 'rates' | 'markups' | 'materials' | 'hoops' | 'expenses';

export const embroiderySettingsSections: readonly {
  id: EmbroiderySettingsSectionId;
  title: string;
}[] = [
  { id: 'rates', title: 'Ставки' },
  { id: 'markups', title: 'Націнки' },
  { id: 'materials', title: 'Матеріали' },
  { id: 'hoops', title: 'П’яльця' },
  { id: 'expenses', title: 'Додаткові витрати' },
];

export function embroiderySettingsToDraft(settings: EmbroiderySettings): EmbroiderySettingsDraft {
  return {
    version: settings.version,
    rates: { ...settings.rates },
    markups: settings.markups.map((markup) => ({ ...markup })),
    stabilizer: { ...settings.stabilizer },
    fabric: { ...settings.fabric },
    fabricIncreasePercent: settings.fabricIncreasePercent,
    hoops: settings.hoops.map((hoop) => ({ ...hoop })),
    expenses: settings.expenses.map((expense) => ({ ...expense })),
  };
}

const required = (value: number | null): number => {
  if (value === null) throw Error('Validate the settings before saving them.');
  return value;
};

/** Call only after `validateEmbroiderySettings` found nothing. Names are trimmed. */
export function embroideryDraftToContent(
  draft: EmbroiderySettingsDraft,
): EmbroiderySettingsContent {
  return {
    rates: {
      threadRate: required(draft.rates.threadRate),
      hoopingRate: required(draft.rates.hoopingRate),
      programHourRate: required(draft.rates.programHourRate),
      taxPercent: required(draft.rates.taxPercent),
    },
    markups: draft.markups.map((markup) => ({
      name: markup.name.trim(),
      percent: required(markup.percent),
    })),
    stabilizer: {
      pricePerMetre: required(draft.stabilizer.pricePerMetre),
      widthCm: required(draft.stabilizer.widthCm),
    },
    fabric: {
      pricePerMetre: required(draft.fabric.pricePerMetre),
      widthCm: required(draft.fabric.widthCm),
    },
    fabricIncreasePercent: required(draft.fabricIncreasePercent),
    hoops: draft.hoops.map((hoop) => ({
      id: hoop.id,
      label: hoop.label.trim(),
      blankWidthCm: required(hoop.blankWidthCm),
      blankLengthCm: required(hoop.blankLengthCm),
      glueRate: hoop.glueRate,
    })),
    expenses: draft.expenses.map((expense) => ({ ...expense, name: expense.name.trim() })),
  };
}

const sectionValue = (draft: EmbroiderySettingsDraft, id: EmbroiderySettingsSectionId) =>
  JSON.stringify(
    id === 'materials' ? [draft.stabilizer, draft.fabric, draft.fabricIncreasePercent] : draft[id],
  );

/** Sections that differ from the saved copy, in page order. */
export function embroiderySettingsChangedSections(
  saved: EmbroiderySettingsDraft,
  draft: EmbroiderySettingsDraft,
): EmbroiderySettingsSectionId[] {
  return embroiderySettingsSections
    .map((section) => section.id)
    .filter((id) => sectionValue(saved, id) !== sectionValue(draft, id));
}

/** A code that no other row uses: `<prefix>-1`, `<prefix>-2`… */
export function nextEmbroideryRowId(prefix: string, taken: readonly { id: string }[]): string {
  const ids = new Set(taken.map((row) => row.id));
  let number = 1;
  while (ids.has(`${prefix}-${number}`)) number += 1;
  return `${prefix}-${number}`;
}

export const emptyEmbroideryHoop = (taken: readonly { id: string }[]): EmbroideryHoopDraft => ({
  id: nextEmbroideryRowId('hoop', taken),
  label: '',
  blankWidthCm: null,
  blankLengthCm: null,
  glueRate: null,
});

export const emptyEmbroideryExpense = (
  taken: readonly { id: string }[],
): EmbroideryExpenseDraft => ({
  id: nextEmbroideryRowId('cost', taken),
  name: '',
  basis: 'Unit',
  rate: null,
  enabled: true,
  mode: 'All',
});
