import { Alert, Stack, Typography } from '@mui/material';

import { customBlockerMessage } from '../../../errors/custom-sewing/custom-blocker-message';

import type { CustomPriceBasis } from '@admin/clients/model';

export function CustomPriceResult({ basis }: { basis: CustomPriceBasis | null }) {
  if (!basis)
    return (
      <Alert severity="info">Збережіть конфігурацію та явно отримайте серверний розрахунок.</Alert>
    );
  return (
    <Stack spacing={1}>
      {basis.blockers.map((blocker, index) => (
        <Alert severity="warning" key={index}>
          {customBlockerMessage(blocker)}
        </Alert>
      ))}
      {basis.isCalculated && (
        <>
          <Typography>Ціни отримані із серверного розрахунку.</Typography>
          {(['retail', 'wholesale', 'largeWholesale'] as const).map((tier) => (
            <Typography key={tier}>
              {{ retail: 'Роздріб', wholesale: 'Опт', largeWholesale: 'Великий опт' }[tier]}:{' '}
              {basis[tier]?.toLocaleString('uk-UA', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              грн
            </Typography>
          ))}
        </>
      )}
    </Stack>
  );
}
