import {
  useDeleteContentProductMutation,
  useGetContentProductQuery,
  useSaveContentProductMutation,
} from '@admin/content/data-access';
import {
  contentProductFormOf,
  contentProductInputOf,
  hasContentProductErrors,
  validateContentProduct,
} from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ContentProductErrors, ContentProductFormValues } from '@admin/content/model';

/**
 * Side panel of one product: view first, «Редагувати» opens the form. The save sends the revision
 * the user opened; a newer change by someone else comes back as an error to reopen.
 */
export function useContentProductEditor(
  productId: number,
  /** False when the tree of «Розділи сайту» is not available: the save then keeps the categories. */
  categoriesKnown: boolean,
  onDone: (text: string) => void,
) {
  const query = useGetContentProductQuery(productId);
  const product = query.currentData ?? null;
  const [values, setValues] = useState<ContentProductFormValues | null>(null);
  const [errors, setErrors] = useState<ContentProductErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [save, saveState] = useSaveContentProductMutation();
  const [remove, removeState] = useDeleteContentProductMutation();

  async function submit() {
    if (!product || !values || saveState.isLoading) return;
    const found = validateContentProduct(values);
    setErrors(found);
    if (hasContentProductErrors(found)) return;
    setMessage(null);
    try {
      const saved = await save(contentProductInputOf(product, values)).unwrap();
      onDone(
        saved.product.onSite
          ? `Збережено: «${saved.product.name}» показується на сайті.`
          : `Збережено: «${saved.product.name}».`,
      );
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти сторінку товару.'));
    }
  }

  async function confirmDelete() {
    if (!product || removeState.isLoading) return;
    setMessage(null);
    try {
      await remove(productId).unwrap();
      onDone(`Сторінку товару «${product.product.name}» видалено.`);
    } catch (error) {
      setConfirmingDelete(false);
      setMessage(adminApiErrorMessage(error, 'Не вдалося видалити сторінку товару.'));
    }
  }

  return {
    product,
    loading: query.isLoading,
    loadError: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося завантажити сторінку товару.')
      : null,
    mode: values ? ('edit' as const) : ('view' as const),
    enableEditing: () => {
      if (!product) return;
      const form = contentProductFormOf(product);
      setValues(categoriesKnown ? form : { ...form, categoryIds: null });
    },
    values,
    errors,
    change: (next: ContentProductFormValues) => {
      setValues(next);
      if (hasContentProductErrors(errors)) setErrors(validateContentProduct(next));
    },
    message,
    saving: saveState.isLoading,
    submit,
    confirmingDelete,
    askDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    deleting: removeState.isLoading,
    confirmDelete,
  };
}
