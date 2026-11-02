import {
  GarmentPartOperationDetails,
  GarmentPartOperationForm,
  ReferenceEditorDrawer,
} from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useGarmentPartOperationEditor } from '../../hooks/garment-part-operations/use-garment-part-operation-editor';

import type { GarmentPartOperationEditorMode } from '../../hooks/garment-part-operations/use-garment-part-operation-editor';
import type { GarmentPartOperation, OperationLabourRates } from '@admin/references/model';

interface Props {
  mode: GarmentPartOperationEditorMode;
  operation: GarmentPartOperation | null;
  rates: OperationLabourRates | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
}

const titles: Record<GarmentPartOperationEditorMode, string> = {
  create: 'Нова операція',
  view: 'Перегляд операції',
  edit: 'Редагування операції',
};

export function GarmentPartOperationDrawer({
  mode: initialMode,
  operation,
  rates,
  nextId,
  onClose,
  onSaved,
}: Props) {
  const editor = useGarmentPartOperationEditor(initialMode, operation, nextId, onSaved);
  const readOnly = editor.mode === 'view' && operation !== null;

  return (
    <ReferenceEditorDrawer
      titleId="garment-part-operation-drawer-title"
      title={titles[editor.mode]}
      description={
        readOnly
          ? 'Перевірте дані операції або перейдіть до редагування.'
          : 'Вкажіть групу деталей, назву та норму часу.'
      }
      formId="garment-part-operation-form"
      paperWidth={640}
      readOnly={readOnly}
      saving={editor.saving}
      saveDisabled={editor.groupsLoading || Boolean(editor.groupsError)}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly && operation ? (
          <GarmentPartOperationDetails operation={operation} rates={rates} />
        ) : (
          <GarmentPartOperationForm
            creating={editor.mode === 'create'}
            values={editor.values}
            errors={editor.errors}
            groups={editor.groups}
            groupsLoading={editor.groupsLoading}
            groupsError={editor.groupsError}
            onChange={editor.change}
            onRetryGroups={editor.retryGroups}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
