import { useDeleteProductMediaMutation } from '@admin/products/data-access';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ProductMedia } from '@admin/products/model';

export function useMediaDeletion(onSuccess: (message: string) => void) {
  const [target, setTarget] = useState<ProductMedia | null>(null);
  const [deleteProductMedia, deleteState] = useDeleteProductMediaMutation();
  const [error, setError] = useState<string | null>(null);

  function requestDelete(item: ProductMedia) {
    setTarget(item);
    setError(null);
  }

  function close() {
    if (deleteState.isLoading) return;
    setTarget(null);
    setError(null);
  }

  async function confirm() {
    if (!target) return;
    setError(null);
    try {
      await deleteProductMedia(target.id).unwrap();
      setTarget(null);
      onSuccess('Фото видалено.');
    } catch (cause) {
      setError(
        isAdminApiError(cause) && cause.status === 409
          ? 'Фото використовується товаром і не може бути видалене.'
          : adminApiErrorMessage(cause, 'Не вдалося видалити фото.'),
      );
    }
  }

  return {
    target,
    deleting: deleteState.isLoading,
    error,
    requestDelete,
    close,
    confirm,
  };
}
