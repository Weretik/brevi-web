import { compareQuoteBasis } from '@admin/clients/model';
import {
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { QuotePriceBasis } from '@admin/clients/model';

const labels = { retail: 'Роздріб', wholesale: 'Опт', largeWholesale: 'Великий опт' } as const;
const format = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
const amount = (value: number | null) =>
  value === null ? 'Ціна недоступна' : format.format(value);

export function QuotePriceComparison({
  title,
  previous,
  next,
}: {
  title: string;
  previous: QuotePriceBasis;
  next: QuotePriceBasis;
}) {
  const comparison = compareQuoteBasis(previous, next);
  return (
    <Stack spacing={1}>
      <Typography component="h3" variant="subtitle1">
        {title}
      </Typography>
      {!comparison.selectionMatches && (
        <Alert severity="error">Розрахунок не відповідає збереженому вибору.</Alert>
      )}
      {comparison.blocked && (
        <Alert severity="warning">
          Перерахунок заблоковано: не всі ціни доступні. Збережена версія не зміниться.
        </Alert>
      )}
      {comparison.sourceChanged === true && (
        <Alert severity="info">Джерело або версія розрахунку змінилися.</Alert>
      )}
      {comparison.sourceChanged === false && (
        <Typography variant="caption">Джерела розрахунку не змінилися.</Typography>
      )}
      {comparison.sourceChanged === null && (
        <Typography variant="caption">Відомості для порівняння джерел відсутні.</Typography>
      )}
      <TableContainer>
        <Table size="small" aria-label={`Порівняння цін: ${title}`}>
          <TableHead>
            <TableRow>
              <TableCell>Ціна</TableCell>
              <TableCell>Збережено</TableCell>
              <TableCell>Після перерахунку</TableCell>
              <TableCell>Зміна</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparison.prices.map((tier) => (
              <TableRow key={tier.tier}>
                <TableCell component="th" scope="row">
                  {labels[tier.tier]}
                </TableCell>
                <TableCell>{amount(tier.before)}</TableCell>
                <TableCell>{amount(tier.after)}</TableCell>
                <TableCell>{tier.changed ? 'Змінено' : 'Без змін'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
