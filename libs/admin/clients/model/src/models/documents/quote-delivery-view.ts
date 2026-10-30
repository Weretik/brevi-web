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
}
