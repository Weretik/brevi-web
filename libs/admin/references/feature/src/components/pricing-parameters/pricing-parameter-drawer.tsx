import {
  PricingParameterDetails,
  PricingParameterForm,
  ReferenceEditorDrawer,
} from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { usePricingParameterEditor } from '../../hooks/pricing-parameters/use-pricing-parameter-editor';

import type { PricingEditorMode, PricingParameter } from '@admin/references/model';

interface Props {
  mode: PricingEditorMode;
  parameter: PricingParameter | null;
  newSortOrder: number;
  groups: string[];
  units: string[];
  onClose: () => void;
  onSaved: () => void;
}

const titles: Record<PricingEditorMode, string> = {
  create: 'Новий параметр',
  view: 'Перегляд параметра',
  edit: 'Редагування параметра',
};

export function PricingParameterDrawer({
  mode: initialMode,
  parameter,
  newSortOrder,
  groups,
  units,
  onClose,
  onSaved,
}: Props) {
  const editor = usePricingParameterEditor(initialMode, parameter, newSortOrder, onSaved);
  const readOnly = editor.mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="pricing-parameter-drawer-title"
      title={titles[editor.mode]}
      description={
        readOnly
          ? 'Перевірте параметр або перейдіть до редагування.'
          : 'Число, з якого Brevi рахує ціни. Нове значення діє одразу, дата оновлення стане сьогоднішньою.'
      }
      formId="pricing-parameter-form"
      paperWidth={560}
      readOnly={readOnly}
      saving={editor.saving}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly && parameter ? (
          <PricingParameterDetails parameter={parameter} />
        ) : (
          <PricingParameterForm
            creating={!parameter}
            values={editor.values}
            errors={editor.errors}
            groups={groups}
            units={units}
            onChange={editor.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
