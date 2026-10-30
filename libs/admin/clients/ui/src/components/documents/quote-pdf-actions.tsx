import { Alert, Button, Stack, Typography } from '@mui/material';

import { quotePdfActions } from '@admin/clients/model';

import type { QuotePdfView } from '@admin/clients/model';

const statusText = {
  queued: 'PDF у черзі на створення.',
  processing: 'Створюємо PDF із закріпленої версії.',
  succeeded: 'PDF збережено. Завантаження повертає саме цей файл.',
  failed: 'PDF не створено. Можна повторити запит.',
} as const;

export function QuotePdfActions({
  artifact,
  canRequest,
  disabled,
  busy,
  error,
  onRender,
  onRefresh,
  onDownload,
}: {
  artifact: QuotePdfView | null;
  canRequest: boolean;
  disabled: boolean;
  busy: boolean;
  error: string | null;
  onRender: () => void;
  onRefresh: () => void;
  onDownload: () => void;
}) {
  const actions = quotePdfActions(artifact);
  return (
    <Stack spacing={2} aria-label="PDF комерційної пропозиції">
      <Typography variant="h6">PDF комерційної пропозиції</Typography>
      <Typography variant="body2" aria-live="polite">
        {artifact ? statusText[artifact.status] : 'Документ ще не створено.'}
      </Typography>
      {artifact?.status === 'failed' && artifact.errorCode === 'renderer_unavailable' && (
        <Alert severity="warning">Генератор PDF тимчасово недоступний.</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {artifact?.status === 'succeeded' && artifact.sha256 && (
        <Typography variant="caption">SHA-256: {artifact.sha256}</Typography>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        {actions.canRender && (
          <Button
            type="button"
            variant="contained"
            disabled={disabled || busy || !canRequest}
            onClick={onRender}
          >
            {artifact?.status === 'failed' ? 'Повторити створення PDF' : 'Створити PDF'}
          </Button>
        )}
        {actions.canRefresh && (
          <Button type="button" disabled={disabled || busy} onClick={onRefresh}>
            Оновити статус
          </Button>
        )}
        {actions.canDownload && (
          <Button
            type="button"
            variant="contained"
            disabled={disabled || busy}
            onClick={onDownload}
          >
            Завантажити PDF
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
