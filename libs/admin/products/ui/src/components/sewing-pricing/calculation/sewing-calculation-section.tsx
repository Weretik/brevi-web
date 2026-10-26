import { Alert, Button, CircularProgress, Typography } from '@mui/material';

import { SewingPriceTiersView } from '../sewing-price-tiers';
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
        Збережений розрахунок
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
          <Typography variant="body2" color="text.secondary">
            Розраховано {new Date(calculation.createdAt).toLocaleString('uk-UA')} · Версія складу{' '}
            {calculation.compositionVersion} · Налаштування{' '}
            {calculation.settingsRevision ?? 'не вибрано'}
          </Typography>
          {calculation.blockers.length > 0 && (
            <SewingPricingBlockers blockers={calculation.blockers} />
          )}
          {calculation.calculated && calculation.prices && (
            <>
              <SewingCalculationBreakdown calculation={calculation} />
              <SewingPriceTiersView prices={calculation.prices} />
            </>
          )}
        </>
      )}
      {!calculation && !props.calculationLoading && !props.calculationError && (
        <Typography color="text.secondary">
          Розрахунок зберігає складові собівартості та ціни для трьох обсягів замовлення.
        </Typography>
      )}
    </>
  );
}
