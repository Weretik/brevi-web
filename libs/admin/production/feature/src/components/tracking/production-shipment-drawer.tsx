import { ProductionShipmentForm } from '@admin/production/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import type {
  ProductionItem,
  ProductionShipmentErrors,
  ProductionShipmentFormValues,
} from '@admin/production/model';

interface Props {
  item: ProductionItem;
  values: ProductionShipmentFormValues;
  errors: ProductionShipmentErrors;
  message: string | null;
  saving: boolean;
  onChange: (values: ProductionShipmentFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/** «Відвантажити»: how much of the item went to the client and when. */
export function ProductionShipmentDrawer({
  item,
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
      titleId="production-shipment-title"
      title="Відвантажити"
      description={`${item.position}. ${item.modelName}`}
      formId="production-shipment-form"
      paperWidth={480}
      readOnly={false}
      saving={saving}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={onSubmit}
    >
      <Stack sx={{ gap: 2 }}>
        {message && <Alert severity="error">{message}</Alert>}
        <ReferenceFormSection title="Відвантаження">
          <ProductionShipmentForm
            values={values}
            errors={errors}
            remaining={item.quantity - item.shippedQuantity}
            disabled={saving}
            onChange={onChange}
          />
        </ReferenceFormSection>
      </Stack>
    </ReferenceEditorDrawer>
  );
}
