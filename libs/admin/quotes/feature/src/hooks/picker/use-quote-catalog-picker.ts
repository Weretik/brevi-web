import { useSearchQuoteCatalogQuery } from '@admin/quotes/data-access';
import { catalogItemDraft } from '@admin/quotes/model';
import { useDeferredValue, useState } from 'react';

import type { QuoteCatalogProduct, QuoteItemDraft } from '@admin/quotes/model';

const pageSize = 20;

/**
 * «Додати товар»: search the Catalog by tab (sewing or PPE), tick fabric variants or PPE on any page,
 * then turn them into new КП items. With `onlyProductId` it lists the fabrics of one model.
 */
export function useQuoteCatalogPicker(
  options: { onlyProductId?: number; code?: string | null } = {},
) {
  const [kind, setKindState] = useState<'Sewing' | 'Ppe'>('Sewing');
  const [search, setSearchState] = useState(options.code ?? '');
  const [page, setPage] = useState(1);
  const [chosen, setChosen] = useState<ReadonlySet<number>>(new Set());
  const [picked, setPicked] = useState<ReadonlyMap<number, QuoteCatalogProduct>>(new Map());
  const deferredSearch = useDeferredValue(search);
  const query = useSearchQuoteCatalogQuery({ kind, search: deferredSearch, page, pageSize });

  const products = (query.data?.items ?? []).filter(
    (product) => options.onlyProductId === undefined || product.productId === options.onlyProductId,
  );

  const toggle = (product: QuoteCatalogProduct, id: number) => {
    setChosen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPicked((current) => new Map(current).set(product.productId, product));
  };

  /** New items: one per ticked PPE, one per model with its ticked fabrics. */
  const items = (): QuoteItemDraft[] =>
    [...picked.values()].flatMap((product) => {
      if (product.kind === 'Ppe')
        return chosen.has(product.productId) ? [catalogItemDraft(product)] : [];
      const variants = product.variants.filter((variant) => chosen.has(variant.articleId));
      return variants.length > 0 ? [catalogItemDraft(product, variants)] : [];
    });

  return {
    kind,
    setKind: (next: 'Sewing' | 'Ppe') => {
      setKindState(next);
      setPage(1);
    },
    search,
    setSearch: (value: string) => {
      setSearchState(value);
      setPage(1);
    },
    page,
    setPage,
    pageCount: Math.max(1, Math.ceil((query.data?.total ?? 0) / pageSize)),
    products,
    loading: query.isFetching,
    error: query.isError
      ? ((query.error as { message?: string }).message ?? 'Не вдалося завантажити каталог.')
      : null,
    chosen,
    count: chosen.size,
    toggle,
    items,
    /** The ticked fabrics of one model, for «Додати тканину». */
    variantsOf: (productId: number) =>
      picked.get(productId)?.variants.filter((variant) => chosen.has(variant.articleId)) ?? [],
  };
}
