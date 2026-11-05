import { formatMinor } from '@admin/accounting/model';
import { Box, Stack, Typography } from '@mui/material';

import type { FinanceTransactionTotal, FinanceTransferTotal } from '@admin/accounting/model';

export interface FinanceTotal {
  label: string;
  /** Already formatted, e.g. «−5 055,00 ₴». */
  value: string;
  tone?: 'income' | 'expense';
}

interface Props {
  /** Totals of the whole filtered selection, not only the visible page. */
  items: FinanceTotal[];
  ariaLabel: string;
}

/** A line of journal totals above the table. */
export function FinanceTotalsBar({ items, ariaLabel }: Props) {
  if (!items.length) return null;
  return (
    <Stack
      component="dl"
      direction="row"
      aria-label={ariaLabel}
      sx={{ m: 0, mb: 2, gap: { xs: 2, sm: 4 }, flexWrap: 'wrap' }}
    >
      {items.map((item) => (
        <Box key={item.label}>
          <Typography component="dt" variant="caption" color="text.secondary">
            {item.label}
          </Typography>
          <Typography
            component="dd"
            sx={{
              m: 0,
              fontWeight: 600,
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
              color:
                item.tone === 'income'
                  ? 'success.main'
                  : item.tone === 'expense'
                    ? 'error.main'
                    : 'text.primary',
            }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

const suffix = (count: number, currency: string) => (count > 1 ? ` · ${currency}` : '');

/** «Доходи», «Витрати», «Різниця» of the selection, per currency. */
export function FinanceTransactionTotals({ totals }: { totals: FinanceTransactionTotal[] }) {
  return (
    <FinanceTotalsBar
      ariaLabel="Підсумки вибірки"
      items={totals.flatMap((total) => {
        const tail = suffix(totals.length, total.currency);
        return [
          {
            label: `Доходи${tail}`,
            value: formatMinor(total.incomeMinor, total.currency),
            tone: 'income' as const,
          },
          {
            label: `Витрати${tail}`,
            value: formatMinor(total.expenseMinor, total.currency),
            tone: 'expense' as const,
          },
          { label: `Різниця${tail}`, value: formatMinor(total.differenceMinor, total.currency) },
        ];
      })}
    />
  );
}

/** Sum of the selected transfers, each counted once, per currency. */
export function FinanceTransferTotals({ totals }: { totals: FinanceTransferTotal[] }) {
  return (
    <FinanceTotalsBar
      ariaLabel="Підсумки вибірки"
      items={totals.map((total) => ({
        label: `Перекази${suffix(totals.length, total.currency)}`,
        value: formatMinor(total.amountMinor, total.currency),
      }))}
    />
  );
}
