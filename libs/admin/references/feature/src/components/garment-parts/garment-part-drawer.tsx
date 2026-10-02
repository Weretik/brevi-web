import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, Paper, Stack, TextField, Typography } from '@mui/material';

import { useGarmentPartEditor } from '../../hooks/garment-parts/use-garment-part-editor';

import type { GarmentPartEditorMode } from '../../hooks/garment-parts/use-garment-part-editor';
import type { GarmentPart } from '@admin/references/model';

interface Props {
  mode: GarmentPartEditorMode;
  garmentPart: GarmentPart | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

const titles: Record<GarmentPartEditorMode, string> = {
  create: 'Новий елемент виробу',
  view: 'Перегляд елемента виробу',
  edit: 'Редагування елемента виробу',
};

export function GarmentPartDrawer({
  mode: initialMode,
  garmentPart,
  nextId,
  onClose,
  onSaved,
}: Props) {
  const { mode, draft, errors, message, saving, change, save, enableEditing } =
    useGarmentPartEditor(initialMode, garmentPart, nextId, onSaved);
  const readOnly = mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="garment-part-drawer-title"
      title={titles[mode]}
      description={
        readOnly
          ? 'Перевірте дані елемента або перейдіть до редагування.'
          : 'Заповніть обов’язкові поля та збережіть зміни.'
      }
      formId="garment-part-form"
      paperWidth={520}
      readOnly={readOnly}
      saving={saving}
      onClose={onClose}
      onEdit={enableEditing}
      onSubmit={save}
    >
      <Stack sx={{ gap: 2 }}>
        {message && <Alert severity="error">{message}</Alert>}
        {readOnly ? (
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack sx={{ gap: 2.5 }}>
              <Box>
                <Typography color="text.secondary" variant="caption">
                  ID
                </Typography>
                <Typography>{draft.id}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="caption">
                  Назва
                </Typography>
                <Typography>{draft.name}</Typography>
              </Box>
            </Stack>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                Основні дані
              </Typography>
              <TextField
                label="ID"
                type="number"
                value={draft.id}
                onChange={(event) => change('id', event.target.value)}
                disabled={mode !== 'create'}
                error={Boolean(errors.id)}
                helperText={errors.id}
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
                fullWidth
              />
              <TextField
                label="Назва"
                value={draft.name}
                onChange={(event) => change('name', event.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
                autoFocus
                fullWidth
              />
            </Stack>
          </Paper>
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
