import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export function QuoteDeliveryForm(props: {
  quoteLabel: string;
  pdfHash: string | null;
  templateLabel: string | null;
  recipient: string;
  manager: string;
  locked: boolean;
  canSend: boolean;
  onRecipient: (value: string) => void;
  onManager: (value: string) => void;
  onSend: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <Stack
      spacing={2}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
          event.preventDefault();
          if (props.canSend) setConfirming(true);
        }
      }}
    >
      <Typography variant="subtitle2">{props.quoteLabel}</Typography>
      <Typography>Шаблон листа: {props.templateLabel ?? 'не вибрано'}</Typography>
      {props.pdfHash && (
        <Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>
          PDF SHA-256: {props.pdfHash}
        </Typography>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Email одержувача"
          type="email"
          value={props.recipient}
          disabled={props.locked}
          onChange={(event) => props.onRecipient(event.target.value)}
          fullWidth
          slotProps={{ htmlInput: { maxLength: 254 } }}
        />
        <TextField
          label="Ім’я менеджера"
          value={props.manager}
          disabled={props.locked}
          onChange={(event) => props.onManager(event.target.value)}
          fullWidth
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
      </Stack>
      <Button
        type="button"
        variant="contained"
        disabled={!props.canSend}
        onClick={() => setConfirming(true)}
      >
        Підготувати надсилання
      </Button>
      <Dialog open={confirming} onClose={() => setConfirming(false)} fullWidth maxWidth="sm">
        <DialogTitle>Поставити лист у чергу?</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>{props.quoteLabel}</Typography>
            <Typography>Одержувач: {props.recipient}</Typography>
            <Typography>Шаблон: {props.templateLabel}</Typography>
            <Typography sx={{ overflowWrap: 'anywhere' }}>PDF SHA-256: {props.pdfHash}</Typography>
            <Alert severity="info">
              Постановка в чергу ще не означає надсилання. Результат з’явиться в історії.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setConfirming(false)}>
            Скасувати
          </Button>
          <Button
            type="button"
            disabled={!props.canSend}
            onClick={() => {
              setConfirming(false);
              props.onSend();
            }}
          >
            Підтвердити надсилання
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
