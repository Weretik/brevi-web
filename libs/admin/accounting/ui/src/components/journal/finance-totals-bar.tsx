import { formatMinor } from '@admin/accounting/model';
import { Box, Typography } from '@mui/material';

import type { FinanceTransactionTotal, FinanceTransferTotal } from '@admin/accounting/model';

export interface FinanceTotal {
  label: string;
  /** Already formatted, e.g. «−5 055,00 ₴». */
  value: string;
  tone?: 'income' | 'expense' | 'strong';
}

interface Props {
  /** Totals of the whole filtered selection, not only the visible page. */
  items: FinanceTotal[];
  ariaLabel: string;
}

const tones = { income: 'success.main', expense: 'error.main', strong: 'text.primary' } as const;

/** One line of journal totals: «Надходження +99 395,76 · Витрати −287 968,70 · Різниця −188 572,94 ₴». */
export function FinanceTotalsBar({ items, ariaLabel }: Props) {
  if (!items.length) return null;
  return (
    <Typography
      component="dl"
      variant="body2"
      aria-label={ariaLabel}
      sx={{
        m: 0,
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: 1.5,
        rowGap: 0.5,
        alignItems: 'baseline',
        color: 'text.secondary',
      }}
    >
      {items.map((item) => (
        <Box key={item.label} sx={{ display: 'flex', gap: 0.75, alignItems: 'baseline' }}>
          <Box component="dt">{item.label}</Box>
          <Box
            component="dd"
            sx={{
              m: 0,
              fontWeight: 600,
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
              color: item.tone ? tones[item.tone] : 'text.primary',
            }}
          >
            {item.value}
          </Box>
        </Box>
      ))}
    </Typography>
  );
}

const suffix = (count: number, currency: string) => (count > 1 ? ` ${currency}` : '');

/** «Надходження», «Витрати», «Різниця» of the selection, per currency. */
export function FinanceTransactionTotals({ totals }: { totals: FinanceTransactionTotal[] }) {
  return (
    <FinanceTotalsBar
      ariaLabel="Підсумки вибірки"
      items={totals.flatMap((total) => {
        const tail = suffix(totals.length, total.currency);
        return [
          {
            label: `Надходження${tail}`,
            value: `+${formatMinor(total.incomeMinor, total.currency)}`,
            tone: 'income' as const,
          },
          {
            label: `Витрати${tail}`,
            value: `−${formatMinor(total.expenseMinor, total.currency)}`,
            tone: 'expense' as const,
          },
          {
            label: `Різниця${tail}`,
            value: formatMinor(total.differenceMinor, total.currency),
            tone: 'strong' as const,
          },
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
        tone: 'strong' as const,
      }))}
    />
  );
}
