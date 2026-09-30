import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';

import { useGarmentAccessoryEditor } from '../../hooks/use-garment-accessory-editor';

import type { GarmentAccessoryDialogMode } from '../../hooks/use-garment-accessory-editor';
import type { GarmentAccessory } from '@admin/references/data-access';

interface Props {
  mode: GarmentAccessoryDialogMode;
  accessory: GarmentAccessory | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

export function GarmentAccessoryDialog({ mode: initialMode, accessory, nextId, onClose, onSaved }: Props) {
  const { mode, values, errors, message, saving, suppliers, supplierError, change, save, retrySuppliers, enableEditing } = useGarmentAccessoryEditor(initialMode, accessory, nextId, onSaved);
  const readOnly = mode === 'view';
  const title = mode === 'create' ? 'Нова фурнітура' : readOnly ? 'Перегляд фурнітури' : 'Редагування фурнітури';

  return <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="garment-accessory-dialog-title">
    <DialogTitle id="garment-accessory-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <Stack component="form" id="garment-accessory-form" onSubmit={(event) => { event.preventDefault(); void save(); }} sx={{ gap: 2, pt: 1 }}>
        {message && <Alert severity="error">{message}</Alert>}
        <TextField label="ID" type="number" value={values.id} onChange={(event) => change('id', event.target.value)} disabled={mode !== 'create'} error={Boolean(errors.id)} helperText={errors.id} slotProps={{ htmlInput: { min: 1, step: 1 } }} />
        <TextField label="Назва" value={values.name} onChange={(event) => change('name', event.target.value)} disabled={readOnly} error={Boolean(errors.name)} helperText={errors.name} />
        {supplierError && <Alert severity="error" action={<Button onClick={retrySuppliers}>Повторити</Button>}>{supplierError}</Alert>}
        <TextField select label="Постачальник" value={values.supplierName} onChange={(event) => change('supplierName', event.target.value)} disabled={readOnly || Boolean(supplierError)} error={Boolean(errors.supplierName)} helperText={errors.supplierName}>
          {values.supplierName && !suppliers.some((supplier) => supplier.name === values.supplierName) && <MenuItem value={values.supplierName}>{values.supplierName}</MenuItem>}
          {suppliers.map((supplier) => <MenuItem key={supplier.id} value={supplier.name}>{supplier.name}</MenuItem>)}
        </TextField>
        <TextField label="Ціна" type="number" value={values.price} onChange={(event) => change('price', event.target.value)} disabled={readOnly} error={Boolean(errors.price)} helperText={errors.price} slotProps={{ htmlInput: { min: 0, max: 10000, step: '0.01' } }} />
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Закрити</Button>
      {readOnly ? <Button onClick={enableEditing}>Редагувати</Button> : <Button variant="contained" type="submit" form="garment-accessory-form" disabled={saving}>Зберегти</Button>}
    </DialogActions>
  </Dialog>;
}
