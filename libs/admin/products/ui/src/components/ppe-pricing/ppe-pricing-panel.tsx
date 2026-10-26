import { Alert, Paper, Stack, Typography } from '@mui/material';

import { PpePriceTiersView } from './ppe-price-tiers';
import { PpePricingBlockers } from './ppe-pricing-blockers';

import type { PpeProductPricing } from '@admin/products/model';

export function PpePricingPanel({ pricing }: { pricing: PpeProductPricing }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack sx={{ gap: 1 }}>
        <Typography variant="h6" component="h3">
          Розрахунок цін ЗІЗ
        </Typography>
        {!pricing.isEnrolled && (
          <Alert severity="info">
            Ціни товару ще не налаштовані. Збережіть і підтвердьте вхідні ціни та потрібне правило.
          </Alert>
        )}
        {pricing.offer && (
          <Typography>
            Ціни в Brevi: {pricing.offer.isApproved ? 'підтверджено' : 'потребують підтвердження'}.
            У джерелі: {pricing.offer.values.sourceReviewed ? 'перевірено' : 'не перевірено'}.
          </Typography>
        )}
        {pricing.prices ? (
          <PpePriceTiersView prices={pricing.prices} />
        ) : (
          <PpePricingBlockers blockers={pricing.blockers} />
        )}
        {pricing.rule && (
          <Typography>
            Правило: {pricing.rule.values.code} ·{' '}
            {pricing.rule.isApproved ? 'підтверджено' : 'потребує підтвердження'}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
