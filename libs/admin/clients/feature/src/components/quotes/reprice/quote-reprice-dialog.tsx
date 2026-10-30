import { QuotePriceComparison } from '@admin/clients/ui';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import { useQuoteReprice } from '../../../hooks/quotes/reprice/use-quote-reprice';

import type { QuoteDetail, QuoteLifecycleIntent } from '@admin/clients/model';

export function QuoteRepriceDialog({
  detail,
  pending,
  uncertain,
  error,
  onCancel,
  onConfirm,
  onRetry,
}: {
  detail: QuoteDetail;
  pending: boolean;
  uncertain: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: (intent: QuoteLifecycleIntent) => void;
  onRetry: () => void;
}) {
  const preview = useQuoteReprice(detail);
  const locked = pending || uncertain;
  const confirm = () => {
    if (locked || !preview.ready || preview.rows.some((row) => row.next.expiresAt <= Date.now()))
      return;
    onConfirm({
      action: 'reprice',
      quoteId: detail.publicId,
      revision: detail.revision,
      versionId: detail.versionId,
      bases: preview.rows.map((row) => ({ variantId: row.variantId, basisToken: row.next.token })),
    });
  };
  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      onClose={() => {
        if (!locked) onCancel();
      }}
      aria-labelledby="quote-reprice-title"
    >
      <DialogTitle id="quote-reprice-title">Перерахувати ціни КП</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography>
            Порівняйте збережену версію {detail.versionNumber} з актуальними цінами. Підтвердження
            збереже нову версію.
          </Typography>
          <Button disabled={locked || preview.pending} onClick={() => void preview.run()}>
            {preview.pending
              ? `Розрахунок ${preview.progress}/${preview.total}…`
              : 'Оновити порівняння'}
          </Button>
          {(error || preview.error) && <Alert severity="error">{error || preview.error}</Alert>}
          {preview.rows.map((row) => (
            <QuotePriceComparison
              key={row.variantId}
              title={row.title}
              previous={row.previous}
              next={row.next}
            />
          ))}
          {!!preview.rows.length && !preview.ready && !preview.pending && (
            <Alert severity="warning">
              Порівняння прострочене або містить недоступні ціни. Оновіть його перед підтвердженням.
            </Alert>
          )}
          {uncertain && (
            <Alert severity="warning">
              Результат запису невідомий. Повтор перевірить початкове підтвердження.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={locked} onClick={onCancel}>
          Скасувати
        </Button>
        {uncertain ? (
          <Button disabled={pending} onClick={onRetry}>
            Перевірити результат повтором
          </Button>
        ) : (
          <Button variant="contained" disabled={pending || !preview.ready} onClick={confirm}>
            Підтвердити нову версію
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
