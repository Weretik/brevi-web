import { useGetProductOverviewItemQuery } from '@admin/products/data-access';
import { useListProductSectionsQuery } from '@admin/references/data-access';
import { useMemo } from 'react';

import type { ProductOverviewType } from '@admin/products/model';

/** The «Товари» row of one product for its card (CAT-013), with the sections of its type. */
export function useProductOverviewRow(productId: number, type: ProductOverviewType) {
  const item = useGetProductOverviewItemQuery(productId);
  const sectionsResult = useListProductSectionsQuery();
  const sections = useMemo(
    () => (sectionsResult.data ?? []).filter((section) => section.type === type),
    [sectionsResult.data, type],
  );
  const sectionNames = useMemo(
    () => new Map((sectionsResult.data ?? []).map((section) => [section.id, section.name])),
    [sectionsResult.data],
  );

  return {
    row: item.data ?? null,
    sections,
    sectionNames,
    loading: item.isLoading || item.isFetching || sectionsResult.isLoading,
    reload: () => {
      void item.refetch();
      void sectionsResult.refetch();
    },
  };
}
