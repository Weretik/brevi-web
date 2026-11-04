import {
  createSewingMaterialFormValues,
  sewingMaterialFromForm,
  validateSewingMaterialForm,
} from '@admin/products/model';
import { SewingMaterialForm } from '@admin/products/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import type { SewingMaterialDraft } from '@admin/products/model';
import type { Fabric, GarmentAccessory } from '@admin/references/model';

interface Props {
  material: SewingMaterialDraft | null;
  materials: readonly SewingMaterialDraft[];
  fabrics: readonly Fabric[];
  accessories: readonly GarmentAccessory[];
  readOnly: boolean;
  saving: boolean;
  error: string | null;
  onEdit: () => void;
  onClose: () => void;
  onSave: (materials: SewingMaterialDraft[]) => Promise<boolean>;
}

/** Right side panel of one line of «Комплектація»; saving replaces the shared composition. */
export function SewingMaterialDrawer(props: Props) {
  const { material, materials } = props;
  const [values, setValues] = useState(() => createSewingMaterialFormValues(material));
  const [errors, setErrors] = useState<ReturnType<typeof validateSewingMaterialForm>>({});

  const submit = async () => {
    const found = validateSewingMaterialForm(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    const line = sewingMaterialFromForm(
      values,
      material?.clientId ?? `material-new-${materials.length}`,
      material?.sortOrder ?? materials.length,
    );
    const next = material
      ? materials.map((item) => (item.clientId === material.clientId ? line : item))
      : [...materials, line];
    if (await props.onSave(next)) props.onClose();
  };

  return (
    <ReferenceEditorDrawer
      titleId="sewing-material-title"
      title={material ? 'Матеріал моделі' : 'Новий матеріал'}
      description="Спільний для всіх тканин моделі."
      formId="sewing-material-form"
      paperWidth={480}
      readOnly={props.readOnly}
      saving={props.saving}
      onClose={props.onClose}
      onEdit={props.onEdit}
      onSubmit={submit}
    >
      <Stack sx={{ gap: 2 }}>
        {props.error && <Alert severity="error">{props.error}</Alert>}
        <SewingMaterialForm
          values={values}
          errors={errors}
          fabrics={props.fabrics}
          accessories={props.accessories}
          readOnly={props.readOnly}
          disabled={props.saving}
          onChange={setValues}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
