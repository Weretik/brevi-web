import { purchaseReviewNoteMaxLength } from '../../forms/review/purchase-review-form';

import type { PurchaseReviewFormValues } from '../../forms/review/purchase-review-form';

export type PurchaseReviewErrors = Partial<Record<keyof PurchaseReviewFormValues, string>>;

/** Same limit as the backend: a note of at most 1000 characters after trimming. */
export function validatePurchaseReview(values: PurchaseReviewFormValues): PurchaseReviewErrors {
  return values.note.trim().length > purchaseReviewNoteMaxLength
    ? { note: `Примітка — не більше ${purchaseReviewNoteMaxLength} символів.` }
    : {};
}
