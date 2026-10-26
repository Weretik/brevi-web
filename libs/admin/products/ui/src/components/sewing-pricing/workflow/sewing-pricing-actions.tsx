import { Alert, Button, CircularProgress, Typography, Stack } from '@mui/material';

import type { SewingPricingPanelProps } from '../sewing-pricing-panel-props';

export function SewingPricingActions(
  props: Pick<
    SewingPricingPanelProps,
    | 'calculation'
    | 'dirty'
    | 'stale'
    | 'writeError'
    | 'alreadyPublished'
    | 'busy'
    | 'canManage'
    | 'onCalculate'
    | 'onPublish'
  >,
) {
  const { calculation } = props;
  return (
    <>
      {props.dirty && (
        <Alert severity="warning">Спочатку збережіть або відкиньте зміни складу.</Alert>
      )}
      {props.stale && (
        <Alert severity="warning">
          Дані змінилися. Розрахуйте ціну повторно перед публікацією.
        </Alert>
      )}
      {props.writeError && <Alert severity="error">{props.writeError}</Alert>}
      {props.alreadyPublished && (
        <Alert severity="info">
          Цей розрахунок уже публікувався. Актуальна ціна показана вище.
        </Alert>
      )}
      {props.busy && <CircularProgress size={22} aria-label="Збереження ціни" />}
      {props.canManage ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1 }}>
          <Button
            variant="outlined"
            disabled={props.busy || props.dirty}
            onClick={props.onCalculate}
          >
            Розрахувати ціну
          </Button>
          <Button
            variant="contained"
            disabled={
              props.busy ||
              props.dirty ||
              props.stale ||
              !calculation?.calculated ||
              props.alreadyPublished
            }
            onClick={props.onPublish}
          >
            Опублікувати ціну
          </Button>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Доступний перегляд опублікованої ціни.
        </Typography>
      )}
    </>
  );
}
