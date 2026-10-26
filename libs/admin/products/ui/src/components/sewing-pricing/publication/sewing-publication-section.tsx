import { Alert, Button, CircularProgress, Typography } from '@mui/material';

import { SewingPriceTiersView } from '../sewing-price-tiers';

import type { SewingPricingPanelProps } from '../sewing-pricing-panel-props';

export function SewingPublicationSection(
  props: Pick<
    SewingPricingPanelProps,
    'published' | 'publicationLoading' | 'publicationError' | 'onRetryPublication'
  >,
) {
  const { published } = props;
  return (
    <>
      <Typography variant="subtitle1" component="h4">
        Опублікована ціна
      </Typography>
      {props.publicationLoading && (
        <CircularProgress size={22} aria-label="Завантаження опублікованої ціни" />
      )}
      {props.publicationError && (
        <Alert
          severity="error"
          action={<Button onClick={props.onRetryPublication}>Повторити</Button>}
        >
          {props.publicationError}
        </Alert>
      )}
      {published ? (
        <>
          <Typography variant="body2">
            Опубліковано {new Date(published.publishedAt).toLocaleString('uk-UA')}
          </Typography>
          <SewingPriceTiersView prices={published.prices} />
        </>
      ) : (
        !props.publicationLoading &&
        !props.publicationError && <Alert severity="info">Ціну ще не опубліковано.</Alert>
      )}
    </>
  );
}
