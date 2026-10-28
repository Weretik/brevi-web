export interface QuoteSummary {
  readonly publicId: string;
  readonly recipientName: string;
  readonly revision: number;
  readonly versionNumber: number;
  readonly state: 'draft' | 'ready' | 'sent';
  readonly archived: boolean;
  readonly number: string | null;
  readonly ownerId: number;
  readonly updatedAt: string;
}
