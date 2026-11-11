import { FabricNormForm } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useFabricNormEditor } from '../../hooks/norms/use-fabric-norm-editor';

import type { FabricNormRow } from '@admin/production/model';

interface Props {
  row: FabricNormRow;
  onClose: () => void;
  onSaved: () => void;
}

/** Edits the norm of a model; the work card of the page is the read-only view. */
export function FabricNormDrawer({ row, onClose, onSaved }: Props) {
  const editor = useFabricNormEditor('edit', row, onSaved);
  const title = `${row.modelCode}${row.modelName ? ` · ${row.modelName}` : ''}`;
  return (
    <ReferenceEditorDrawer
      titleId="fabric-norm-drawer-title"
      title={title}
      description="Метри на один виріб. Заповніть ті варіанти, які шиєте."
      formId="fabric-norm-form"
      paperWidth={520}
      readOnly={false}
      saving={editor.saving}
      editLabel={null}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {editor.errors.norm && <Alert severity="error">{editor.errors.norm}</Alert>}
        <FabricNormForm values={editor.values} errors={editor.errors} onChange={editor.change} />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
