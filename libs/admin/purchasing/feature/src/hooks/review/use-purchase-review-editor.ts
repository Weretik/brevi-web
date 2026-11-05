import {
  useGetPurchaseSuppliersQuery,
  useReviewPurchaseInvoiceMutation,
} from '@admin/purchasing/data-access';
import {
  purchaseReviewFormOf,
  purchaseReviewInputOf,
  validatePurchaseReview,
} from '@admin/purchasing/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  PurchaseInvoice,
  PurchaseInvoiceReview,
  PurchaseReviewErrors,
  PurchaseReviewFormValues,
} from '@admin/purchasing/model';

/**
 * Side panel of one card: view first, «Редагувати» opens the supplier and note form. The save sends
 * the version the user opened; a newer change by someone else comes back as an error to reopen.
 */
export function usePurchaseReviewEditor(
  invoice: PurchaseInvoice,
  onSaved: (review: PurchaseInvoiceReview) => void,
) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [values, setValues] = useState<PurchaseReviewFormValues>(() =>
    purchaseReviewFormOf(invoice),
  );
  const [errors, setErrors] = useState<PurchaseReviewErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const suppliers = useGetPurchaseSuppliersQuery(undefined, { skip: mode === 'view' });
  const [review, state] = useReviewPurchaseInvoiceMutation();

  async function save() {
    if (state.isLoading) return;
    const found = validatePurchaseReview(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setMessage(null);
    try {
      onSaved(await review(purchaseReviewInputOf(invoice, values)).unwrap());
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти постачальника і примітку.'));
    }
  }

  return {
    mode,
    enableEditing: () => setMode('edit'),
    values,
    errors,
    change: (next: PurchaseReviewFormValues) => {
      setValues(next);
      if (Object.keys(errors).length > 0) setErrors(validatePurchaseReview(next));
    },
    message,
    suppliers: suppliers.currentData ?? [],
    suppliersLoading: suppliers.isFetching,
    suppliersError: suppliers.error
      ? adminApiErrorMessage(suppliers.error, 'Не вдалося завантажити постачальників.')
      : null,
    saving: state.isLoading,
    save,
  };
}
