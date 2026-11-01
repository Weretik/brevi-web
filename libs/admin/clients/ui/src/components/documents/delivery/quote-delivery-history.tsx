import { Alert, Button, Chip, List, ListItem, Stack, Typography } from '@mui/material';

import type { QuoteDeliveryView } from '@admin/clients/model';

const labels: Record<QuoteDeliveryView['state'], string> = {
  queued: 'У черзі',
  sending: 'Надсилання',
  reconciling: 'Перевірка результату',
  unknown: 'Результат невідомий',
  succeeded: 'Прийнято поштовим провайдером',
  failed: 'Не надіслано',
};
export function QuoteDeliveryHistory({
  rows,
  currentVersionId,
  disabled = false,
  onReview,
}: {
  rows: readonly QuoteDeliveryView[];
  currentVersionId: string;
  disabled?: boolean;
  onReview?: (delivery: QuoteDeliveryView) => void;
}) {
  if (rows.length === 0) return <Alert severity="info">Історія надсилань порожня.</Alert>;
  return (
    <List aria-label="Історія надсилань КП">
      {rows.map((row) => (
        <ListItem key={row.id} divider>
          <Stack spacing={1} sx={{ minWidth: 0, width: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ alignItems: { sm: 'center' } }}
            >
              <Typography sx={{ overflowWrap: 'anywhere' }}>{row.recipient}</Typography>
              <Chip
                size="small"
                label={
                  row.manualResolution
                    ? row.manualResolution.outcome === 'sent'
                      ? 'Надсилання підтверджено вручну'
                      : 'Ненадсилання підтверджено вручну'
                    : labels[row.state]
                }
                color={
                  row.state === 'succeeded'
                    ? 'success'
                    : row.state === 'failed'
                      ? 'error'
                      : 'default'
                }
              />
            </Stack>
            <Typography variant="caption">
              {row.versionId === currentVersionId
                ? 'Поточна версія КП'
                : 'Інша збережена версія КП'}{' '}
              · Спроб: {row.attempt} · {new Date(row.createdAt).toLocaleString('uk-UA')}
            </Typography>
            {row.state === 'unknown' && (
              <Alert severity="warning">
                Результат надсилання невідомий. Перевірте папку «Надіслані» у Gmail вручну. Не
                створюйте повторну відправку.
              </Alert>
            )}
            {row.state === 'failed' && !row.manualResolution && (
              <Alert severity="error">
                Лист не було підтверджено. Перевірте поштовий сервіс і дані перед новою явною
                спробою.
              </Alert>
            )}
            {row.manualResolution && (
              <Stack spacing={0.5}>
                <Typography variant="caption">
                  Перевірив користувач {row.manualResolution.actorId} ·{' '}
                  {new Date(row.manualResolution.createdAt).toLocaleString('uk-UA')}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                  {row.manualResolution.evidenceNote}
                </Typography>
              </Stack>
            )}
            {row.canResolveManually && onReview && (
              <Button type="button" disabled={disabled} onClick={() => onReview(row)}>
                Зафіксувати перевірений результат
              </Button>
            )}
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}
