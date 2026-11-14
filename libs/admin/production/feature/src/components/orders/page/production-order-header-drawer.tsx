import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Stack, TextField } from '@mui/material';

import type {
  ProductionOrderHeaderErrors,
  ProductionOrderHeaderValues,
} from '@admin/production/model';

interface Props {
  number: number;
  values: ProductionOrderHeaderValues;
  errors: ProductionOrderHeaderErrors;
  message: string | null;
  saving: boolean;
  onChange: (values: ProductionOrderHeaderValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/** Client, date and comment of the order. */
export function ProductionOrderHeaderDrawer({
  number,
  values,
  errors,
  message,
  saving,
  onChange,
  onClose,
  onSubmit,
}: Props) {
  return (
    <ReferenceEditorDrawer
      titleId="production-order-header-title"
      title={`Завдання № ${number}`}
      description="Клієнт, дата і коментар. Кожна зміна потрапить в «Історію змін»."
      formId="production-order-header-form"
      paperWidth={520}
      readOnly={false}
      saving={saving}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={onSubmit}
    >
      <Stack sx={{ gap: 2 }}>
        {message && <Alert severity="error">{message}</Alert>}
        <ReferenceFormSection title="Завдання">
          <TextField
            label="Клієнт"
            required
            value={values.clientName}
            error={Boolean(errors.clientName)}
            helperText={errors.clientName}
            disabled={saving}
            onChange={(event) => onChange({ ...values, clientName: event.target.value })}
          />
          <TextField
            label="Дата створення"
            type="date"
            required
            value={values.orderDate}
            error={Boolean(errors.orderDate)}
            helperText={errors.orderDate}
            disabled={saving}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(event) => onChange({ ...values, orderDate: event.target.value })}
          />
          <TextField
            label="Коментар"
            multiline
            minRows={2}
            value={values.comment}
            disabled={saving}
            onChange={(event) => onChange({ ...values, comment: event.target.value })}
          />
        </ReferenceFormSection>
      </Stack>
    </ReferenceEditorDrawer>
  );
}
