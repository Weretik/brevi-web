import { formatMeters } from '@admin/warehouse/model';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';

import type { FabricMovementRow } from '@admin/warehouse/model';

/** «Прибрати з обліку» keeps the row with no effect and can be undone; «Сторно» writes the opposite movement. */
export type MovementCancelMode = 'void' | 'reverse';

interface Props {
  row: FabricMovementRow | null;
  mode: MovementCancelMode;
  /** The ways this movement may be cancelled; the dialog offers only these. */
  modes: readonly MovementCancelMode[];
  reason: string;
  error: string | null;
  busy: boolean;
  onMode: (mode: MovementCancelMode) => void;
  onChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const options: Record<MovementCancelMode, { label: string; text: string }> = {
  void: {
    label: 'Прибрати з обліку',
    text: 'Запис лишиться в журналі як «Прибрано з обліку» і не впливатиме на залишок. Повернути можна в «Історії правок».',
  },
  reverse: {
    label: 'Записати зворотну операцію (сторно)',
    text: 'Буде додано новий запис з протилежною кількістю сьогоднішньою датою. Обидва записи лишаться в журналі.',
  },
};

/**
 * «Відмінити операцію…»: one dialog for both ways of taking a movement back. The reason (3…500 characters) stays in
 * the history.
 */
export function MovementCancelDialog({
  row,
  mode,
  modes,
  reason,
  error,
  busy,
  onMode,
  onChange,
  onClose,
  onConfirm,
}: Props) {
  const back = row ? -row.delta : 0;
  return (
    <Dialog
      open={row !== null}
      fullWidth
      maxWidth="sm"
      onClose={busy ? undefined : onClose}
      aria-labelledby="movement-cancel-title"
    >
      <DialogTitle id="movement-cancel-title">Відмінити операцію?</DialogTitle>
      <DialogContent>
        {row && (
          <DialogContentText sx={{ mb: 2 }}>
            {row.fabricName}, {row.color}: залишок зміниться на{' '}
            {back > 0 ? '+' : back < 0 ? '−' : ''}
            {formatMeters(Math.abs(back))}.
          </DialogContentText>
        )}
        {modes.length > 1 ? (
          <RadioGroup
            aria-label="Як відмінити"
            value={mode}
            onChange={(event) => onMode(event.target.value as MovementCancelMode)}
            sx={{ mb: 2, gap: 1 }}
          >
            {modes.map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                disabled={busy}
                control={<Radio />}
                sx={{ alignItems: 'flex-start', '& .MuiRadio-root': { pt: 0.5 } }}
                label={
                  <>
                    <Typography variant="body1">{options[value].label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {options[value].text}
                    </Typography>
                  </>
                }
              />
            ))}
          </RadioGroup>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>{options[mode].label}.</strong> {options[mode].text}
          </Typography>
        )}
        <TextField
          label="Причина"
          required
          fullWidth
          multiline
          minRows={2}
          autoFocus
          value={reason}
          error={Boolean(error)}
          helperText={error}
          disabled={busy}
          onChange={(event) => onChange(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Не треба
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={busy}>
          {busy ? 'Відміняю…' : 'Відмінити операцію'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
