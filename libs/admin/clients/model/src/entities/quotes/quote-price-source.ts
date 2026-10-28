export interface QuotePriceSource {
  readonly sourceId: string;
  readonly calculationId: string | null;
  readonly ruleVersionId: string | null;
  readonly compositionVersion: number | null;
  readonly settingsVersionId: number | null;
  readonly referenceVersionIds: readonly number[];
  readonly formulaVersion: string;
}
