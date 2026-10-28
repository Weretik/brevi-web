export interface QuoteBasisComparison {
  readonly selectionMatches: boolean;
  readonly sourceChanged: boolean | null;
  readonly blocked: boolean;
  readonly prices: readonly {
    readonly tier: 'retail' | 'wholesale' | 'largeWholesale';
    readonly before: number | null;
    readonly after: number | null;
    readonly changed: boolean;
  }[];
}
