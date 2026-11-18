import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { SupplierCardFields } from './supplier-card-fields';
import { ReferenceEditorDrawer } from '../reference-editor/reference-editor-drawer';

import type {
  SupplierDialogMode,
  SupplierDraft,
  SupplierField,
  SupplierFieldErrors,
} from '@admin/references/model';
import type { ReactNode } from 'react';

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
  const readOnly = mode === 'view';
  const [tab, setTab] = useState<SupplierCardTab>('card');
  const withTabs = readOnly && (invoices !== undefined || finance !== undefined);
  const showInvoices = withTabs && tab === 'invoices' && invoices !== undefined;
  const showFinance = withTabs && tab === 'finance' && finance !== undefined;
  const showOther = showInvoices || showFinance;
  const title =
    mode === 'create'
      ? 'Новий постачальник'
      : readOnly
        ? 'Перегляд постачальника'
        : 'Редагування постачальника';
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
      <SupplierCardFields
        mode={mode}
        draft={draft}
        errors={errors}
        message={message}
        keepinCrmId={keepinCrmId}
        hidden={showOther}
        onChange={onChange}
        onSave={onSave}
      />
    </ReferenceEditorDrawer>
  );
}
