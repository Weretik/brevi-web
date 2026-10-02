import { FabricDetails, FabricForm, ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useFabricEditor } from '../../hooks/fabrics/use-fabric-editor';

import type { FabricEditorMode } from '../../hooks/fabrics/use-fabric-editor';
import type { Fabric } from '@admin/references/model';

interface Props {
  mode: FabricEditorMode;
  fabric: Fabric | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

const titles: Record<FabricEditorMode, string> = {
  create: 'Нова тканина',
  view: 'Перегляд тканини',
  edit: 'Редагування тканини',
};

export function FabricDrawer({ mode: initialMode, fabric, nextId, onClose, onSaved }: Props) {
  const editor = useFabricEditor(initialMode, fabric, nextId, onSaved);
  const readOnly = editor.mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="fabric-drawer-title"
      title={titles[editor.mode]}
      description={
        readOnly
          ? 'Перевірте дані тканини або перейдіть до редагування.'
          : 'Заповніть основні дані, постачальника та ціну.'
      }
      formId="fabric-form"
      paperWidth={600}
      readOnly={readOnly}
      saving={editor.saving}
      saveDisabled={editor.suppliersLoading || Boolean(editor.supplierError)}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly ? (
          <FabricDetails values={editor.values} />
        ) : (
          <FabricForm
            creating={editor.mode === 'create'}
            values={editor.values}
            errors={editor.errors}
            suppliers={editor.suppliers}
            suppliersLoading={editor.suppliersLoading}
            supplierError={editor.supplierError}
            onChange={editor.change}
            onRetrySuppliers={editor.retrySuppliers}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
