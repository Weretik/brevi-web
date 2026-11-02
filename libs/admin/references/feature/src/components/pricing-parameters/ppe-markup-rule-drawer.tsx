import { PpeMarkupRuleDetails, PpeMarkupRuleForm, ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { usePpeMarkupRuleEditor } from '../../hooks/pricing-parameters/use-ppe-markup-rule-editor';

import type { PpeMarkupRule, PricingEditorMode } from '@admin/references/model';

interface Props {
  mode: PricingEditorMode;
  rule: PpeMarkupRule | null;
  newSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}

const titles: Record<PricingEditorMode, string> = {
  create: 'Нове правило націнки',
  view: 'Перегляд правила націнки',
  edit: 'Редагування правила націнки',
};

export function PpeMarkupRuleDrawer({ mode: initialMode, rule, newSortOrder, onClose, onSaved }: Props) {
  const editor = usePpeMarkupRuleEditor(initialMode, rule, newSortOrder, onSaved);
  const readOnly = editor.mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="ppe-markup-rule-drawer-title"
      title={titles[editor.mode]}
      description={
        readOnly
          ? 'Перевірте правило або перейдіть до редагування.'
          : 'Ціна ЗІЗ = ціна постачальника × (1 + націнка).'
      }
      formId="ppe-markup-rule-form"
      paperWidth={560}
      readOnly={readOnly}
      saving={editor.saving}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly && rule ? (
          <PpeMarkupRuleDetails rule={rule} />
        ) : (
          <PpeMarkupRuleForm
            creating={!rule}
            values={editor.values}
            errors={editor.errors}
            onChange={editor.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
