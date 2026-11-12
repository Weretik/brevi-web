import {
  useGetSewingAccessQuery,
  useGetSewingArticleSummaryQuery,
} from '@admin/products/data-access';
import { sewingCardToDraft, sewingVariantsFromSummary } from '@admin/products/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { usePageRights } from '@admin/shared/ui';
import { useMemo } from 'react';

/**
 * One sewing model as the card edits it (CAT-015, CAT-016): its fabric variants with live prices
 * and the shared composition (accessories, other costs and operations) with reference names, all
 * from one response. Full reference lists load only in a side panel (`useSewingReferenceOptions`).
 */
export function useSewingModel(productId: number) {
  const access = useGetSewingAccessQuery();
  const { canEdit } = usePageRights();
  const canRead = access.data?.canRead === true;
  const card = useGetSewingArticleSummaryQuery(productId, { skip: !canRead });
  const data = card.data;
  const draft = useMemo(() => (data ? sewingCardToDraft(data) : null), [data]);
  const variants = useMemo(
    () => (data ? sewingVariantsFromSummary(productId, data.articles) : []),
    [data, productId],
  );

  const error = access.isError
    ? adminApiErrorMessage(access.error, 'Не вдалося перевірити доступ до складу.')
    : access.data && !canRead
      ? 'Немає права переглядати склад цього товару.'
      : card.isError
        ? adminApiErrorMessage(card.error, 'Не вдалося завантажити модель.')
        : null;

  return {
    canManage: access.data?.canManage === true && canEdit,
    loading: access.isLoading || card.isLoading,
    /** A save is being followed by a fresh calculation. */
    refreshing: card.isFetching,
    error,
    retry: () => {
      void access.refetch();
      if (canRead) void card.refetch();
    },
    /** Live price of every variant with its fabric; empty until loaded. */
    summary: data?.articles ?? [],
    summaryLoaded: Boolean(data),
    materials: data?.materials ?? [],
    operations: data?.operations ?? [],
    variants,
    modelCode: data?.modelCode ?? null,
    /** Version of the model composition; every write sends it back. */
    version: data?.version ?? 0,
    draft,
  };
}

export type SewingModel = ReturnType<typeof useSewingModel>;
