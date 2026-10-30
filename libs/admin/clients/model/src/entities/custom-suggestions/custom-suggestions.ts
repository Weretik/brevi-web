export const suggestionProductTypes = [
  'Напівкомбінезон',
  'Комбінезон',
  'Куртка',
  'Штани',
  'Жилет',
  'Костюм',
] as const;
export type CustomSuggestionProductType = (typeof suggestionProductTypes)[number];
export interface CustomSuggestionNorm {
  readonly kind: 'accessory' | 'operation';
  readonly referenceId: number;
  readonly unit: string;
  readonly manualMinutes: number | null;
  readonly sampleSize: number;
  readonly minimumQuantity: number;
  readonly maximumQuantity: number;
  readonly varyingNorm: boolean;
  readonly quantity: number;
}
export interface CustomSuggestions {
  readonly productType: CustomSuggestionProductType;
  readonly season: 'summer' | 'winter';
  readonly sampleSize: number;
  readonly norms: readonly CustomSuggestionNorm[];
  readonly sourceLimitReached: boolean;
}
