import { listProductMedia } from '@admin/products/data-access';
import { useEffect, useState } from 'react';

import type { ProductMedia } from '@admin/products/data-access';

export function useMediaLibrary() {
  const [items, setItems] = useState<ProductMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void listProductMedia(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setItems(result);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'Не вдалося завантажити медіатеку.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);

  return {
    items,
    loading,
    error,
    reload: () => setRevision((current) => current + 1),
  };
}
