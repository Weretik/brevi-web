import { formatMinor } from '@admin/accounting/model';
import { Box, Paper, Stack, Typography } from '@mui/material';

import { FinanceProblemPill } from '../status/finance-problem-pill';

import type { FinanceOverviewCurrency } from '@admin/accounting/model';

interface Props {
  currencies: FinanceOverviewCurrency[];
  /** «Не підтверджено» applies only to the current books. */
  currentBooks: boolean;
}

const figure = {
  m: 0,
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 600,
  fontSize: '1.25rem',
};

/** «Огляд»: balance, income, expense and difference, one row of cards per currency. */
export function FinanceOverviewSummary({ currencies, currentBooks }: Props) {
  if (!currencies.length)
    return (
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Додайте рахунок у «Рахунках і касах», щоб побачити огляд.
      </Typography>
    );
  return (
    <Stack sx={{ gap: 2, mb: 3 }}>
      {currencies.map((row) => {
        const unknown = currentBooks && row.unconfirmedCutoverCount > 0;
        const cards = [
          {
            label: 'Залишок',
            value: formatMinor(row.balanceMinor, row.currency),
            note: unknown ? (
              <FinanceProblemPill
                label={`Не підтверджено: ${row.unconfirmedCutoverCount} з ${row.accountCount}`}
              />
            ) : null,
          },
          {
            label: 'Доходи',
            value: formatMinor(row.incomeMinor, row.currency),
            tone: 'success.main',
          },
          {
            label: 'Витрати',
            value: formatMinor(row.expenseMinor, row.currency),
            tone: 'error.main',
          },
          { label: 'Різниця', value: formatMinor(row.differenceMinor, row.currency) },
        ];
        return (
          <Box
            key={row.currency}
            component="section"
            aria-label={`Огляд у ${row.currency}`}
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            }}
          >
            {cards.map((card) => (
              <Paper key={card.label} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="overline" color="text.secondary">
                  {card.label}
                  {currencies.length > 1 ? ` · ${row.currency}` : ''}
                </Typography>
                <Typography component="p" sx={{ ...figure, color: card.tone ?? 'text.primary' }}>
                  {card.value}
                </Typography>
                {card.note}
              </Paper>
            ))}
          </Box>
        );
      })}
    </Stack>
  );
}
