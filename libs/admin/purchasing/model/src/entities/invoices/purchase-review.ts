/** An active Brevi supplier that can be linked to a purchase invoice. */
export interface PurchaseSupplierOption {
  id: number;
  name: string;
}

/** The manual supplier link and note of a card after a save. */
export interface PurchaseInvoiceReview {
  messageId: string;
  supplierId: number | null;
  supplierName: string | null;
  reviewNote: string | null;
  reviewVersion: number;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export interface PurchaseReviewInput {
  messageId: string;
  supplierId: number | null;
  note: string | null;
  version: number;
}
