import { SupplierEditorDialog } from '@admin/references/ui';

import { useSupplierEditor } from '../../hooks/suppliers/use-supplier-editor';

import type { Supplier, SupplierDialogMode } from '@admin/references/model';

interface Props {
  mode: SupplierDialogMode;
  supplier: Supplier | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

export function SupplierDialog({ mode, supplier, nextId, onClose, onSaved }: Props) {
  const editor = useSupplierEditor(mode, supplier, nextId, onSaved);
  return (
    <SupplierEditorDialog
      mode={editor.mode}
      draft={editor.draft}
      errors={editor.errors}
      message={editor.message}
      saving={editor.saving}
      onChange={editor.change}
      onSave={() => void editor.save()}
      onEnableEditing={editor.enableEditing}
      onClose={onClose}
    />
  );
}
