import {
  createSewingOperationFormValues,
  sewingOperationFromForm,
  validateSewingOperationForm,
} from '@admin/products/model';
import { SewingOperationForm } from '@admin/products/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import { useSewingReferenceOptions } from '../../hooks/sewing-model/use-sewing-reference-options';

import type { SewingOperationDraft } from '@admin/products/model';

interface Props {
  operation: SewingOperationDraft | null;
  operations: readonly SewingOperationDraft[];
  readOnly: boolean;
  saving: boolean;
  error: string | null;
  onEdit: () => void;
  onClose: () => void;
  onSave: (operations: SewingOperationDraft[]) => Promise<boolean>;
}

/** Right side panel of one line of «Трудовитрати»; saving replaces the shared operations. */
export function SewingOperationDrawer(props: Props) {
  const { operation, operations } = props;
  const references = useSewingReferenceOptions('operations');
  const [values, setValues] = useState(() => createSewingOperationFormValues(operation));
  const [errors, setErrors] = useState<ReturnType<typeof validateSewingOperationForm>>({});

  const submit = async () => {
    const found = validateSewingOperationForm(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    const line = sewingOperationFromForm(
      values,
      operation?.clientId ?? `operation-new-${operations.length}`,
      operation?.sortOrder ?? operations.length,
    );
    const next = operation
      ? operations.map((item) => (item.clientId === operation.clientId ? line : item))
      : [...operations, line];
    if (await props.onSave(next)) props.onClose();
  };

  return (
    <ReferenceEditorDrawer
      titleId="sewing-operation-title"
      title={operation ? 'Операція моделі' : 'Нова операція'}
      description="Спільна для всіх тканин моделі."
      formId="sewing-operation-form"
      paperWidth={480}
      readOnly={props.readOnly}
      saving={props.saving}
      onClose={props.onClose}
      onEdit={props.onEdit}
      onSubmit={submit}
    >
      <Stack sx={{ gap: 2 }}>
        {(props.error ?? references.error) && (
          <Alert severity="error">{props.error ?? references.error}</Alert>
        )}
        <SewingOperationForm
          values={values}
          errors={errors}
          operations={references.operations}
          loading={references.loading}
          readOnly={props.readOnly}
          disabled={props.saving}
          onChange={setValues}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
