import { ReferenceFormSection } from '@admin/references/ui';
import { Autocomplete, MenuItem, Stack, TextField } from '@mui/material';

import { ProductionColorField } from '../colors/production-color-field';

import type {
  FabricReceiptErrors,
  FabricReceiptFormValues,
  FabricStockChoices,
} from '@admin/production/model';

interface Props {
  values: FabricReceiptFormValues;
  errors: FabricReceiptErrors;
  choices: FabricStockChoices;
  /** From a line card: the fabric and colour are that line's. */
  fixedLine: boolean;
  /** «Початковий залишок» is only the first movement of a line. */
  allowOpening: boolean;
  disabled: boolean;
  onChange: (values: FabricReceiptFormValues) => void;
}

/** «Прихід» from a supplier, or «Початковий залишок» of a new line. */
export function FabricReceiptForm({
  values,
  errors,
  choices,
  fixedLine,
  allowOpening,
  disabled,
  onChange,
}: Props) {
  const fabric = choices.fabrics.find((x) => x.id === values.fabricId) ?? null;
  const supplier = choices.suppliers.find((x) => x.id === values.supplierId) ?? null;
  const set = (patch: Partial<FabricReceiptFormValues>) => onChange({ ...values, ...patch });
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Тканина">
        {allowOpening && (
          <TextField
            select
            label="Рух"
            value={values.kind}
            disabled={disabled}
            onChange={(event) =>
              set({ kind: event.target.value as FabricReceiptFormValues['kind'] })
            }
            helperText={
              values.kind === 'Opening'
                ? 'Те, що вже лежить на полиці, коли склад починають вести.'
                : 'Тканина, що прийшла від постачальника.'
            }
          >
            <MenuItem value="Receipt">Прихід</MenuItem>
            <MenuItem value="Opening">Початковий залишок</MenuItem>
          </TextField>
        )}
        <Autocomplete
          options={choices.fabrics}
          value={fabric}
          disabled={disabled || fixedLine}
          getOptionLabel={(option) => `${option.code} · ${option.name}`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_event, value) => set({ fabricId: value?.id ?? null })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Тканина"
              required
              error={Boolean(errors.fabricId)}
              helperText={errors.fabricId ?? 'Тканини з кодом FAB- з «Тканини».'}
            />
          )}
        />
        <ProductionColorField
          label="Колір"
          required
          colors={choices.colors}
          value={values.color}
          disabled={disabled || fixedLine}
          error={errors.color}
          helperText={fixedLine ? undefined : 'З довідника «Кольори».'}
          onChange={(color) => set({ color })}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Рух">
        <TextField
          label="Метри"
          required
          value={values.meters}
          error={Boolean(errors.meters)}
          helperText={errors.meters ?? 'До двох знаків після коми.'}
          disabled={disabled}
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          onChange={(event) => set({ meters: event.target.value })}
        />
        <TextField
          label="Дата"
          type="date"
          required
          value={values.operationDate}
          error={Boolean(errors.operationDate)}
          helperText={errors.operationDate}
          disabled={disabled}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => set({ operationDate: event.target.value })}
        />
        {values.kind === 'Receipt' && (
          <Autocomplete
            options={choices.suppliers}
            value={supplier}
            disabled={disabled}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_event, value) => set({ supplierId: value?.id ?? null })}
            renderInput={(params) => (
              <TextField {...params} label="Постачальник" helperText="З «Постачальники»." />
            )}
          />
        )}
        <TextField
          label="Документ"
          placeholder="Накладна № 123"
          value={values.document}
          error={Boolean(errors.document)}
          helperText={errors.document}
          disabled={disabled}
          onChange={(event) => set({ document: event.target.value })}
        />
        <TextField
          label="Коментар"
          multiline
          minRows={2}
          value={values.note}
          error={Boolean(errors.note)}
          helperText={errors.note}
          disabled={disabled}
          onChange={(event) => set({ note: event.target.value })}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
