import { Alert, Button, CircularProgress, Typography } from '@mui/material';

import { SewingCalculationBreakdown } from './sewing-calculation-breakdown';
import { SewingPricingBlockers } from './sewing-pricing-blockers';

import type { SewingPricingPanelProps } from '../sewing-pricing-panel-props';

export function SewingCalculationSection(
  props: Pick<
    SewingPricingPanelProps,
    'calculation' | 'calculationLoading' | 'calculationError' | 'onRetryCalculation'
  >,
) {
  const { calculation } = props;
  return (
    <>
      <Typography variant="subtitle1" component="h4">
        Складові ціни
      </Typography>
      {props.calculationLoading && (
        <CircularProgress size={22} aria-label="Завантаження розрахунку" />
      )}
      {props.calculationError && (
        <Alert
          severity="error"
          action={<Button onClick={props.onRetryCalculation}>Повторити</Button>}
        >
          {props.calculationError}
        </Alert>
      )}
      {calculation && (
        <>
          {calculation.blockers.length > 0 && (
            <SewingPricingBlockers blockers={calculation.blockers} />
          )}
          {calculation.calculated && <SewingCalculationBreakdown calculation={calculation} />}
        </>
      )}
    </>
  );
}
