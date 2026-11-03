import { useCreateCatalogProductMutation } from '@admin/products/data-access';
import { ppeCreateBody, ppeCreateServerErrors } from '@admin/products/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { PpeCreateFieldErrors, PpeCreateFormValues } from '@admin/products/model';

/** Router state of the PPE card after «Створити ЗІЗ» saved the product but not its first price. */
export interface PpeCreatedState {
  ppePriceNotSaved: true;
}

/**
 * Sends «Створити ЗІЗ» and opens the new PPE card. Server field errors go back to the form; a
 * taken code or name (409) and other failures come back as one message.
 */
export function usePpeCreateSubmit(onFieldErrors: (errors: PpeCreateFieldErrors) => void) {
  const [create, state] = useCreateCatalogProductMutation();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);

  return {
    saving: state.isLoading,
    message,
    async submit(values: PpeCreateFormValues) {
      setMessage(null);
      const result = await create(ppeCreateBody(values));
      if (result.data) {
        const created: PpeCreatedState | null = result.data.priceSaved
          ? null
          : { ppePriceNotSaved: true };
        navigate(`/references/products/${result.data.id}`, { state: created });
        return;
      }
      const error = result.error;
      const fields = isAdminApiError(error) ? ppeCreateServerErrors(error.fieldErrors) : {};
      onFieldErrors(fields);
      if (Object.keys(fields).length === 0 || (isAdminApiError(error) && error.status === 409))
        setMessage(adminApiErrorMessage(error, 'Не вдалося створити ЗІЗ. Спробуйте ще раз.'));
    },
  };
}
