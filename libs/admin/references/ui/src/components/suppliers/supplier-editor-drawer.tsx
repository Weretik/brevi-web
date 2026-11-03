import { keepinCrmOwnedSupplierFields, supplierLinkHref } from '@admin/references/model';
import { Alert, FormControlLabel, Link, Stack, Switch, TextField } from '@mui/material';

import { ReferenceEditorDrawer } from '../reference-editor/reference-editor-drawer';

import type {
  SupplierDialogMode,
  SupplierDraft,
  SupplierField,
  SupplierFieldErrors,
} from '@admin/references/model';
import type { KeyboardEvent } from 'react';

interface Props {
  mode: SupplierDialogMode;
  draft: SupplierDraft;
  errors: SupplierFieldErrors;
  message: string | null;
  saving: boolean;
  /** KeepinCRM ID when the supplier's contacts come from KeepinCRM. */
  keepinCrmId?: string | null;
  onChange: (field: SupplierField, value: string | boolean) => void;
  onSave: () => void;
  onEnableEditing: () => void;
  onClose: () => void;
}

/** Supplier create/view/edit side panel, the same panel as the other reference tables. */
export function SupplierEditorDrawer({
  mode,
  draft,
  errors,
  message,
  saving,
  keepinCrmId = null,
  onChange,
  onSave,
  onEnableEditing,
  onClose,
}: Props) {
  function submitOnEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSave();
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
  const fields: {
    field: Exclude<SupplierField, 'id' | 'isActive'>;
    label: string;
    multiline?: boolean;
  }[] = [
    { field: 'name', label: 'Назва' },
    { field: 'purchaseCategories', label: 'Що закуповуємо' },
    { field: 'phoneNumber', label: 'Телефон' },
    { field: 'email', label: 'Email' },
    { field: 'contactPerson', label: 'Контактна особа' },
    { field: 'link', label: 'Сайт' },
    { field: 'notes', label: 'Нотатки', multiline: true },
  ];
  const keepinOwned = (field: SupplierField) =>
    Boolean(keepinCrmId) &&
    (keepinCrmOwnedSupplierFields as readonly SupplierField[]).includes(field);

  return (
    <ReferenceEditorDrawer
      titleId="supplier-drawer-title"
      title={title}
      description={
        readOnly
          ? 'Перевірте постачальника або перейдіть до редагування.'
          : 'Постачальник для ЗІЗ і матеріалів.'
      }
      formId="supplier-form"
      paperWidth={520}
      readOnly={readOnly}
      saving={saving}
      onClose={onClose}
      onEdit={onEnableEditing}
      onSubmit={onSave}
    >
      <Stack sx={{ gap: 2 }}>
        {message && <Alert severity="error">{message}</Alert>}
        {keepinCrmId && (
          <Alert severity="info">
            Картка оновлюється з KeepinCRM (ID {keepinCrmId}). У Brevi змінюються лише
            «Використовувати в проєкті» та нотатки.
          </Alert>
        )}
        <TextField
          label="ID"
          type="number"
          value={draft.id}
          onChange={(event) => onChange('id', event.target.value)}
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
            onChange={(event) => onChange(field, event.target.value)}
            onKeyDown={multiline ? undefined : submitOnEnter}
            disabled={readOnly || keepinOwned(field)}
            error={Boolean(errors[field])}
            helperText={errors[field]}
            multiline={multiline}
            minRows={multiline ? 3 : undefined}
          />
        ))}
        <FormControlLabel
          control={
            <Switch
              checked={draft.isActive}
              onChange={(event) => onChange('isActive', event.target.checked)}
              disabled={readOnly}
            />
          }
          label="Використовувати в проєкті"
        />
        {readOnly && linkHref && (
          <Link href={linkHref} target="_blank" rel="noopener noreferrer">
            {draft.link}
          </Link>
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
