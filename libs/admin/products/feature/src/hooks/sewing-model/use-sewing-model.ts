import {
  useGetSewingAccessQuery,
  useGetSewingCompositionQuery,
  useListSewingArticlesQuery,
} from '@admin/products/data-access';
import { sewingCompositionToDraft } from '@admin/products/model';
import {
  useListFabricsQuery,
  useListGarmentAccessoriesQuery,
  useListGarmentPartOperationsQuery,
} from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo } from 'react';

/**
 * One sewing model as the card edits it (CAT-015): its fabric variants, the shared composition
 * (accessories, other costs and operations) and the references they point at.
 */
export function useSewingModel(productId: number) {
  const access = useGetSewingAccessQuery();
  const canRead = access.data?.canRead === true;
  const skip = { skip: !canRead };
  const fabrics = useListFabricsQuery(undefined, skip);
  const accessories = useListGarmentAccessoriesQuery(undefined, skip);
  const operations = useListGarmentPartOperationsQuery(undefined, skip);
  const variants = useListSewingArticlesQuery(productId, skip);
  const composition = useGetSewingCompositionQuery({ productId, articleId: null }, skip);
  const draft = useMemo(
    () => (composition.data ? sewingCompositionToDraft(composition.data) : null),
    [composition.data],
  );
  const lookupsFailed = fabrics.isError || accessories.isError || operations.isError;

  const error = access.isError
    ? adminApiErrorMessage(access.error, 'Не вдалося перевірити доступ до складу.')
    : access.data && !canRead
      ? 'Немає права переглядати склад цього товару.'
      : variants.isError
        ? adminApiErrorMessage(variants.error, 'Не вдалося завантажити тканини моделі.')
        : composition.isError
          ? adminApiErrorMessage(composition.error, 'Не вдалося завантажити склад моделі.')
          : lookupsFailed
            ? 'Не вдалося завантажити довідники тканин, фурнітури або операцій.'
            : null;

  return {
    canManage: access.data?.canManage === true,
    loading: access.isLoading || variants.isLoading || composition.isLoading,
    error,
    retry: () => {
      void access.refetch();
      if (!canRead) return;
      void variants.refetch();
      void composition.refetch();
      void fabrics.refetch();
      void accessories.refetch();
      void operations.refetch();
    },
    variants: variants.data?.articles ?? [],
    modelCode: variants.data?.modelCode ?? draft?.modelCode ?? null,
    /** Version of the model composition; every write sends it back. */
    version: draft?.version ?? variants.data?.version ?? 0,
    draft,
    fabrics: fabrics.data ?? [],
    accessories: accessories.data ?? [],
    operations: operations.data ?? [],
  };
}

export type SewingModel = ReturnType<typeof useSewingModel>;
