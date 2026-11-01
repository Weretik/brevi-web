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

import { DeliveryResolutionFields } from '../../../forms/documents/delivery/delivery-resolution-fields';

import type {
  DeliveryResolutionDraft,
  DeliveryResolutionErrors,
  QuoteDeliveryView,
} from '@admin/clients/model';

export function ResolveDeliveryDialog({
  delivery,
  versionLabel,
  value,
  errors,
  locked,
  canConfirm,
  error,
  uncertain,
  retryDisabled,
  onChange,
  onClose,
  onConfirm,
  onRetry,
  onRefresh,
}: {
  delivery: QuoteDeliveryView | null;
  versionLabel: string;
  value: DeliveryResolutionDraft;
  errors: DeliveryResolutionErrors;
  locked: boolean;
  canConfirm: boolean;
  error: string;
  uncertain: boolean;
  retryDisabled: boolean;
  onChange: (value: DeliveryResolutionDraft) => void;
  onClose: () => void;
  onConfirm: () => void;
  onRetry: () => void;
  onRefresh: () => void;
}) {
  return (
    <Dialog
      open={!!delivery}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="resolve-delivery-title"
    >
      <DialogTitle id="resolve-delivery-title">Зафіксувати перевірений результат</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography>
            {delivery?.recipient} · {versionLabel} · Спроба {delivery?.attempt}
          </Typography>
          <Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>
            Версія: {delivery?.versionId}
          </Typography>
          <Alert severity="info">
            Перевірте точний лист і одержувача у Gmail вручну. Відсутність листа в папці сама по
            собі не підтверджує, що його не надіслано. Ця дія записує результат перевірки.
          </Alert>
          <DeliveryResolutionFields
            value={value}
            errors={errors}
            locked={locked}
            onChange={onChange}
          />
          {!!error && <Alert severity="error">{error}</Alert>}
          {uncertain && (
            <Alert severity="warning">
              Результат запису невідомий. Повторіть той самий запит до зміни даних.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap' }}>
        <Button disabled={locked} onClick={onClose}>
          Скасувати
        </Button>
        {!uncertain && !!error && (
          <Button disabled={locked} onClick={onRefresh}>
            Оновити спробу
          </Button>
        )}
        {uncertain ? (
          <Button disabled={retryDisabled || !delivery} onClick={onRetry}>
            Повторити той самий запит
          </Button>
        ) : (
          <Button variant="contained" disabled={!canConfirm} onClick={onConfirm}>
            Підтвердити результат перевірки
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
