import { useGetSewingArticleSummaryQuery } from '@admin/products/data-access';
import { sewingCardTotals, sewingNoArticleReason } from '@admin/products/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo } from 'react';

import { useProductOverviewRow } from '../product-overview/use-product-overview-row';

import type { SewingCardTone } from '@admin/products/ui';

/** Data of the sewing card: the «Товари» row of the model and the live price of its Articles. */
export function useSewingCard(productId: number) {
  const overview = useProductOverviewRow(productId, 'Sewing');
  const summary = useGetSewingArticleSummaryQuery(productId);
  const articles = useMemo(() => summary.data?.articles ?? [], [summary.data]);
  const totals = useMemo(() => sewingCardTotals(articles), [articles]);
  const row = overview.row;
  const calculated = articles.find((article) => article.calculated);
  const seamstress = calculated?.costs.find((cost) => cost.kind === 'seamstress')?.amount;
  const seamstressPerMinute =
    seamstress !== undefined && calculated?.minutes ? seamstress / calculated.minutes : null;

  // Only a problem gets a status; a fully priced model shows none (CAT-013).
  const status: { label: string; tone: SewingCardTone } | null = summary.data
    ? totals.articles === 0
      ? { label: sewingNoArticleReason, tone: 'warning' }
      : totals.ready === totals.articles
        ? null
        : {
            label: `Без ціни: ${totals.articles - totals.ready} з ${totals.articles}`,
            tone: 'warning',
          }
    : summary.isError
      ? { label: 'Розрахунок недоступний', tone: 'warning' }
      : null;

  return {
    row,
    sections: overview.sections,
    sectionNames: overview.sectionNames,
    reloadOverview: overview.reload,
    overviewLoading: overview.loading,
    articles,
    totals,
    status,
    seamstressPerMinute,
    /** The live Article summary has answered at least once. */
    summaryLoaded: Boolean(summary.data),
    summaryLoading: summary.isLoading || summary.isFetching,
    summaryError: summary.error
      ? adminApiErrorMessage(summary.error, 'Не вдалося розрахувати артикули.')
      : null,
    reloadSummary: () => void summary.refetch(),
  };
}
