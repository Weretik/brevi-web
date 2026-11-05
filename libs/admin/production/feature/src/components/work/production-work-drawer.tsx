import { ProductionWorkForm } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useProductionWorkEditor } from '../../hooks/work/use-production-work-editor';

import type { WorkChoices, WorkItemChoice } from '@admin/production/model';

interface Props {
  choices: WorkChoices;
  /** From an item of the order card; null to pick any item of a «Нове» order. */
  item: WorkItemChoice | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export function ProductionWorkDrawer({ choices, item, onClose, onSaved }: Props) {
  const editor = useProductionWorkEditor(choices, item, onSaved);
  return (
    <ReferenceEditorDrawer
      titleId="production-work-title"
      title={item ? `Робота: № ${item.orderNumber} · ${item.modelName}` : 'Додати роботу'}
      description="Хто, що й скільки пошив або покроїв. Розцінка позиції збережеться з записом."
      formId="production-work-form"
      paperWidth={520}
      readOnly={false}
      editLabel={null}
      saving={editor.saving}
      submitLabel="Зберегти"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        <ProductionWorkForm
          values={editor.values}
          errors={editor.errors}
          choices={choices}
          fixedItem={item !== null}
          left={editor.left}
          today={editor.today}
          disabled={editor.saving}
          onChange={editor.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
