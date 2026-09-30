import { listProducts, ProductApiError } from '@admin/products/data-access';
import { useEffect, useState } from 'react';

import type { ProductPage, ProductQuery } from '@admin/products/data-access';

export function useProducts(query: ProductQuery) {
  const [page, setPage] = useState<ProductPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const { page: pageNumber, pageSize, search, type, categoryId, sortBy, sortDirection } = query;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    listProducts(
      { page: pageNumber, pageSize, search, type, categoryId, sortBy, sortDirection },
      controller.signal,
    )
      .then((result) => {
        if (!controller.signal.aborted) setPage(result);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          cause instanceof ProductApiError || cause instanceof Error
            ? cause.message
            : 'Не вдалося завантажити товари.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [pageNumber, pageSize, search, type, categoryId, sortBy, sortDirection, revision]);

  return { page, loading, error, reload: () => setRevision((value) => value + 1) };
}
