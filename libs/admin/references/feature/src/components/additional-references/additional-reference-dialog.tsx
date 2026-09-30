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

import { useAdditionalReferenceEditor } from '../../hooks/use-additional-reference-editor';
import { ADDITIONAL_REFERENCE_UNITS } from '../../model/additional-reference-validation';

import type { AdditionalReference } from '@admin/references/data-access';

interface Props {
  reference: AdditionalReference;
  onClose: () => void;
  onSaved: () => void;
}

export function AdditionalReferenceDialog({ reference, onClose, onSaved }: Props) {
  const { draft, errors, message, saving, change, save } = useAdditionalReferenceEditor(
    reference,
    onSaved,
  );
  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="additional-reference-dialog-title"
    >
      <DialogTitle id="additional-reference-dialog-title">
        Редагування додаткового довідника
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="additional-reference-form"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <Stack sx={{ gap: 2, pt: 1 }}>
            {message && <Alert severity="error">{message}</Alert>}
            <TextField label="ID" value={draft.id} disabled />
            <TextField
              label="Назва"
              value={draft.name}
              onChange={(event) => change('name', event.target.value)}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
            <TextField
              label="Ключ"
              value={draft.key}
              onChange={(event) => change('key', event.target.value)}
              error={Boolean(errors.key)}
              helperText={errors.key}
            />
            <TextField
              label="Значення"
              type="number"
              value={draft.value}
              onChange={(event) => change('value', event.target.value)}
              error={Boolean(errors.value)}
              helperText={errors.value}
              slotProps={{ htmlInput: { min: 0, step: 'any' } }}
            />
            <TextField
              select
              label="Одиниця"
              value={draft.unit}
              onChange={(event) => change('unit', event.target.value)}
              error={Boolean(errors.unit)}
              helperText={errors.unit}
            >
              {ADDITIONAL_REFERENCE_UNITS.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Опис"
              value={draft.description ?? ''}
              onChange={(event) => change('description', event.target.value)}
              error={Boolean(errors.description)}
              helperText={errors.description}
              multiline
              minRows={2}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button
          variant="contained"
          type="submit"
          form="additional-reference-form"
          disabled={saving}
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
