export interface ProductionPackageView {
  readonly id: string;
  readonly quoteId: string;
  readonly versionId: string;
  readonly sha256: string;
  readonly bytes: number;
  readonly createdAt: string;
}
