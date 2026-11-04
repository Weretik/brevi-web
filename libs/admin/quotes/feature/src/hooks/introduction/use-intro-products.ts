import { useGetQuoteCatalogProductsQuery } from '@admin/quotes/data-access';
import { introProductIds } from '@admin/quotes/model';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  QuoteCatalogProduct,
  QuoteIntroDraft,
  QuoteIntroductionSetup,
} from '@admin/quotes/model';

/**
 * Catalog data (fabrics, prices) of every model on the pages: the main models from the setup, models picked in the
 * panel or a template, and the rest loaded by id.
 */
export function useIntroProducts(
  setup: QuoteIntroductionSetup | undefined,
  draft: QuoteIntroDraft | null,
) {
  const [known, setKnown] = useState<ReadonlyMap<number, QuoteCatalogProduct>>(new Map());

  const remember = useCallback((products: readonly QuoteCatalogProduct[]) => {
    if (products.length === 0) return;
    setKnown((current) => {
      const next = new Map(current);
      for (const product of products) next.set(product.productId, product);
      return next;
    });
  }, []);

  useEffect(() => {
    if (setup)
      remember(
        [setup.summer.product, setup.winter.product].filter(
          (product): product is QuoteCatalogProduct => product !== null,
        ),
      );
  }, [setup, remember]);

  const missing = useMemo(
    () =>
      draft
        ? introProductIds(draft)
            .filter((id) => !known.has(id))
            .sort((a, b) => a - b)
        : [],
    [draft, known],
  );
  const loaded = useGetQuoteCatalogProductsQuery(missing, { skip: missing.length === 0 });
  useEffect(() => {
    if (loaded.data) remember(loaded.data);
  }, [loaded.data, remember]);

  return { products: known, remember };
}
