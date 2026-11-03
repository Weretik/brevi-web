import {
  useListProductOverviewPricesQuery,
  useListProductOverviewQuery,
} from '@admin/products/data-access';
import { useListFabricsQuery, useListProductSectionsQuery } from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo } from 'react';

import type { ProductOverviewPrices, ProductOverviewType } from '@admin/products/model';

/** Rows of one «Товари» table, their prices (CAT-011) and the «Типи і розділи» sections of the type. */
export function useProductOverview(type: ProductOverviewType) {
  const products = useListProductOverviewQuery(type);
  const pricesResult = useListProductOverviewPricesQuery(type);
  const fabricsResult = useListFabricsQuery(undefined, { skip: type !== 'Sewing' });
  const sectionsResult = useListProductSectionsQuery();
  const sections = useMemo(
    () => (sectionsResult.data ?? []).filter((section) => section.type === type),
    [sectionsResult.data, type],
  );
  const sectionNames = useMemo(
    () => new Map((sectionsResult.data ?? []).map((section) => [section.id, section.name])),
    [sectionsResult.data],
  );
  const prices = useMemo(
    () =>
      new Map<number, ProductOverviewPrices>(
        (pricesResult.data ?? []).map((row) => [row.productId, row]),
      ),
    [pricesResult.data],
  );
  const fabricNames = useMemo(
    () => new Map((fabricsResult.data ?? []).map((fabric) => [fabric.id, fabric.name])),
    [fabricsResult.data],
  );
  const failure = products.error ?? sectionsResult.error;

  return {
    rows: products.data ?? [],
    prices,
    fabricNames,
    pricesLoading: pricesResult.isLoading || pricesResult.isFetching,
    pricesError: pricesResult.error
      ? adminApiErrorMessage(pricesResult.error, 'Не вдалося завантажити ціни.')
      : null,
    sections,
    sectionNames,
    loading: products.isLoading || products.isFetching || sectionsResult.isLoading,
    error: failure ? adminApiErrorMessage(failure, 'Не вдалося завантажити товари.') : null,
    reload: () => {
      void products.refetch();
      void pricesResult.refetch();
      void sectionsResult.refetch();
    },
  };
}
