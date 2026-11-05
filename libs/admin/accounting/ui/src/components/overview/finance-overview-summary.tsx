import { financeOperationForms, formatFinanceCount, formatMinor } from '@admin/accounting/model';
import { Box, Paper, Typography } from '@mui/material';

import { FinanceProblemPill } from '../status/finance-problem-pill';

import type { FinanceOverviewCurrency } from '@admin/accounting/model';
import type { ReactNode } from 'react';

interface Props {
  currencies: FinanceOverviewCurrency[];
  /** «Не підтверджено» applies only to the current books. */
  currentBooks: boolean;
  /** The period inside a label, e.g. «листопад». */
  periodCaption: string;
}

const figure = {
  m: 0,
  mt: 0.75,
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 600,
  fontSize: '1.375rem',
  lineHeight: 1.25,
};

interface Cell {
  label: string;
  value: string;
  tone?: string;
  note: ReactNode;
}

/** «Огляд»: balance, incomes, expenses and difference in one strip per currency. */
export function FinanceOverviewSummary({ currencies, currentBooks, periodCaption }: Props) {
  if (!currencies.length)
    return (
      <Typography color="text.secondary">
        Додайте рахунок у «Рахунках і касах», щоб побачити огляд.
      </Typography>
    );
  const period = periodCaption.toUpperCase();
  return (
    <>
      {currencies.map((row) => {
        const unknown = currentBooks && row.unconfirmedCutoverCount > 0;
        const tail = currencies.length > 1 ? ` · ${row.currency}` : '';
        const cells: Cell[] = [
          {
            label: `Залишок зараз${tail}`,
            value: formatMinor(row.balanceMinor, row.currency),
            note: unknown ? (
              <FinanceProblemPill
                label={`Не підтверджено: ${row.unconfirmedCutoverCount} з ${row.accountCount}`}
              />
            ) : (
              `Рахунків і кас: ${row.accountCount}`
            ),
          },
          {
            label: `Надходження · ${period}${tail}`,
            value: formatMinor(row.incomeMinor, row.currency),
            tone: 'success.main',
            note: formatFinanceCount(row.incomeCount, financeOperationForms),
          },
          {
            label: `Витрати · ${period}${tail}`,
            value: formatMinor(row.expenseMinor, row.currency),
            tone: 'error.main',
            note: formatFinanceCount(row.expenseCount, financeOperationForms),
          },
          {
            label: `Різниця${tail}`,
            value: formatMinor(row.differenceMinor, row.currency),
            note:
              row.differenceMinor < 0 ? (
                <Box component="span" sx={{ color: 'error.main' }}>
                  Витрати більші за надходження
                </Box>
              ) : null,
          },
        ];
        return (
          <Paper
            key={row.currency}
            component="section"
            variant="outlined"
            aria-label={`Підсумки ${row.currency}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              overflow: 'hidden',
            }}
          >
            {cells.map((cell) => (
              <Box
                key={cell.label}
                sx={{
                  p: 2,
                  borderColor: 'divider',
                  borderStyle: 'solid',
                  borderWidth: 0,
                  borderRightWidth: { lg: 1 },
                  borderBottomWidth: { xs: 1, lg: 0 },
                  '&:last-of-type': { borderRightWidth: 0, borderBottomWidth: 0 },
                }}
              >
                <Typography
                  variant="overline"
                  component="h2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.4 }}
                >
                  {cell.label}
                </Typography>
                <Typography component="p" sx={{ ...figure, color: cell.tone ?? 'text.primary' }}>
                  {cell.value}
                </Typography>
                {cell.note && (
                  <Typography
                    component="div"
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {cell.note}
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        );
      })}
    </>
  );
}
