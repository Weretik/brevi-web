import {
  ProductSectionDetails,
  ProductSectionForm,
  ReferenceEditorDrawer,
} from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useProductSectionEditor } from '../../hooks/product-sections/use-product-section-editor';

import type {
  PricingEditorMode,
  ProductSection,
  ProductSectionType,
} from '@admin/references/model';

interface Props {
  mode: PricingEditorMode;
  section: ProductSection | null;
  newType: ProductSectionType;
  newSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}

const titles: Record<PricingEditorMode, string> = {
  create: 'Новий розділ',
  view: 'Перегляд розділу',
  edit: 'Редагування розділу',
};

export function ProductSectionDrawer({
  mode: initialMode,
  section,
  newType,
  newSortOrder,
  onClose,
  onSaved,
}: Props) {
  const editor = useProductSectionEditor(initialMode, section, newType, newSortOrder, onSaved);
  const readOnly = editor.mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="product-section-drawer-title"
      title={titles[editor.mode]}
      description={
        readOnly
          ? 'Перевірте розділ або перейдіть до редагування.'
          : 'Розділ групує товари одного типу.'
      }
      formId="product-section-form"
      paperWidth={520}
      readOnly={readOnly}
      saving={editor.saving}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly && section ? (
          <ProductSectionDetails section={section} />
        ) : (
          <ProductSectionForm
            values={editor.values}
            errors={editor.errors}
            onChange={editor.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
