import { Box, Paper, Typography } from '@mui/material';

import type { SewingAmountRange } from '@admin/products/model';

export interface SewingCardCostItem {
  label: string;
  value: string;
  note?: string;
  tone?: 'warning';
}

export interface SewingCardPriceTier {
  label: string;
  /** Lowest and highest price over the model's articles; null while not calculated. */
  range: SewingAmountRange | null;
  highlighted?: boolean;
}

interface Props {
  costs: readonly SewingCardCostItem[];
  tiers: readonly SewingCardPriceTier[];
  /** Whole-hryvnia formatter, so that every figure stays short and on one line. */
  format: (value: number) => string;
}

const mono = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
} as const;

/**
 * Totals of the sewing card: one line of costs, then three equal price tiers.
 * A tier shows the lowest price big and the highest one under it.
 */
export function SewingCardTotals({ costs, tiers, format }: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 2, display: 'grid', gap: 2 }}>
      <Box
        component="dl"
        sx={{
          m: 0,
          pb: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px 32px',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {costs.map((cost) => (
          <Box key={cost.label} sx={{ minWidth: 0 }}>
            <Typography variant="overline" component="dt" sx={{ color: 'text.secondary' }}>
              {cost.label}
            </Typography>
            <Typography component="dd" sx={{ m: 0, fontSize: 16, fontWeight: 600, ...mono }}>
              {cost.value}
            </Typography>
            {cost.note && (
              <Typography
                variant="caption"
                component="dd"
                sx={{ m: 0, color: cost.tone ? `${cost.tone}.main` : 'text.secondary' }}
              >
                {cost.note}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      <Box
        component="dl"
        sx={{
          m: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
          gap: 1.5,
        }}
      >
        {tiers.map((tier) => (
          <Box
            key={tier.label}
            sx={{
              p: 1.5,
              minWidth: 0,
              border: 1,
              borderColor: tier.highlighted ? 'transparent' : 'divider',
              borderRadius: 1,
              bgcolor: tier.highlighted ? 'action.selected' : undefined,
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'column' },
              alignItems: { xs: 'baseline', sm: 'flex-start' },
              justifyContent: 'space-between',
              gap: 0.5,
            }}
          >
            <Typography variant="overline" component="dt" sx={{ color: 'text.secondary' }}>
              {tier.label}
            </Typography>
            <Box>
              <Typography component="dd" sx={{ m: 0, fontSize: 20, fontWeight: 600, ...mono }}>
                {tier.range ? `від ${format(tier.range.min)}` : '—'}
              </Typography>
              <Typography
                variant="caption"
                component="dd"
                sx={{ m: 0, color: 'text.secondary', ...mono }}
              >
                {tier.range && tier.range.max !== tier.range.min
                  ? `до ${format(tier.range.max)} · з ПДВ`
                  : 'з ПДВ'}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
