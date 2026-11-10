import { FabricColorDetails, FabricColorForm, ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useFabricColorEditor } from '../../hooks/fabric-colors/use-fabric-color-editor';

import type { FabricColor, PricingEditorMode } from '@admin/references/model';

interface Props {
  mode: PricingEditorMode;
  color: FabricColor | null;
  others: readonly FabricColor[];
  newSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}

const titles: Record<PricingEditorMode, string> = {
  create: 'Новий колір',
  view: 'Перегляд кольору',
  edit: 'Редагування кольору',
};

export function FabricColorDrawer({
  mode: initialMode,
  color,
  others,
  newSortOrder,
  onClose,
  onSaved,
}: Props) {
  const editor = useFabricColorEditor(initialMode, color, others, newSortOrder, onSaved);
  const readOnly = editor.mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="fabric-color-drawer-title"
      title={titles[editor.mode]}
      description={
        readOnly
          ? 'Перевірте колір або перейдіть до редагування.'
          : 'Колір тканини для позицій виробничих завдань і складу.'
      }
      formId="fabric-color-form"
      paperWidth={480}
      readOnly={readOnly}
      saving={editor.saving}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly && color ? (
          <FabricColorDetails color={color} />
        ) : (
          <FabricColorForm values={editor.values} errors={editor.errors} onChange={editor.change} />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
