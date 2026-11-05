import { financeCategoryForms, formatFinanceCount, formatMinor } from '@admin/accounting/model';
import { Box, Link, Paper, Stack, Typography } from '@mui/material';

import type { FinanceOverviewCurrency } from '@admin/accounting/model';

interface Props {
  currencies: FinanceOverviewCurrency[];
  /** The period inside the title, e.g. «листопад». */
  periodCaption: string;
  /** «Операції» of the same area. */
  journalPath: string;
}

/** «Куди пішли гроші»: the largest expense root categories of the period as bars. */
export function FinanceExpenseBars({ currencies, periodCaption, journalPath }: Props) {
  const spent = currencies.filter((row) => row.expenseMinor > 0);
  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby="finance-expense-bars"
      sx={{ overflow: 'hidden' }}
    >
      <Stack
        direction="row"
        sx={{
          px: 2,
          py: 1.5,
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography id="finance-expense-bars" variant="h6" component="h2">
          Куди пішли гроші · {periodCaption}
        </Typography>
        <Link href={journalPath} underline="hover" variant="subtitle2">
          Операції
        </Link>
      </Stack>
      <Stack sx={{ px: 2, py: 1.75, gap: 1.75 }}>
        {!spent.length && (
          <Typography variant="body2" color="text.secondary">
            За цей період витрат немає.
          </Typography>
        )}
        {spent.map((row) => {
          const largest = row.topExpenses[0]?.amountMinor ?? 1;
          return (
            <Stack
              key={row.currency}
              component="ul"
              sx={{ m: 0, p: 0, listStyle: 'none', gap: 1.75 }}
            >
              {row.topExpenses.map((category) => (
                <Box component="li" key={category.categoryId ?? 'none'}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: category.categoryId ? 'text.primary' : 'warning.dark' }}
                    >
                      {category.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'var(--admin-font-mono)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {formatMinor(category.amountMinor, row.currency)}
                    </Typography>
                  </Stack>
                  <Box
                    aria-hidden
                    sx={{ mt: 0.75, height: 8, borderRadius: 1, bgcolor: 'action.hover' }}
                  >
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: 'primary.main',
                        width: `${Math.max(2, Math.round((category.amountMinor / largest) * 100))}%`,
                      }}
                    />
                  </Box>
                </Box>
              ))}
              {row.otherExpenseCategoryCount > 0 && (
                <Typography component="li" variant="caption" color="text.secondary">
                  Інші: {formatFinanceCount(row.otherExpenseCategoryCount, financeCategoryForms)} —{' '}
                  {formatMinor(row.otherExpenseMinor, row.currency)}
                </Typography>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}
