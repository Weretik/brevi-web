import { useGetSewingArticleSummaryQuery } from '@admin/products/data-access';
import { sewingCardTotals, sewingNoArticleReason, sewingReadyStatus } from '@admin/products/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo } from 'react';

import { useProductOverview } from '../product-overview/use-product-overview';

import type { SewingCardTone } from '@admin/products/ui';

/** Data of the sewing card: the «Товари» row of the model and the live price of its Articles. */
export function useSewingCard(productId: number) {
  const overview = useProductOverview('Sewing');
  const summary = useGetSewingArticleSummaryQuery(productId);
  const articles = useMemo(() => summary.data?.articles ?? [], [summary.data]);
  const totals = useMemo(() => sewingCardTotals(articles), [articles]);
  const row = overview.rows.find((item) => item.id === productId) ?? null;
  const calculated = articles.find((article) => article.calculated);
  const seamstress = calculated?.costs.find((cost) => cost.kind === 'seamstress')?.amount;
  const seamstressPerMinute =
    seamstress !== undefined && calculated?.minutes ? seamstress / calculated.minutes : null;

  const status: { label: string; tone: SewingCardTone } = summary.data
    ? totals.articles === 0
      ? { label: sewingNoArticleReason, tone: 'warning' }
      : totals.ready === totals.articles
        ? { label: sewingReadyStatus, tone: 'success' }
        : { label: `Готово ${totals.ready} з ${totals.articles}`, tone: 'warning' }
    : { label: summary.isError ? 'Розрахунок недоступний' : 'Розрахунок…', tone: 'neutral' };

  return {
    row,
    sections: overview.sections,
    sectionNames: overview.sectionNames,
    reloadOverview: overview.reload,
    articles,
    totals,
    status,
    seamstressPerMinute,
    summaryLoading: summary.isLoading || summary.isFetching,
    summaryError: summary.error
      ? adminApiErrorMessage(summary.error, 'Не вдалося розрахувати артикули.')
      : null,
    reloadSummary: () => void summary.refetch(),
  };
}
