export const financeAttachmentTypes = ['application/pdf', 'image/jpeg', 'image/png'] as const;
export type FinanceAttachmentType = (typeof financeAttachmentTypes)[number];

/** PDF, JPEG or PNG up to 10 MiB; the server checks the first bytes too. */
export const financeAttachmentLimits = {
  maxBytes: 10 * 1024 * 1024,
  /** For `<input type="file" accept>`. */
  accept: '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png',
} as const;

/** A file of an income or expense in the private storage of «Бухгалтерія». */
export interface FinanceAttachment {
  id: string;
  transactionId: string;
  fileName: string;
  contentType: FinanceAttachmentType;
  sizeBytes: number;
  createdBy: string;
  createdAt: string;
}
