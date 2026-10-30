import { introductionLayout } from '@admin/clients/model';
import {
  useGetProductQuery,
  useListProductsQuery,
  useListSewingArticlesQuery,
} from '@admin/products/data-access';
import { useState } from 'react';

import type { useIntroductionEditor } from './use-introduction-editor';

/** Catalog queries and dialog selection state; quote approval stays in the editor. */
export function useIntroductionCatalogPickers(editor: ReturnType<typeof useIntroductionEditor>) {
  const [modelSlot, setModelSlot] = useState<string | null>(null);
  const [articleSlot, setArticleSlot] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [productPage, setProductPage] = useState(1);
  const selectedArticleSlot = editor.draft.slots.find((slot) => slot.key === articleSlot);
  const articles = useListSewingArticlesQuery(selectedArticleSlot?.productId ?? 0, {
    skip: !selectedArticleSlot?.productId,
  });
  const descriptor = introductionLayout(editor.draft.values.format).find(
    (slot) => slot.key === modelSlot,
  );
  const featuredId =
    descriptor?.season === 'summer'
      ? editor.mapping.currentData?.summerProductId
      : editor.mapping.currentData?.winterProductId;
  const products = useListProductsQuery(
    { type: 'Sewing', page: productPage, pageSize: 20, search },
    { skip: !modelSlot || !!descriptor?.featured },
  );
  const featured = useGetProductQuery(featuredId ?? 0, {
    skip: !modelSlot || !descriptor?.featured || !featuredId,
  });
  const modelRows = descriptor?.featured
    ? featured.currentData
      ? [featured.currentData]
      : []
    : (products.currentData?.value ?? []);
  const modelOptions = modelRows
    .filter((row) => !descriptor?.featured || row.id === featuredId)
    .map((row) => ({ productId: row.id, label: row.name }));
  const articleOptions = (articles.currentData?.articles ?? [])
    .filter((row) => row.active)
    .map((row) => ({
      articleId: row.id,
      label: row.saleSku,
      description: row.readiness?.blockers.join(', '),
    }));
  const readError = (failure: unknown, fallback: string) => (failure ? fallback : undefined);

  return {
    chooseProduct: (key: string) => {
      setSearch('');
      setProductPage(1);
      setModelSlot(key);
    },
    chooseFabric: (key: string) => setArticleSlot(key),
    model: {
      open: !!modelSlot,
      options: modelOptions,
      loading: descriptor?.featured ? featured.isFetching : products.isFetching,
      error: readError(
        descriptor?.featured ? featured.error : products.error,
        'Не вдалося завантажити моделі. Повторіть пошук.',
      ),
      search,
      onSearchChange: (value: string) => {
        setSearch(value);
        setProductPage(1);
      },
      page: descriptor?.featured ? 1 : productPage,
      totalPages: descriptor?.featured ? 1 : (products.currentData?.pagedInfo.totalPages ?? 1),
      onPageChange: setProductPage,
      onClose: () => setModelSlot(null),
      onSelect: (id: number) => {
        const option = modelOptions.find((row) => row.productId === id);
        if (modelSlot && option) editor.draft.selectProduct(modelSlot, id, option.label);
        setModelSlot(null);
      },
    },
    article: {
      open: !!articleSlot,
      options: articleOptions,
      loading: articles.isFetching,
      error: !selectedArticleSlot?.productId
        ? 'Спочатку оберіть модель.'
        : readError(articles.error, 'Не вдалося завантажити артикули.'),
      onClose: () => setArticleSlot(null),
      onSelect: (id: number) => {
        const option = articleOptions.find((row) => row.articleId === id);
        if (articleSlot && option) editor.draft.selectArticle(articleSlot, id, option.label);
        setArticleSlot(null);
      },
    },
  };
}
