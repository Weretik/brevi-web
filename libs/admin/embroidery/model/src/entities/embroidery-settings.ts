import type { EmbroideryExpenseBasis, EmbroideryExpenseMode } from './embroidery-codes';

export interface EmbroideryRates {
  threadRate: number;
  hoopingRate: number;
  programHourRate: number;
  taxPercent: number;
}

export interface EmbroideryMarkup {
  name: string;
  percent: number;
}

export interface EmbroideryMaterial {
  pricePerMetre: number;
  widthCm: number;
}

export interface EmbroideryHoop {
  id: string;
  label: string;
  blankWidthCm: number;
  blankLengthCm: number;
  /** Null uses the general «Клей» rate. */
  glueRate: number | null;
}

export interface EmbroideryExpense {
  id: string;
  name: string;
  basis: EmbroideryExpenseBasis;
  /** Null = not set yet; 0 = free. */
  rate: number | null;
  enabled: boolean;
  mode: EmbroideryExpenseMode;
}

/** The editable part of «Налаштування»; the whole page is saved at once. */
export interface EmbroiderySettingsContent {
  rates: EmbroideryRates;
  markups: readonly EmbroideryMarkup[];
  stabilizer: EmbroideryMaterial;
  fabric: EmbroideryMaterial;
  fabricIncreasePercent: number;
  hoops: readonly EmbroideryHoop[];
  expenses: readonly EmbroideryExpense[];
}

export interface EmbroiderySettings extends EmbroiderySettingsContent {
  /** 0 before the first save: the page shows the old site's rates. */
  version: number;
  updatedByName: string | null;
  updatedAt: string | null;
  /** Read-only here; edited in «Параметри ціноутворення». */
  stitchRate: { value: number | null; updatedOn: string | null };
}

/** The glue cost uses the hoop's own rate when it is set. */
export const embroideryGlueExpenseId = 'glue';
