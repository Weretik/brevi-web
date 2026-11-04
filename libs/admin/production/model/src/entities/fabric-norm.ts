/** Planned fabric per item in metres; null = not used. */
export interface FabricNormValues {
  oneColor: number | null;
  twoColorsMain: number | null;
  twoColorsAdditional: number | null;
  threeColorsMain: number | null;
  threeColorsAdditional1: number | null;
  threeColorsAdditional2: number | null;
}

/** A row of «Норми витрати тканини»: a Catalog sewing model with its norm, or a norm whose model is gone. */
export interface FabricNormRow {
  modelCode: string;
  /** null when the model is no longer in «Товари». */
  modelName: string | null;
  modelIsActive: boolean;
  norm: FabricNormValues | null;
  twoColorsTotal: number | null;
  threeColorsTotal: number | null;
  updatedAt: string | null;
  /** Shown only when something is wrong. */
  problem: string | null;
}

export const fabricNormFields = [
  'oneColor',
  'twoColorsMain',
  'twoColorsAdditional',
  'threeColorsMain',
  'threeColorsAdditional1',
  'threeColorsAdditional2',
] as const satisfies readonly (keyof FabricNormValues)[];

export type FabricNormField = (typeof fabricNormFields)[number];

export const fabricNormFieldLabels: Record<FabricNormField, string> = {
  oneColor: 'Один колір',
  twoColorsMain: 'Два кольори: основна',
  twoColorsAdditional: 'Два кольори: додаткова',
  threeColorsMain: 'Три кольори: основна',
  threeColorsAdditional1: 'Три кольори: додаткова 1',
  threeColorsAdditional2: 'Три кольори: додаткова 2',
};

export const FABRIC_NORM_MAX_METERS = 100;
export const FABRIC_NORM_DECIMALS = 3;
