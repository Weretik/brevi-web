import {
  useDeleteProductionOrderFileMutation,
  useUploadProductionOrderFileMutation,
} from '@admin/production/data-access';
import { PRODUCTION_FILE_MAX_BYTES } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  ProductionFileKind,
  ProductionOrder,
  ProductionOrderFile,
} from '@admin/production/model';

/** Adds files to the order's CDN folder and deletes them after a confirmation. */
export function useProductionOrderFiles(
  order: ProductionOrder | null,
  onMessage: (message: string) => void,
) {
  const [upload, uploading] = useUploadProductionOrderFileMutation();
  const [remove, removing] = useDeleteProductionOrderFileMutation();
  const [deleting, setDeleting] = useState<ProductionOrderFile | null>(null);

  async function add(itemId: number | null, kind: ProductionFileKind, file: File) {
    if (!order) return;
    if (file.size === 0) return onMessage('Файл порожній.');
    if (file.size > PRODUCTION_FILE_MAX_BYTES) return onMessage('Файл більший за 20 МБ.');
    try {
      await upload({ id: order.id, itemId, kind, file }).unwrap();
      onMessage(`Файл «${file.name}» додано.`);
    } catch (error) {
      onMessage(adminApiErrorMessage(error, 'Не вдалося завантажити файл.'));
    }
  }

  async function confirmDelete() {
    if (!order || !deleting) return;
    try {
      await remove({ id: order.id, fileId: deleting.id }).unwrap();
      onMessage(`Файл «${deleting.name}» видалено.`);
    } catch (error) {
      onMessage(adminApiErrorMessage(error, 'Не вдалося видалити файл.'));
    } finally {
      setDeleting(null);
    }
  }

  return {
    busy: uploading.isLoading || removing.isLoading,
    uploading: uploading.isLoading,
    deleting,
    removing: removing.isLoading,
    add,
    requestDelete: setDeleting,
    cancelDelete: () => setDeleting(null),
    confirmDelete,
  };
}
