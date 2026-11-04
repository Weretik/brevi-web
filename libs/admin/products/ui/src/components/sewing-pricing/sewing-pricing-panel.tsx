import { Box, Paper, Stack, Typography } from '@mui/material';

import { SewingCalculationSection } from './calculation/sewing-calculation-section';
import { SewingPublicationSection } from './publication/sewing-publication-section';
import { sewingPriceFormat } from './sewing-price-format';

import type { SewingPricingPanelProps } from './sewing-pricing-panel-props';

/**
 * The price of one fabric variant of the sewing card. Read-only: the backend publishes a new price automatically whenever its
 * inputs change (CAT-012), and the history keeps every earlier one.
 */
const metres = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 });

export function SewingPricingPanel(props: SewingPricingPanelProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Stack sx={{ gap: 2 }}>
        <Typography variant="h6" component="h3">
          {props.fabric ? `Ціна: ${props.fabric.name}` : 'Ціна тканини'}
        </Typography>
        {props.fabric && (
          <Typography variant="body2">
            Тканина «{props.fabric.name}»:{' '}
            <Box component="strong" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
              {props.fabric.pricePerMetre === null
                ? 'ціна невідома'
                : `${sewingPriceFormat(props.fabric.pricePerMetre)} за м`}
              {props.fabric.metres !== null &&
                ` × ${metres.format(props.fabric.metres)} м${
                  props.fabric.pricePerMetre === null
                    ? ''
                    : ` = ${sewingPriceFormat(props.fabric.pricePerMetre * props.fabric.metres)}`
                }`}
            </Box>
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Ціна оновлюється сама, коли змінюються тканини, фурнітура, операції, склад або параметри
          ціноутворення.
        </Typography>
        <SewingPublicationSection
          published={props.published}
          publicationLoading={props.publicationLoading}
          publicationError={props.publicationError}
          onRetryPublication={props.onRetryPublication}
        />
        <SewingCalculationSection
          calculation={props.calculation}
          calculationLoading={props.calculationLoading}
          calculationError={props.calculationError}
          onRetryCalculation={props.onRetryCalculation}
        />
      </Stack>
    </Paper>
  );
}
