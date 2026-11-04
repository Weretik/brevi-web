import { useUpdatePriceSourceMutation } from '@admin/references/data-access';
import { parsePriceSourceDiscount, validatePriceSourceDiscount } from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type { PriceSource } from '@admin/references/model';

/** «Змінити знижку» in the side panel: validates 0–90% and saves it with the current supplier. */
export function usePriceSourceDiscount(source: PriceSource, onSaved: () => void) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(() => String(source.discountPercent).replace('.', ','));
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [update, state] = useUpdatePriceSourceMutation();

  async function save() {
    if (state.isLoading) return;
    const validation = validatePriceSourceDiscount(value);
    setError(validation);
    if (validation) return;
    setMessage(null);
    try {
      await update({
        key: source.key,
        body: { discountPercent: parsePriceSourceDiscount(value), supplierId: source.supplierId },
      }).unwrap();
      setEditing(false);
      onSaved();
    } catch (failure) {
      if (isAdminApiError(failure)) setError(Object.values(failure.fieldErrors)[0] ?? null);
      setMessage(adminApiErrorMessage(failure, 'Не вдалося зберегти знижку.'));
    }
  }

  return {
    editing,
    value,
    error,
    message,
    saving: state.isLoading,
    start: () => setEditing(true),
    change: (next: string) => {
      setValue(next);
      setError(null);
    },
    save,
  };
}
