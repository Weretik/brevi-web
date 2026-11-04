import { Stack, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import { SewingCardMetricStrip } from '../../sewing-card/sewing-card-metric-strip';
import { sewingPriceFormat } from '../sewing-price-format';

import type { SewingCostKind, SewingPriceCalculation } from '@admin/products/model';

const minutes = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

const labels: Record<SewingCostKind, string> = {
  materials: 'Матеріали',
  otherCosts: 'Додаткові витрати',
  seamstress: 'Пошиття та збірка',
  cutting: 'Розкрій',
  master: 'Майстер',
  manager: 'Керівник цеху',
  bonus: 'Премія',
  overhead: 'Накладні витрати',
};

export function SewingCalculationBreakdown({
  calculation,
}: {
  calculation: SewingPriceCalculation;
}) {
  return (
    <Stack sx={{ gap: 1 }}>
      <SewingCardMetricStrip
        metrics={[
          {
            label: 'Час операцій',
            value: calculation.minutes === null ? '—' : `${minutes.format(calculation.minutes)} хв`,
          },
          {
            label: 'Вартість хвилини',
            value:
              calculation.minuteCost === null ? '—' : sewingPriceFormat(calculation.minuteCost),
          },
          {
            label: 'Трудовитрати, грн',
            value:
              calculation.minutes === null || calculation.minuteCost === null
                ? '—'
                : sewingPriceFormat(calculation.minutes * calculation.minuteCost),
            note: 'час × вартість хвилини',
          },
        ]}
      />
      <TableContainer>
        <Table size="small" aria-label="Складові собівартості">
          <TableBody>
            {calculation.costs.map(({ kind, amount }) => (
              <TableRow key={kind}>
                <TableCell component="th" scope="row">
                  {labels[kind]}
                </TableCell>
                <TableCell align="right">{sewingPriceFormat(amount)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Повна собівартість</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{sewingPriceFormat(calculation.fullCost ?? 0)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
