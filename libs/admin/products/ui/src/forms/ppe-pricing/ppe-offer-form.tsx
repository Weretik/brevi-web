import { Button, Stack, TextField, Typography } from '@mui/material';

import type { PpeOfferValues } from '@admin/products/model';

interface Props {
  value: PpeOfferValues;
  onChange: (value: PpeOfferValues) => void;
  onSave: () => void;
  disabled: boolean;
}
export function PpeOfferForm({ value, onChange, onSave, disabled }: Props) {
  const change = (patch: Partial<PpeOfferValues>) => onChange({ ...value, ...patch });
  return (
    <Stack
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      sx={{ gap: 1 }}
    >
      <Typography variant="subtitle1" component="h4">
        Вхідні ціни ЗІЗ
      </Typography>
      <TextField
        label="Правило ціноутворення"
        value={value.ruleCode ?? ''}
        disabled={disabled}
        onChange={(event) => change({ ruleCode: event.target.value || null })}
        slotProps={{ htmlInput: { maxLength: 200 } }}
      />
      {(['supplierCost', 'externalRetail', 'externalWholesale'] as const).map((field, index) => (
        <TextField
          key={field}
          label={
            [
              'Ціна постачальника, грн',
              'Зовнішня роздрібна ціна, грн',
              'Зовнішня оптова ціна, грн',
            ][index]
          }
          type="number"
          value={value[field] ?? ''}
          disabled={disabled}
          onChange={(event) =>
            change({ [field]: event.target.value === '' ? null : Number(event.target.value) })
          }
          slotProps={{
            htmlInput: {
              min: field === 'supplierCost' ? 0.000001 : 0,
              step: 0.000001,
              max: 999999999999.999999,
            },
          }}
        />
      ))}
      <Typography variant="body2">
        Порожні зовнішні ціни використовують правило націнки. Збереження підтверджує перевірені вами
        значення.
      </Typography>
      <Button type="submit" variant="contained" disabled={disabled}>
        Зберегти й підтвердити ціни
      </Button>
    </Stack>
  );
}
