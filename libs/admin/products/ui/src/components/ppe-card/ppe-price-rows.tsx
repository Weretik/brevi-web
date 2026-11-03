import { Stack, Typography } from '@mui/material';

import { sewingPriceFormat } from '../sewing-pricing/sewing-price-format';

import type { PpePriceTiers } from '@admin/products/model';

interface RowProps {
  label: string;
  value: string;
}

/** One label and mono value of a `dl` list. */
export function PpePriceRow({ label, value }: RowProps) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
      <Typography component="dt" variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography
        component="dd"
        variant="body2"
        sx={{ m: 0, fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

/** The three PPE prices of «Прайс на сайт» H–J: від 1, від 11 and від 41 шт. */
export function PpePriceTierRows({ prices }: { prices: PpePriceTiers }) {
  return (
    <Stack component="dl" sx={{ m: 0, gap: 1 }}>
      <PpePriceRow label="Роздріб, від 1 шт." value={sewingPriceFormat(prices.retail)} />
      <PpePriceRow label="Опт, від 11 шт." value={sewingPriceFormat(prices.wholesale)} />
      <PpePriceRow
        label="Великий опт, від 41 шт."
        value={sewingPriceFormat(prices.largeWholesale)}
      />
    </Stack>
  );
}
