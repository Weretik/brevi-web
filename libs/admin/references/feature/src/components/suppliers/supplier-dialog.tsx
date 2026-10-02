import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  TextField,
} from '@mui/material';

import { useSupplierEditor } from '../../hooks/suppliers/use-supplier-editor';

import type { SupplierDialogMode } from '../../hooks/suppliers/use-supplier-editor';
import type { SupplierField, Supplier } from '@admin/references/model';
import type { KeyboardEvent } from 'react';

interface Props {
  mode: SupplierDialogMode;
  supplier: Supplier | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

function supplierLinkHref(value: string): string | null {
  const raw = value.trim();
  if (!raw || (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw))) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function SupplierDialog({ mode: initialMode, supplier, nextId, onClose, onSaved }: Props) {
  const { mode, draft, errors, message, saving, change, save, enableEditing } = useSupplierEditor(
    initialMode,
    supplier,
    nextId,
    onSaved,
  );

  function submitOnEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      void save();
    }
  }

  const readOnly = mode === 'view';
  const linkHref = supplierLinkHref(draft.link);
  const title =
    mode === 'create'
      ? 'Новий постачальник'
      : readOnly
        ? 'Перегляд постачальника'
        : 'Редагування постачальника';
  const fields: { field: Exclude<SupplierField, 'id'>; label: string; multiline?: boolean }[] = [
    { field: 'name', label: 'Назва' },
    { field: 'phoneNumber', label: 'Телефон' },
    { field: 'contactPerson', label: 'Контактна особа' },
    { field: 'link', label: 'Посилання' },
    { field: 'notes', label: 'Нотатки', multiline: true },
  ];

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="supplier-dialog-title">
      <DialogTitle id="supplier-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="supplier-form"
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
              onKeyDown={submitOnEnter}
              disabled={mode !== 'create'}
              error={Boolean(errors.id)}
              helperText={errors.id}
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
            />
            {fields.map(({ field, label, multiline }) => (
              <TextField
                key={field}
                label={label}
                value={draft[field]}
                onChange={(event) => change(field, event.target.value)}
                onKeyDown={multiline ? undefined : submitOnEnter}
                disabled={readOnly}
                error={Boolean(errors[field])}
                helperText={errors[field]}
                multiline={multiline}
                minRows={multiline ? 3 : undefined}
              />
            ))}
            {readOnly && linkHref && (
              <Link href={linkHref} target="_blank" rel="noopener noreferrer">
                {draft.link}
              </Link>
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
        {readOnly ? (
          <Button onClick={enableEditing}>Редагувати</Button>
        ) : (
          <Button variant="contained" type="submit" form="supplier-form" disabled={saving}>
            Зберегти
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
