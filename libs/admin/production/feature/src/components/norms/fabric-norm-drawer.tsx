import { FabricNormDetails, FabricNormForm } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useFabricNormEditor } from '../../hooks/norms/use-fabric-norm-editor';

import type { FabricNormRow } from '@admin/production/model';

interface Props {
  mode: 'view' | 'edit';
  row: FabricNormRow;
  onClose: () => void;
  onSaved: () => void;
}

export function FabricNormDrawer({ mode, row, onClose, onSaved }: Props) {
  const editor = useFabricNormEditor(mode, row, onSaved);
  const readOnly = editor.mode === 'view';
  const title = `${row.modelCode}${row.modelName ? ` · ${row.modelName}` : ''}`;
  return (
    <ReferenceEditorDrawer
      titleId="fabric-norm-drawer-title"
      title={title}
      description={
        readOnly
          ? 'Скільки тканини йде на один виріб.'
          : 'Метри на один виріб. Заповніть ті варіанти, які шиєте.'
      }
      formId="fabric-norm-form"
      paperWidth={520}
      readOnly={readOnly}
      saving={editor.saving}
      editLabel={row.modelName ? (row.norm ? 'Редагувати' : 'Задати норму') : null}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {editor.errors.norm && <Alert severity="error">{editor.errors.norm}</Alert>}
        {readOnly ? (
          <FabricNormDetails row={row} />
        ) : (
          <FabricNormForm values={editor.values} errors={editor.errors} onChange={editor.change} />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
