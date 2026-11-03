import { useListProductOverviewQuery } from '@admin/products/data-access';
import { useListProductSectionsQuery } from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo } from 'react';

import type { ProductOverviewType } from '@admin/products/model';

/** Rows of one «Товари» table and the «Типи і розділи» sections of the same type. */
export function useProductOverview(type: ProductOverviewType) {
  const products = useListProductOverviewQuery(type);
  const sectionsResult = useListProductSectionsQuery();
  const sections = useMemo(
    () => (sectionsResult.data ?? []).filter((section) => section.type === type),
    [sectionsResult.data, type],
  );
  const sectionNames = useMemo(
    () => new Map((sectionsResult.data ?? []).map((section) => [section.id, section.name])),
    [sectionsResult.data],
  );
  const failure = products.error ?? sectionsResult.error;

  return {
    rows: products.data ?? [],
    sections,
    sectionNames,
    loading: products.isLoading || products.isFetching || sectionsResult.isLoading,
    error: failure ? adminApiErrorMessage(failure, 'Не вдалося завантажити товари.') : null,
    reload: () => {
      void products.refetch();
      void sectionsResult.refetch();
    },
  };
}
