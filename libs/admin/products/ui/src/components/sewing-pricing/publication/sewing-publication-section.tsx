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
            Оновлено {new Date(published.publishedAt).toLocaleString('uk-UA')}
          </Typography>
          <SewingPriceTiersView prices={published.prices} />
        </>
      ) : (
        !props.publicationLoading &&
        !props.publicationError && (
          <Alert severity="info">
            Ціни ще немає: перевірте тканину, комплектацію і трудовитрати.
          </Alert>
        )
      )}
    </>
  );
}
