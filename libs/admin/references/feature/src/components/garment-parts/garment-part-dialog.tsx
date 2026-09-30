import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

import { useGarmentPartEditor } from '../../hooks/use-garment-part-editor';

import type { GarmentPartDialogMode } from '../../hooks/use-garment-part-editor';
import type { GarmentPart } from '@admin/references/data-access';

interface Props {
  mode: GarmentPartDialogMode;
  garmentPart: GarmentPart | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

export function GarmentPartDialog({
  mode: initialMode,
  garmentPart,
  nextId,
  onClose,
  onSaved,
}: Props) {
  const { mode, draft, errors, message, saving, change, save, enableEditing } =
    useGarmentPartEditor(initialMode, garmentPart, nextId, onSaved);
  const readOnly = mode === 'view';
  const title =
    mode === 'create'
      ? 'Новий елемент виробу'
      : readOnly
        ? 'Перегляд елемента виробу'
        : 'Редагування елемента виробу';

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="garment-part-dialog-title"
    >
      <DialogTitle id="garment-part-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="garment-part-form"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <Stack sx={{ gap: 2, pt: 1 }}>
            {message && <Alert severity="error">{message}</Alert>}
            <TextField
              label="ID"
              type="number"
              value={draft.id}
              onChange={(event) => change('id', event.target.value)}
              disabled={mode !== 'create'}
              error={Boolean(errors.id)}
              helperText={errors.id}
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
            />
            <TextField
              label="Назва"
              value={draft.name}
              onChange={(event) => change('name', event.target.value)}
              disabled={readOnly}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
        {readOnly ? (
          <Button onClick={enableEditing}>Редагувати</Button>
        ) : (
          <Button variant="contained" type="submit" form="garment-part-form" disabled={saving}>
            Зберегти
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
