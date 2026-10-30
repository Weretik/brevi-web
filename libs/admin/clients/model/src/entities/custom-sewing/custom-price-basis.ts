export interface CustomPriceBasis {
  readonly token: string;
  readonly calculatedAt: string;
  readonly expiresAt: number;
  readonly formulaVersion: string;
  readonly internalCost: number | null;
  readonly retail: number | null;
  readonly wholesale: number | null;
  readonly largeWholesale: number | null;
  readonly blockers: readonly string[];
  readonly isCalculated: boolean;
}
