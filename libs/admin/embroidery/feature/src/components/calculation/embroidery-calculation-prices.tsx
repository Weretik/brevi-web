import { EmbroideryCostCard, EmbroideryPriceCards } from '@admin/embroidery/ui';
import { Alert, Button, Link, Stack } from '@mui/material';

import type { useEmbroideryCalculation } from '../../hooks/calculation/use-embroidery-calculation';
import type { ComponentProps } from 'react';

type PriceCardsProps = ComponentProps<typeof EmbroideryPriceCards>;

interface Props {
  calculator: ReturnType<typeof useEmbroideryCalculation>;
  seesCost: boolean;
  onOpenSettings: () => void;
  onCopy: PriceCardsProps['onCopy'];
  onSave: PriceCardsProps['onSave'];
}

/** The live prices with the cost card, or the request error with «Повторити». */
export function EmbroideryCalculationPrices({
  calculator,
  seesCost,
  onOpenSettings,
  onCopy,
  onSave,
}: Props) {
  const { values, calculation } = calculator;
  return (
    <Stack sx={{ gap: 2 }}>
      {calculator.requestError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={calculator.retry}>
              Повторити
            </Button>
          }
        >
          {calculator.requestError}
        </Alert>
      ) : (
        <EmbroideryPriceCards
          prices={calculation?.prices ?? []}
          quantity={values.quantity}
          error={calculation?.error ?? null}
          missing={calculation?.missing ?? []}
          missingAction={
            seesCost ? (
              <Link component="button" type="button" onClick={onOpenSettings}>
                Заповнити в «Налаштуваннях»
              </Link>
            ) : (
              'Попросіть директора заповнити «Налаштування».'
            )
          }
          waiting={calculator.waiting}
          fetching={calculator.fetching}
          onCopy={onCopy}
          onSave={onSave}
        />
      )}
      {calculation?.cost && <EmbroideryCostCard cost={calculation.cost} />}
    </Stack>
  );
}
