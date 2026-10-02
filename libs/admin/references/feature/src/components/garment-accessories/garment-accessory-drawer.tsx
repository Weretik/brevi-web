import {
  GarmentAccessoryDetails,
  GarmentAccessoryForm,
  ReferenceEditorDrawer,
} from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useGarmentAccessoryEditor } from '../../hooks/garment-accessories/use-garment-accessory-editor';

import type { GarmentAccessoryEditorMode } from '../../hooks/garment-accessories/use-garment-accessory-editor';
import type { GarmentAccessory } from '@admin/references/model';

interface Props {
  mode: GarmentAccessoryEditorMode;
  accessory: GarmentAccessory | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

const titles: Record<GarmentAccessoryEditorMode, string> = {
  create: 'Нова фурнітура',
  view: 'Перегляд фурнітури',
  edit: 'Редагування фурнітури',
};

export function GarmentAccessoryDrawer({
  mode: initialMode,
  accessory,
  nextId,
  onClose,
  onSaved,
}: Props) {
  const editor = useGarmentAccessoryEditor(initialMode, accessory, nextId, onSaved);
  const readOnly = editor.mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="garment-accessory-drawer-title"
      title={titles[editor.mode]}
      description={
        readOnly
          ? 'Перевірте дані фурнітури або перейдіть до редагування.'
          : 'Заповніть основні дані, постачальника та ціну.'
      }
      formId="garment-accessory-form"
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
          <GarmentAccessoryDetails values={editor.values} />
        ) : (
          <GarmentAccessoryForm
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
