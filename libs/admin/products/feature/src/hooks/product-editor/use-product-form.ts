import { useCreateProductMutation, useReplaceProductMutation } from '@admin/products/data-access';
import { changeProductType, emptyProductDraft, validateProductDraft } from '@admin/products/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ProductDraft } from '@admin/products/model';

interface Options {
  initial?: ProductDraft;
  /** Absent for a new product, which takes the typed id. */
  productId?: number;
}

/**
 * The product form: the draft, a type change waiting for confirmation, and saving. The form checks the fields for a
 * quick hint; the server's field errors replace them when it refuses the save.
 */
export function useProductForm({ initial, productId }: Options) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ProductDraft>(() => initial ?? emptyProductDraft());
  const [newId, setNewId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<ProductDraft['type'] | null>(null);
  const [createProduct, createState] = useCreateProductMutation();
  const [replaceProduct, replaceState] = useReplaceProductMutation();
  const savingRef = useRef(false);

  /** `percentReferenceIds`: references measured in % (their values are checked as shares). */
  async function save(percentReferenceIds: readonly number[]) {
    if (savingRef.current) return;
    const id = productId ?? Number(newId);
    const nextErrors = validateProductDraft(draft, productId === undefined ? id : undefined, [
      ...percentReferenceIds,
    ]);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setMessage('Перевірте позначені поля.');
      return;
    }
    savingRef.current = true;
    setMessage(null);
    try {
      const saved =
        productId === undefined
          ? await createProduct({ id, draft }).unwrap()
          : await replaceProduct({ id, draft }).unwrap();
      navigate(`/references/products/${saved.id}`, { state: { product: saved } });
    } catch (cause) {
      if (isAdminApiError(cause)) setErrors(cause.fieldErrors);
      setMessage(adminApiErrorMessage(cause, 'Не вдалося зберегти товар.'));
    } finally {
      savingRef.current = false;
    }
  }

  return {
    draft,
    setDraft,
    newId,
    setNewId,
    errors,
    message,
    setMessage,
    saving: createState.isLoading || replaceState.isLoading,
    save,
    pendingType,
    requestType: (type: ProductDraft['type']) => setPendingType(type === draft.type ? null : type),
    confirmType: () => {
      if (pendingType) setDraft((current) => changeProductType(current, pendingType));
      setPendingType(null);
    },
    cancelType: () => setPendingType(null),
  };
}
