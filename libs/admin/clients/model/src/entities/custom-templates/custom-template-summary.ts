export interface CustomTemplateSummary {
  readonly id: string;
  readonly ownerId: number;
  readonly revision: number;
  readonly archived: boolean;
  readonly versionNumber: number;
  readonly name: string;
  readonly productType: string;
  readonly season: 'summer' | 'winter';
  readonly updatedAt: string;
}
