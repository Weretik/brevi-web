import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { useGarmentPartOperationEditor } from '../../hooks/use-garment-part-operation-editor';

import type { GarmentPartOperationDialogMode } from '../../hooks/use-garment-part-operation-editor';
import type { GarmentPart, GarmentPartOperation } from '@admin/references/data-access';

interface Props {
  mode: GarmentPartOperationDialogMode;
  operation: GarmentPartOperation | null;
  garmentParts: GarmentPart[];
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

export function GarmentPartOperationDialog({
  mode: initialMode,
  operation,
  garmentParts,
  nextId,
  onClose,
  onSaved,
}: Props) {
  const { mode, draft, errors, message, saving, change, save, enableEditing } =
    useGarmentPartOperationEditor(initialMode, operation, nextId, onSaved);
  const readOnly = mode === 'view';
  const title =
    mode === 'create' ? 'Нова робота' : readOnly ? 'Перегляд роботи' : 'Редагування роботи';

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="garment-part-operation-dialog-title"
    >
      <DialogTitle id="garment-part-operation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="garment-part-operation-form"
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
              select
              label="Елемент"
              value={draft.garmentPartName}
              onChange={(event) => change('garmentPartName', event.target.value)}
              disabled={readOnly}
              error={Boolean(errors.garmentPartName)}
              helperText={errors.garmentPartName}
            >
              {operation &&
                !garmentParts.some((part) => part.name === operation.garmentPartName) && (
                  <MenuItem value={operation.garmentPartName}>{operation.garmentPartName}</MenuItem>
                )}
              {garmentParts.map((part) => (
                <MenuItem key={part.id} value={part.name}>
                  {part.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Назва"
              value={draft.name}
              onChange={(event) => change('name', event.target.value)}
              disabled={readOnly}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
            <TextField
              label="Хвилини (Min)"
              type="number"
              value={draft.min}
              onChange={(event) => change('min', event.target.value)}
              disabled={readOnly}
              error={Boolean(errors.min)}
              helperText={errors.min}
              slotProps={{ htmlInput: { min: 0, step: 'any' } }}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
        {readOnly ? (
          <Button onClick={enableEditing}>Редагувати</Button>
        ) : (
          <Button
            variant="contained"
            type="submit"
            form="garment-part-operation-form"
            disabled={saving}
          >
            Зберегти
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
