import { deleteProductMedia, ProductApiError } from '@admin/products/data-access';
import { useState } from 'react';

import type { ProductMedia } from '@admin/products/data-access';

export function useMediaDeletion(reload: () => void, onSuccess: (message: string) => void) {
  const [target, setTarget] = useState<ProductMedia | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function requestDelete(item: ProductMedia) {
    setTarget(item);
    setError(null);
  }

  function close() {
    if (deleting) return;
    setTarget(null);
    setError(null);
  }

  async function confirm() {
    if (!target) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteProductMedia(target.id);
      setTarget(null);
      onSuccess('Фото видалено.');
      reload();
    } catch (cause) {
      setError(
        cause instanceof ProductApiError && cause.status === 409
          ? 'Фото використовується товаром і не може бути видалене.'
          : cause instanceof Error
            ? cause.message
            : 'Не вдалося видалити фото.',
      );
    } finally {
      setDeleting(false);
    }
  }

  return { target, deleting, error, requestDelete, close, confirm };
}
