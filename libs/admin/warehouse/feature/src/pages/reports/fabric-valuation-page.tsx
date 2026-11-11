import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { useGetFabricValuationQuery } from '@admin/warehouse/data-access';
import { formatKyivTime, formatMeters, formatMoney } from '@admin/warehouse/model';
import { ReportStats, ValuationShortageTable, ValuationTable } from '@admin/warehouse/ui';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Alert, Box, Button, Typography } from '@mui/material';

/**
 * «Склад тканин › Вартість складу» (WH-005): the positive stock at today's prices of «Тканини».
 * Not FIFO and not the purchase cost; shortages are apart and do not lower it.
 */
export function FabricValuationPage() {
  const report = useGetFabricValuationQuery();
  const data = report.data;
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title="Вартість тканин на складі"
        subtitle={
          data
            ? `Розраховано ${formatKyivTime(data.calculatedAt)}. ${data.priceSource}: найменша додатна ціна групи тканини. Це не закупівельна собівартість.`
            : 'Додатний залишок за ціною довідника «Тканини»'
        }
        actions={
          <Button
            variant="outlined"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => void report.refetch()}
          >
            Оновити ціни і залишки
          </Button>
        }
      />
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
              },
              { label: 'Додатний залишок', value: formatMeters(data.positiveMeters) },
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
                      hint: `оцінка ${formatMoney(data.shortageValue)}`,
                    },
                  ]
                : []),
            ]}
          />
          {data.isPartial && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              У довіднику «Тканини» немає ціни для {data.unpricedPairs} пар: разом показано лише
              оцінену частину.
            </Alert>
          )}
          <ValuationTable report={data} />
          {data.shortages.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Дефіцит (відʼємний залишок)
              </Typography>
              <ValuationShortageTable rows={data.shortages} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default FabricValuationPage;
