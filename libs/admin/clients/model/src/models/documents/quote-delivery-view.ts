export interface QuoteDeliveryView {
  readonly id: string;
  readonly quoteId: string;
  readonly versionId: string;
  readonly pdfId: string;
  readonly templateId: string;
  readonly recipient: string;
  readonly state: 'queued' | 'sending' | 'reconciling' | 'unknown' | 'succeeded' | 'failed';
  readonly attempt: number;
  readonly error: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly confirmedAt: string | null;
  readonly canResolveManually?: boolean;
  readonly manualResolution?: QuoteDeliveryManualResolutionView | null;
}

export interface QuoteDeliveryManualResolutionView {
  readonly outcome: 'sent' | 'not_sent';
  readonly actorId: number;
  readonly attempt: number;
  readonly evidenceNote: string;
  readonly createdAt: string;
}
