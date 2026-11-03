import {
  buildProductListRows,
  countProductsBySection,
  filterProductOverview,
  productArticleSkus,
  productHasPrice,
} from '@admin/products/model';
import { useCallback, useMemo, useState } from 'react';

import type {
  ProductOverview,
  ProductOverviewPrices,
  ProductSectionFilter,
} from '@admin/products/model';

interface Source {
  rows: ProductOverview[];
  prices: ReadonlyMap<number, ProductOverviewPrices>;
  fabricNames: ReadonlyMap<number, string>;
  sectionIds: readonly number[];
}

/** Search, section chip, «Без ціни» and expanded models of one «Товари» table (CAT-011). */
export function useProductListRows({ rows, prices, fabricNames, sectionIds }: Source) {
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<ProductSectionFilter>(null);
  const [withoutPrice, setWithoutPrice] = useState(false);
  const [expanded, setExpanded] = useState<ReadonlySet<number>>(new Set());

  const filtered = useMemo(
    () =>
      filterProductOverview(rows, search, section, (row) =>
        productArticleSkus(prices.get(row.id)),
      ).filter((row) => !withoutPrice || !productHasPrice(prices.get(row.id))),
    [rows, search, section, prices, withoutPrice],
  );
  const listRows = useMemo(
    () => buildProductListRows(filtered, prices, expanded, fabricNames),
    [filtered, prices, expanded, fabricNames],
  );
  const withoutPriceCount = useMemo(
    () => rows.filter((row) => !productHasPrice(prices.get(row.id))).length,
    [rows, prices],
  );
  const counts = useMemo(() => countProductsBySection(rows, sectionIds), [rows, sectionIds]);
  const toggle = useCallback(
    (productId: number) =>
      setExpanded((current) => {
        const next = new Set(current);
        if (!next.delete(productId)) next.add(productId);
        return next;
      }),
    [],
  );

  return {
    search,
    setSearch,
    section,
    setSection,
    counts,
    filteredCount: filtered.length,
    listRows,
    toggle,
    withoutPrice: {
      count: withoutPriceCount,
      selected: withoutPrice,
      onToggle: () => setWithoutPrice((value) => !value),
    },
  };
}
