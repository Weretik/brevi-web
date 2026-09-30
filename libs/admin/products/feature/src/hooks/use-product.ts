import { getProduct, ProductApiError } from '@admin/products/data-access';
import { useEffect, useState } from 'react';

import type { ProductDetail } from '@admin/products/data-access';

export function useProduct(id: number, initial?: ProductDetail) {
  const [product, setProduct] = useState<ProductDetail | null>(initial ?? null);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (initial?.id === id && revision === 0) return;
    if (!Number.isInteger(id) || id < 1) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setNotFound(false);
    setProduct(null);
    getProduct(id, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setProduct(result);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        if (cause instanceof ProductApiError && cause.status === 404) setNotFound(true);
        else setError(cause instanceof Error ? cause.message : 'Не вдалося завантажити товар.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id, initial, revision]);
  return { product, loading, error, notFound, reload: () => setRevision((value) => value + 1) };
}
