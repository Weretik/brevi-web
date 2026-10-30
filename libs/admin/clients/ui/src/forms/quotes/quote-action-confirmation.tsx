import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';

import type { ReactNode } from 'react';

export function QuoteActionConfirmation({
  title,
  pending,
  uncertain,
  error,
  valid,
  onCancel,
  onConfirm,
  onRetry,
  children,
}: {
  title: string;
  pending: boolean;
  uncertain: boolean;
  error: string;
  valid: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onRetry: () => void;
  children: ReactNode;
}) {
  const locked = pending || uncertain;
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      onClose={() => {
        if (!locked) onCancel();
      }}
      aria-labelledby="quote-action-title"
    >
      <DialogTitle id="quote-action-title">{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {children}
          {error && <Alert severity="error">{error}</Alert>}
          {uncertain && (
            <Alert severity="warning">
              Результат дії невідомий. Перевірте його повтором того самого запиту.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={locked} onClick={onCancel}>
          Скасувати
        </Button>
        {uncertain ? (
          <Button variant="contained" disabled={pending} onClick={onRetry}>
            Перевірити результат повтором
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={pending || !valid}
            onClick={() => {
              if (!locked && valid) onConfirm();
            }}
          >
            {pending ? 'Виконання…' : title}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
