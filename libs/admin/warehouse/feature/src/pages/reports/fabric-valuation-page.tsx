import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { useGetFabricValuationQuery } from '@admin/warehouse/data-access';
import {
  filterValuation,
  formatKyivTime,
  formatMeters,
  formatMoney,
  valuationViewCounts,
  valuationViewLabels,
  valuationViews,
} from '@admin/warehouse/model';
import {
  ReportFilterBar,
  ReportStats,
  ValuationShortageTable,
  ValuationTable,
} from '@admin/warehouse/ui';
import { Alert, Box } from '@mui/material';
import { useMemo, useState } from 'react';

import type { WarehouseTabProps } from '../tabs/warehouse-tab';
import type { ValuationView } from '@admin/warehouse/model';

/**
 * «Склад тканин › Звіти › Вартість» (WH-005): the positive stock at today's prices of «Тканини», one row per fabric,
 * the most valuable first. Not FIFO and not the purchase cost; shortages are apart and do not lower it.
 */
export function FabricValuationPage({ title, tabs }: WarehouseTabProps) {
  const report = useGetFabricValuationQuery();
  const data = report.data;
  const [view, setView] = useState<ValuationView>('all');
  const fabrics = useMemo(
    () => (data && view !== 'shortage' ? filterValuation(data.fabrics, view) : []),
    [data, view],
  );
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title={title ?? 'Вартість тканин на складі'}
        subtitle={
          data
            ? `Розраховано ${formatKyivTime(data.calculatedAt)}. ${data.priceSource}: найменша додатна ціна групи тканини. Це не закупівельна собівартість.`
            : 'Додатний залишок за ціною довідника «Тканини»'
        }
        actions={null}
      />
      {tabs}
      <ReferenceListAlerts
        error={report.error ? 'Не вдалося порахувати вартість складу.' : null}
        loading={report.isFetching}
        onRetry={() => void report.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {data && (
        <>
          <ReportStats
            stats={[
              {
                label: data.isPartial ? 'Вартість оціненої частини' : 'Вартість складу',
                value: formatMoney(data.value),
                hint: `за цінами «Тканини» на ${formatKyivTime(data.calculatedAt).slice(-5)}`,
              },
              { label: 'Залишок', value: formatMeters(data.positiveMeters) },
              ...(data.isPartial
                ? [
                    {
                      label: 'Без ціни',
                      value: formatMeters(data.unpricedMeters),
                      tone: 'warning' as const,
                      hint: `пар: ${data.unpricedPairs}`,
                    },
                  ]
                : []),
              ...(data.shortageMeters > 0
                ? [
                    {
                      label: 'Дефіцит',
                      value: formatMeters(data.shortageMeters),
                      tone: 'error' as const,
                      hint: `≈ ${formatMoney(data.shortageValue)}`,
                    },
                  ]
                : []),
            ]}
          />
          <ReportFilterBar
            search=""
            searchPlaceholder=""
            searchLabel=""
            views={valuationViews}
            labels={valuationViewLabels}
            counts={valuationViewCounts(data)}
            view={view}
            hideEmpty={['unpriced', 'shortage']}
            hideSearch
            onSearch={() => undefined}
            onView={setView}
          />
          {view === 'shortage' ? (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Відʼємний залишок не зменшує вартість складу; оцінка нестачі за тією ж ціною.
              </Alert>
              <ValuationShortageTable rows={data.shortages} />
            </>
          ) : (
            <ValuationTable report={data} fabrics={fabrics} filtered={view !== 'all'} />
          )}
        </>
      )}
    </Box>
  );
}

export default FabricValuationPage;
