export interface CustomerSummary {
  readonly publicId: string;
  readonly kind: 'organization' | 'person';
  readonly displayName: string;
  readonly legalName: string | null;
  readonly taxIdentity: string | null;
  readonly ownerId: number;
  readonly active: boolean;
  readonly revision: number;
  readonly updatedAt: string;
}
