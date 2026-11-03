import { useUpdatePpeSupplierOfferMutation } from '@admin/products/data-access';
import {
  createPpeSupplierOfferFormValues,
  ppeSupplierOfferBody,
  validatePpeSupplierOffer,
} from '@admin/products/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  PpeSupplierOffer,
  PpeSupplierOfferField,
  PpeSupplierOfferFieldErrors,
  PpeSupplierOfferFormValues,
} from '@admin/products/model';

/** Edit state of the PPE supplier fields; a newer saved card replaces an untouched form. */
export function usePpeSupplierForm(offer: PpeSupplierOffer | null) {
  const [baseline, setBaseline] = useState<PpeSupplierOffer | null>(null);
  const [values, setValues] = useState<PpeSupplierOfferFormValues | null>(null);
  const [errors, setErrors] = useState<PpeSupplierOfferFieldErrors>({});
  const [save, state] = useUpdatePpeSupplierOfferMutation();

  const initial = offer ? createPpeSupplierOfferFormValues(offer) : null;
  const dirty =
    values !== null && initial !== null && JSON.stringify(values) !== JSON.stringify(initial);
  // An untouched form follows the latest card; an edited one keeps the user's values.
  if (offer && offer !== baseline && !dirty) {
    setBaseline(offer);
    setValues(createPpeSupplierOfferFormValues(offer));
  }

  return {
    values: values ?? initial,
    errors,
    dirty,
    saving: state.isLoading,
    saveError: state.error
      ? adminApiErrorMessage(state.error, 'Не вдалося зберегти дані постачальника.')
      : null,
    change<Field extends PpeSupplierOfferField>(
      field: Field,
      value: PpeSupplierOfferFormValues[Field],
    ) {
      setValues((current) => (current ? { ...current, [field]: value } : current));
      setErrors((current) => ({ ...current, [field]: undefined }));
    },
    reset() {
      if (offer) setValues(createPpeSupplierOfferFormValues(offer));
      setErrors({});
      state.reset();
    },
    async submit() {
      if (!offer || !values) return;
      const found = validatePpeSupplierOffer(values);
      setErrors(found);
      if (Object.keys(found).length > 0) return;
      const result = await save({
        productId: offer.productId,
        body: ppeSupplierOfferBody(values, offer),
      });
      if ('data' in result && result.data) {
        setBaseline(result.data);
        setValues(createPpeSupplierOfferFormValues(result.data));
      }
    },
  };
}
