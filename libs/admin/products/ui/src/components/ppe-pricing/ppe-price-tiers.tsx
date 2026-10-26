import { Stack, Typography } from '@mui/material';

import type { PpePriceTiers } from '@admin/products/model';

export function PpePriceTiersView({ prices }: { prices: PpePriceTiers }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 3 }}>
      {(['retail', 'wholesale', 'largeWholesale'] as const).map((tier, index) => (
        <Stack key={tier}>
          <Typography>{['Роздріб', 'Опт', 'Великий опт'][index]}</Typography>
          <Typography component="p" variant="h6">
            {prices[tier].toLocaleString('uk-UA', { style: 'currency', currency: 'UAH' })}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
