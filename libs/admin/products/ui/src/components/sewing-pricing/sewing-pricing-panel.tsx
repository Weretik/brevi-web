import { Paper, Stack, Typography } from '@mui/material';

import { SewingCalculationSection } from './calculation/sewing-calculation-section';
import { SewingPublicationSection } from './publication/sewing-publication-section';
import { SewingPricingActions } from './workflow/sewing-pricing-actions';

import type { SewingPricingPanelProps } from './sewing-pricing-panel-props';

export function SewingPricingPanel(props: SewingPricingPanelProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Stack sx={{ gap: 2 }}>
        <Typography variant="h6" component="h3">
          Розрахунок і ціна артикула
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
        <SewingPricingActions
          calculation={props.calculation}
          dirty={props.dirty}
          stale={props.stale}
          writeError={props.writeError}
          alreadyPublished={props.alreadyPublished}
          busy={props.busy}
          canManage={props.canManage}
          onCalculate={props.onCalculate}
          onPublish={props.onPublish}
        />
      </Stack>
    </Paper>
  );
}
