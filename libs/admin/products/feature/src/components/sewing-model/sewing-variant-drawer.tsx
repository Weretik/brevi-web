import {
  createSewingVariantFormValues,
  sewingVariantInput,
  validateSewingVariant,
} from '@admin/products/model';
import { SewingVariantForm } from '@admin/products/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import type { SewingArticle, SewingVariantInput } from '@admin/products/model';
import type { Fabric } from '@admin/references/model';

interface Props {
  variant: SewingArticle | null;
  variants: readonly SewingArticle[];
  fabrics: readonly Fabric[];
  version: number;
  readOnly: boolean;
  saving: boolean;
  error: string | null;
  onEdit: () => void;
  onClose: () => void;
  onSave: (articleId: number | null, input: SewingVariantInput) => Promise<boolean>;
}

/** Right side panel of one fabric of the model: view, add and change (CAT-015). */
export function SewingVariantDrawer(props: Props) {
  const { variant, variants } = props;
  const [values, setValues] = useState(() => createSewingVariantFormValues(variant, variants));
  const [errors, setErrors] = useState<ReturnType<typeof validateSewingVariant>>({});
  const others = variants.filter((item) => item.id !== variant?.id);

  const submit = async () => {
    const found = validateSewingVariant(
      values,
      others.map((item) => item.saleSku),
    );
    setErrors(found);
    if (Object.keys(found).length) return;
    const sortOrder =
      variant?.sortOrder ?? Math.max(-1, ...variants.map((item) => item.sortOrder)) + 1;
    if (
      await props.onSave(variant?.id ?? null, sewingVariantInput(values, sortOrder, props.version))
    )
      props.onClose();
  };

  return (
    <ReferenceEditorDrawer
      titleId="sewing-variant-title"
      title={variant ? 'Тканина моделі' : 'Нова тканина'}
      description="Тканина, розхід і артикул на сайті. Комплектація і трудовитрати спільні для всіх тканин."
      formId="sewing-variant-form"
      paperWidth={480}
      readOnly={props.readOnly}
      saving={props.saving}
      onClose={props.onClose}
      onEdit={props.onEdit}
      onSubmit={submit}
    >
      <Stack sx={{ gap: 2 }}>
        {props.error && <Alert severity="error">{props.error}</Alert>}
        <SewingVariantForm
          values={values}
          errors={errors}
          fabrics={props.fabrics}
          readOnly={props.readOnly}
          disabled={props.saving}
          onChange={setValues}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
