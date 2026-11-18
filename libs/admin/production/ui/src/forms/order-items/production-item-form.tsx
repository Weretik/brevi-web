import { formatMeters, plannedFabricMeters } from '@admin/production/model';
import { Box, Stack, TextField, Typography } from '@mui/material';

import { ProductionItemApplications } from './production-item-applications';
import { ProductionItemColors } from './production-item-colors';

import type { EmbroideryPicker } from './production-item-embroidery-field';
import type {
  FabricNormValues,
  ProductionItemErrors,
  ProductionItemFormValues,
} from '@admin/production/model';

interface Props {
  /** Prefix of input ids, unique on the page. */
  idPrefix: string;
  values: ProductionItemFormValues;
  errors: ProductionItemErrors;
  /** Active colours of «Кольори»: the main and additional colours are picked only from them. */
  colors: readonly string[];
  /**
   * The workshop norm of the model; shows the planned fabric. Undefined when the page does not
   * know it (the server recounts the plan on save).
   */
  norm?: FabricNormValues | null;
  /** Admin and the head of the workshop also set «Розцінка пошиття». */
  withRate: boolean;
  disabled?: boolean;
  /** «Розрахунок вишивки» for an embroidery. */
  embroidery?: EmbroideryPicker;
  onChange: (values: ProductionItemFormValues) => void;
}

/** What the manager fills in for an item: quantity, due date, colours, sizes, changes, applications. */
export function ProductionItemForm({
  idPrefix,
  values,
  errors,
  colors,
  norm,
  withRate,
  disabled = false,
  embroidery,
  onChange,
}: Props) {
  const set = <K extends keyof ProductionItemFormValues>(
    key: K,
    value: ProductionItemFormValues[K],
  ) => onChange({ ...values, [key]: value });
  const planned = plannedFabricMeters(norm ?? null, values);

  return (
    <Stack sx={{ gap: 2 }}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <TextField
          id={`${idPrefix}-quantity`}
          label="Кількість, шт."
          required
          disabled={disabled}
          value={values.quantity}
          error={Boolean(errors.quantity)}
          helperText={errors.quantity}
          slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          onChange={(event) => set('quantity', event.target.value)}
        />
        <TextField
          id={`${idPrefix}-due`}
          label="Готово до"
          type="date"
          required
          disabled={disabled}
          value={values.dueDate}
          error={Boolean(errors.dueDate)}
          helperText={errors.dueDate}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => set('dueDate', event.target.value)}
        />
      </Box>
      <ProductionItemColors
        idPrefix={idPrefix}
        values={values}
        error={errors.mainColor}
        colors={colors}
        disabled={disabled}
        onChange={onChange}
      />
      {norm !== undefined && (
        <Typography variant="body2" color="text.secondary">
          {planned === null
            ? 'Плановий розхід тканини: немає норми для цієї моделі й кількості кольорів.'
            : `Плановий розхід тканини: ${formatMeters(planned)}`}
        </Typography>
      )}
      <TextField
        id={`${idPrefix}-sizes`}
        label="Розміри"
        multiline
        minRows={2}
        disabled={disabled}
        value={values.sizesText}
        helperText="Наприклад: M — 3, L — 2 або ПІБ і розмір"
        onChange={(event) => set('sizesText', event.target.value)}
      />
      <TextField
        id={`${idPrefix}-changes`}
        label="Технічні зміни"
        multiline
        minRows={2}
        disabled={disabled}
        value={values.technicalChanges}
        onChange={(event) => set('technicalChanges', event.target.value)}
      />
      <TextField
        id={`${idPrefix}-comment`}
        label="Коментар до позиції"
        multiline
        minRows={1}
        disabled={disabled}
        value={values.comment}
        onChange={(event) => set('comment', event.target.value)}
      />
      <ProductionItemApplications
        idPrefix={idPrefix}
        applications={values.applications}
        disabled={disabled}
        embroidery={embroidery}
        onChange={(applications) => set('applications', applications)}
      />
      {withRate && (
        <TextField
          id={`${idPrefix}-rate`}
          label="Розцінка пошиття, грн за шт."
          disabled={disabled}
          value={values.sewingRate}
          error={Boolean(errors.sewingRate)}
          helperText={errors.sewingRate ?? 'Трудовитрати швачки з картки товару; можна уточнити'}
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          onChange={(event) => set('sewingRate', event.target.value)}
        />
      )}
    </Stack>
  );
}
