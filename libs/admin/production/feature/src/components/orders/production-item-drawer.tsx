import { formatMeters } from '@admin/production/model';
import { ProductionItemForm } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack, Typography } from '@mui/material';

import { useEmbroideryPicker } from '../../hooks/orders/use-embroidery-picker';

import type {
  ProductionItem,
  ProductionItemErrors,
  ProductionItemFormValues,
} from '@admin/production/model';

interface Props {
  item: ProductionItem;
  values: ProductionItemFormValues;
  errors: ProductionItemErrors;
  withRate: boolean;
  message: string | null;
  saving: boolean;
  onChange: (values: ProductionItemFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/** One position of the order: quantity, date, colours, sizes, changes and applications. */
export function ProductionItemDrawer({
  item,
  values,
  errors,
  withRate,
  message,
  saving,
  onChange,
  onClose,
  onSubmit,
}: Props) {
  const embroidery = useEmbroideryPicker();
  const fabric = [item.fabricCode, item.fabricName].filter(Boolean).join(' · ');
  return (
    <ReferenceEditorDrawer
      titleId="production-item-title"
      title={item.modelName}
      description={fabric ? `Тканина: ${fabric}` : 'Позиція завдання'}
      formId="production-item-form"
      paperWidth={640}
      readOnly={false}
      saving={saving}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={onSubmit}
    >
      <Stack sx={{ gap: 2 }}>
        {message && <Alert severity="error">{message}</Alert>}
        {item.plannedFabricMeters !== null && (
          <Typography variant="body2" color="text.secondary">
            Плановий розхід тканини зараз: {formatMeters(item.plannedFabricMeters)}. Після
            збереження перерахуємо за нормою.
          </Typography>
        )}
        <ProductionItemForm
          idPrefix={`item-${item.id}`}
          values={values}
          errors={errors}
          withRate={withRate}
          disabled={saving}
          embroidery={embroidery}
          onChange={onChange}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
