import { formatMeters, formatMoney } from '@admin/production/model';
import { Alert, Box, Paper, Stack, Typography } from '@mui/material';

import type { WorkshopReport } from '@admin/production/model';

const mono = { fontFamily: 'var(--admin-font-mono)' } as const;
const pieces = (value: number) => `${value.toLocaleString('uk-UA')} шт.`;

interface Metric {
  label: string;
  value: (report: WorkshopReport) => number;
  format: (value: number) => string;
}

const metrics: Metric[] = [
  { label: 'Пошито виробів', value: (r) => r.totals.sewnPieces, format: pieces },
  { label: 'Вартість випуску за КП', value: (r) => r.totals.outputValue, format: formatMoney },
  { label: 'Нараховано працівникам', value: (r) => r.totals.accrued, format: formatMoney },
  { label: 'Видано тканини', value: (r) => r.totals.issuedValue, format: formatMoney },
  { label: 'Залишок тканин на кінець', value: (r) => r.totals.stockValue, format: formatMoney },
];

interface Props {
  report: WorkshopReport;
  comparison: WorkshopReport | null;
}

/** «Огляд» of «Звіти цеху»: the main totals and, when asked, the change against the other period. */
export function ReportTotals({ report, comparison }: Props) {
  const { totals } = report;
  const gaps = [
    totals.unpricedPieces > 0 && `${pieces(totals.unpricedPieces)} без ціни КП`,
    totals.unpricedIssuedMeters > 0 &&
      `${formatMeters(totals.unpricedIssuedMeters)} виданої тканини без ціни`,
    totals.unpricedStockMeters !== 0 &&
      `${formatMeters(totals.unpricedStockMeters)} залишку без ціни`,
  ].filter(Boolean);
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
        }}
      >
        {metrics.map((metric) => {
          const value = metric.value(report);
          const before = comparison ? metric.value(comparison) : null;
          const change = before === null ? null : value - before;
          return (
            <Paper key={metric.label} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {metric.label}
              </Typography>
              <Typography variant="h5" sx={{ ...mono, mt: 0.5 }}>
                {metric.format(value)}
              </Typography>
              {before !== null && change !== null && (
                <Typography variant="caption" color="text.secondary" sx={mono} component="div">
                  було {metric.format(before)} · {change > 0 ? '+' : ''}
                  {metric.format(change)}
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>
      {gaps.length > 0 && (
        <Alert severity="warning">Не враховано в сумах: {gaps.join('; ')}.</Alert>
      )}
      {report.warnings.map((warning) => (
        <Alert key={warning} severity="warning">
          {warning}
        </Alert>
      ))}
    </Stack>
  );
}
