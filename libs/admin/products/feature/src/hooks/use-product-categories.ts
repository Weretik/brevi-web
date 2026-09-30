import { listProductCategories, ProductApiError } from '@admin/products/data-access';
import { useEffect, useState } from 'react';

import type { ProductCategory } from '@admin/products/data-access';

export function useProductCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    listProductCategories(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setCategories(result);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        if (cause instanceof ProductApiError && cause.status === 404) {
          setCategories([]);
          return;
        }
        setError(cause instanceof Error ? cause.message : 'Не вдалося завантажити категорії.');
      });
    return () => controller.abort();
  }, [revision]);

  return { categories, error, reload: () => setRevision((value) => value + 1) };
}
