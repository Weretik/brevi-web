import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';

import { sewingPriceFormat } from '../sewing-price-format';

import type { SewingCostKind, SewingPriceCalculation } from '@admin/products/model';

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
      <Typography>
        Час операцій: {calculation.minutes?.toLocaleString('uk-UA')} хв. · Вартість хвилини:{' '}
        {sewingPriceFormat(calculation.minuteCost ?? 0)}
      </Typography>
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
