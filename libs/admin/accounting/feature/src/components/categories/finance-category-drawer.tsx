import { financeCategoryParents } from '@admin/accounting/model';
import {
  FinanceCategoryDetails,
  FinanceCategoryForm,
  FinanceHistoryList,
} from '@admin/accounting/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';

import { useFinanceCategoryEditor } from '../../hooks/categories/use-finance-category-editor';

import type { FinanceCategoryEditorMode } from '../../hooks/categories/use-finance-category-editor';
import type {
  CategoryDirection,
  FinanceCategory,
  FinanceCategoryRow,
  LedgerScope,
} from '@admin/accounting/model';

interface Props {
  mode: FinanceCategoryEditorMode;
  category: FinanceCategoryRow | null;
  all: FinanceCategory[];
  scope: LedgerScope;
  direction: CategoryDirection;
  newParentId: string | null;
  newSortOrder: number;
  onAddChild: (parent: FinanceCategoryRow) => void;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const titles: Record<FinanceCategoryEditorMode, string> = {
  create: 'Нова категорія',
  view: 'Категорія',
  edit: 'Редагування категорії',
};

export function FinanceCategoryDrawer({
  mode,
  category,
  all,
  scope,
  direction,
  newParentId,
  newSortOrder,
  onAddChild,
  onClose,
  onSaved,
}: Props) {
  const editor = useFinanceCategoryEditor(
    mode,
    category,
    scope,
    direction,
    newParentId,
    newSortOrder,
    onSaved,
  );
  const readOnly = editor.mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="finance-category-drawer-title"
      title={titles[editor.mode]}
      description={
        readOnly
          ? 'Перевірте категорію або перейдіть до редагування.'
          : 'Два рівні: коренева категорія і підкатегорії в ній.'
      }
      formId="finance-category-form"
      paperWidth={520}
      readOnly={readOnly}
      saving={editor.saving}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly && category ? (
          <>
            <FinanceCategoryDetails category={category} />
            {category.level === 0 && (
              <Stack direction="row">
                <Button variant="outlined" onClick={() => onAddChild(category)}>
                  Додати підкатегорію
                </Button>
              </Stack>
            )}
            <ReferenceFormSection title="Історія змін">
              <FinanceHistoryList {...editor.history} />
            </ReferenceFormSection>
          </>
        ) : (
          <FinanceCategoryForm
            values={editor.values}
            errors={editor.errors}
            parents={financeCategoryParents(all, scope, editor.values.direction)}
            creating={!category}
            onChange={editor.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
