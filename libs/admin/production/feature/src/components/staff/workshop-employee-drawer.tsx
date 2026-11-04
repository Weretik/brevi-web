import { WorkshopEmployeeDetails, WorkshopEmployeeForm } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useWorkshopEmployeeEditor } from '../../hooks/staff/use-workshop-employee-editor';

import type { ProductionEditorMode } from '../../hooks/staff/use-workshop-employee-editor';
import type { WorkshopEmployee } from '@admin/production/model';

interface Props {
  mode: ProductionEditorMode;
  employee: WorkshopEmployee | null;
  onClose: () => void;
  onSaved: (employee: WorkshopEmployee) => void;
}

const titles: Record<ProductionEditorMode, string> = {
  create: 'Новий працівник',
  view: 'Працівник',
  edit: 'Редагування працівника',
};

export function WorkshopEmployeeDrawer({ mode: initialMode, employee, onClose, onSaved }: Props) {
  const editor = useWorkshopEmployeeEditor(initialMode, employee, onSaved);
  const readOnly = editor.mode === 'view';
  return (
    <ReferenceEditorDrawer
      titleId="workshop-employee-drawer-title"
      title={titles[editor.mode]}
      description="Працівники не входять у систему: роботу і години за них вносить начальник цеху."
      formId="workshop-employee-form"
      paperWidth={480}
      readOnly={readOnly}
      saving={editor.saving}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly && employee ? (
          <WorkshopEmployeeDetails employee={employee} />
        ) : (
          <WorkshopEmployeeForm
            values={editor.values}
            errors={editor.errors}
            onChange={editor.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
