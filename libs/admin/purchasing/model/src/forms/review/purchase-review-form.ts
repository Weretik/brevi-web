import type { PurchaseInvoice } from '../../entities/invoices/purchase-invoice';
import type { PurchaseReviewInput } from '../../entities/invoices/purchase-review';

export const purchaseReviewNoteMaxLength = 1000;

/** «Постачальник і примітка» form of one card. */
export interface PurchaseReviewFormValues {
  supplierId: number | null;
  note: string;
}

export const purchaseReviewFormOf = (invoice: PurchaseInvoice): PurchaseReviewFormValues => ({
  supplierId: invoice.supplierId,
  note: invoice.reviewNote ?? '',
});

/** Form → request; the version is the one the user opened, so a newer change is not overwritten. */
export const purchaseReviewInputOf = (
  invoice: PurchaseInvoice,
  values: PurchaseReviewFormValues,
): PurchaseReviewInput => ({
  messageId: invoice.messageId,
  supplierId: values.supplierId,
  note: values.note.trim() || null,
  version: invoice.reviewVersion,
});
