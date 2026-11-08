import { keepinCrmOwnedSupplierFields, supplierLinkHref } from '@admin/references/model';
import { Alert, FormControlLabel, Link, Stack, Switch, Tab, Tabs, TextField } from '@mui/material';
import { useState } from 'react';

import { ReferenceEditorDrawer } from '../reference-editor/reference-editor-drawer';

import type {
  SupplierDialogMode,
  SupplierDraft,
  SupplierField,
  SupplierFieldErrors,
} from '@admin/references/model';
import type { KeyboardEvent, ReactNode } from 'react';

interface Props {
  mode: SupplierDialogMode;
  draft: SupplierDraft;
  errors: SupplierFieldErrors;
  message: string | null;
  saving: boolean;
  /** KeepinCRM ID when the supplier's contacts come from KeepinCRM. */
  keepinCrmId?: string | null;
  /** Tab «Рахунки на закупку» of the viewed card; the feature passes it to those who may see invoices. */
  invoices?: ReactNode;
  /** Tab «Фінанси» of the viewed card; the feature passes it to those with the «Бухгалтерія» right. */
  finance?: ReactNode;
  onChange: (field: SupplierField, value: string | boolean) => void;
  onSave: () => void;
  onEnableEditing: () => void;
  onClose: () => void;
}

type SupplierCardTab = 'card' | 'invoices' | 'finance';

/** Supplier create/view/edit side panel, the same panel as the other reference tables. */
export function SupplierEditorDrawer({
  mode,
  draft,
  errors,
  message,
  saving,
  keepinCrmId = null,
  invoices,
  finance,
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
  const [tab, setTab] = useState<SupplierCardTab>('card');
  const withTabs = readOnly && (invoices !== undefined || finance !== undefined);
  const showInvoices = withTabs && tab === 'invoices' && invoices !== undefined;
  const showFinance = withTabs && tab === 'finance' && finance !== undefined;
  const showOther = showInvoices || showFinance;
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
      paperWidth={finance !== undefined && readOnly ? 860 : withTabs ? 640 : 520}
      readOnly={readOnly}
      saving={saving}
      onClose={onClose}
      onEdit={onEnableEditing}
      onSubmit={onSave}
    >
      {withTabs && (
        <Tabs
          value={tab}
          aria-label="Картка постачальника"
          onChange={(_, next: SupplierCardTab) => setTab(next)}
          sx={{ mt: -2, mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="card" label="Картка" />
          {invoices !== undefined && <Tab value="invoices" label="Рахунки на закупку" />}
          {finance !== undefined && <Tab value="finance" label="Фінанси" />}
        </Tabs>
      )}
      {showInvoices && invoices}
      {showFinance && finance}
      <Stack sx={{ gap: 2, display: showOther ? 'none' : undefined }}>
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
