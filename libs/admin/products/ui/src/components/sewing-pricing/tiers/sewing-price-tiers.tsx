import { Box, Stack, Typography } from '@mui/material';

import { sewingPriceFormat } from './sewing-price-format';

import type { SewingPriceTiers } from '@admin/products/model';

const bands = [
  { key: 'retail', label: 'Роздріб · 1–9 шт.' },
  { key: 'wholesale', label: 'Опт · 10–40 шт.' },
  { key: 'largeWholesale', label: 'Великий опт · 41+ шт.' },
] as const;

export function SewingPriceTiersView({ prices }: { prices: SewingPriceTiers }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1 }}>
      {bands.map(({ key, label }) => (
        <Box key={key} sx={{ flex: 1, p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" component="p">
            {sewingPriceFormat(prices[key])}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
