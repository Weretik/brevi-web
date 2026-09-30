import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';

import { useFabricEditor } from '../../hooks/use-fabric-editor';

import type { FabricDialogMode } from '../../hooks/use-fabric-editor';
import type { Fabric } from '@admin/references/data-access';

interface Props {
  mode: FabricDialogMode;
  fabric: Fabric | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

export function FabricDialog({ mode: initialMode, fabric, nextId, onClose, onSaved }: Props) {
  const { mode, values, errors, message, saving, suppliers, supplierError, change, save, retrySuppliers, enableEditing } = useFabricEditor(initialMode, fabric, nextId, onSaved);
  const readOnly = mode === 'view';
  const title = mode === 'create' ? 'Нова тканина' : readOnly ? 'Перегляд тканини' : 'Редагування тканини';

  return <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="fabric-dialog-title">
    <DialogTitle id="fabric-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <Stack component="form" id="fabric-form" onSubmit={(event) => { event.preventDefault(); void save(); }} sx={{ gap: 2, pt: 1 }}>
        {message && <Alert severity="error">{message}</Alert>}
        <TextField label="ID" type="number" value={values.id} onChange={(event) => change('id', event.target.value)} disabled={mode !== 'create'} error={Boolean(errors.id)} helperText={errors.id} slotProps={{ htmlInput: { min: 1, step: 1 } }} />
        <TextField label="Назва" value={values.name} onChange={(event) => change('name', event.target.value)} disabled={readOnly} error={Boolean(errors.name)} helperText={errors.name} />
        {supplierError && <Alert severity="error" action={<Button onClick={retrySuppliers}>Повторити</Button>}>{supplierError}</Alert>}
        <TextField select label="Постачальник" value={values.providerName} onChange={(event) => change('providerName', event.target.value)} disabled={readOnly || Boolean(supplierError)} error={Boolean(errors.providerName)} helperText={errors.providerName}>
          {values.providerName && !suppliers.some((supplier) => supplier.name === values.providerName) && <MenuItem value={values.providerName}>{values.providerName}</MenuItem>}
          {suppliers.map((supplier) => <MenuItem key={supplier.id} value={supplier.name}>{supplier.name}</MenuItem>)}
        </TextField>
        <TextField label="Ціна" type="number" value={values.price} onChange={(event) => change('price', event.target.value)} disabled={readOnly} error={Boolean(errors.price)} helperText={errors.price} slotProps={{ htmlInput: { min: 0, max: 10000, step: '0.01' } }} />
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Закрити</Button>
      {readOnly ? <Button onClick={enableEditing}>Редагувати</Button> : <Button variant="contained" type="submit" form="fabric-form" disabled={saving}>Зберегти</Button>}
    </DialogActions>
  </Dialog>;
}
