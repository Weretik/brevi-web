import { CircularProgress, Paper, Stack, Typography } from '@mui/material';

import { PpePriceTierRows } from '../ppe-card/ppe-price-rows';

import type { PpePriceTiers } from '@admin/products/model';

interface Props {
  prices: PpePriceTiers | null;
  /** Why the prices are not calculated, in the sheet's words. */
  reasons: readonly string[];
  /** True until both the supplier price and the rule are set. */
  waiting: boolean;
  loading: boolean;
  error: string | null;
  priceNote: string | null;
}

/** «Ціни в прайсі»: the three prices the price list will show, before the product is saved. */
export function PpeCreatePricePreviewCard(props: Props) {
  const { prices } = props;
  const message = props.waiting
    ? 'Вкажіть ціну постачальника і правило націнки.'
    : (props.error ?? (prices ? null : (props.reasons[0] ?? 'Ціну не розраховано.')));
  return (
    <Paper
      variant="outlined"
      component="section"
      aria-label="Ціни в прайсі"
      aria-busy={props.loading}
      sx={{ p: 2 }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
      >
        <Typography variant="h6" component="h2">
          Ціни в прайсі
        </Typography>
        {props.loading && <CircularProgress size={16} aria-label="Розрахунок цін" />}
      </Stack>
      <Stack sx={{ gap: 1.5 }}>
        {prices && !props.waiting && !props.error ? (
          <PpePriceTierRows prices={prices} />
        ) : (
          <Typography variant="body2" sx={{ color: props.error ? 'error.main' : 'text.secondary' }}>
            {message}
          </Typography>
        )}
        {props.priceNote && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Примітка в прайсі: {props.priceNote}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
