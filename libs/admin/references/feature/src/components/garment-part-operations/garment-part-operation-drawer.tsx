import { ReferenceEditorDrawer } from '@admin/references/ui';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useGarmentPartOperationEditor } from '../../hooks/garment-part-operations/use-garment-part-operation-editor';

import type { GarmentPartOperationEditorMode } from '../../hooks/garment-part-operations/use-garment-part-operation-editor';
import type { GarmentPart, GarmentPartOperation } from '@admin/references/model';

interface Props {
  mode: GarmentPartOperationEditorMode;
  operation: GarmentPartOperation | null;
  garmentParts: GarmentPart[];
  garmentPartsLoading: boolean;
  garmentPartsError: string | null;
  nextId: number;
  onRetryGarmentParts: () => void;
  onClose: () => void;
  onSaved: () => void;
}

const titles: Record<GarmentPartOperationEditorMode, string> = {
  create: 'Нова робота',
  view: 'Перегляд роботи',
  edit: 'Редагування роботи',
};

export function GarmentPartOperationDrawer({
  mode: initialMode,
  operation,
  garmentParts,
  garmentPartsLoading,
  garmentPartsError,
  nextId,
  onRetryGarmentParts,
  onClose,
  onSaved,
}: Props) {
  const { mode, draft, errors, message, saving, change, save, enableEditing } =
    useGarmentPartOperationEditor(initialMode, operation, nextId, onSaved);
  const readOnly = mode === 'view';
  const lookupUnavailable = garmentPartsLoading || Boolean(garmentPartsError);

  return (
    <ReferenceEditorDrawer
      titleId="garment-part-operation-drawer-title"
      title={titles[mode]}
      description={
        readOnly
          ? 'Перевірте параметри роботи або перейдіть до редагування.'
          : 'Вкажіть елемент виробу, назву та тривалість роботи.'
      }
      formId="garment-part-operation-form"
      paperWidth={600}
      readOnly={readOnly}
      saving={saving}
      saveDisabled={lookupUnavailable}
      onClose={onClose}
      onEdit={enableEditing}
      onSubmit={save}
    >
      <Stack sx={{ gap: 2 }}>
        {message && <Alert severity="error">{message}</Alert>}
        {readOnly ? (
          <>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography component="h3" variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Основні дані
              </Typography>
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
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography component="h3" variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Параметри виконання
              </Typography>
              <Stack sx={{ gap: 2.5 }}>
                <Box>
                  <Typography color="text.secondary" variant="caption">
                    Елемент
                  </Typography>
                  <Typography>{draft.garmentPartName}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="caption">
                    Хвилини (Min)
                  </Typography>
                  <Typography>{draft.min}</Typography>
                </Box>
              </Stack>
            </Paper>
          </>
        ) : (
          <>
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
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Stack sx={{ gap: 2 }}>
                <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Параметри виконання
                </Typography>
                {garmentPartsLoading && <Skeleton variant="rounded" height={56} />}
                {garmentPartsError && (
                  <Alert
                    severity="error"
                    action={
                      <Button type="button" onClick={onRetryGarmentParts}>
                        Повторити
                      </Button>
                    }
                  >
                    {garmentPartsError}
                  </Alert>
                )}
                {!garmentPartsLoading && !garmentPartsError && (
                  <TextField
                    select
                    label="Елемент"
                    value={draft.garmentPartName}
                    onChange={(event) => change('garmentPartName', event.target.value)}
                    error={Boolean(errors.garmentPartName)}
                    helperText={errors.garmentPartName}
                    fullWidth
                  >
                    {operation &&
                      !garmentParts.some((part) => part.name === operation.garmentPartName) && (
                        <MenuItem value={operation.garmentPartName}>
                          {operation.garmentPartName}
                        </MenuItem>
                      )}
                    {garmentParts.map((part) => (
                      <MenuItem key={part.id} value={part.name}>
                        {part.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                <TextField
                  label="Хвилини (Min)"
                  type="number"
                  value={draft.min}
                  onChange={(event) => change('min', event.target.value)}
                  error={Boolean(errors.min)}
                  helperText={errors.min}
                  slotProps={{ htmlInput: { min: 0, step: 'any' } }}
                  fullWidth
                />
              </Stack>
            </Paper>
          </>
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
