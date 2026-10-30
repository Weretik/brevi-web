import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';

import type { CustomOperation } from '@admin/clients/model';

export function CustomOperationFields({
  rows,
  choices,
  disabled,
  onChange,
}: {
  rows: readonly CustomOperation[];
  choices: readonly { id: number; name: string }[];
  disabled: boolean;
  onChange: (rows: readonly CustomOperation[]) => void;
}) {
  const change = (index: number, row: CustomOperation) =>
    onChange(rows.map((value, position) => (position === index ? row : value)));
  return (
    <Stack spacing={2}>
      <Typography component="h3" variant="subtitle1">
        Операції
      </Typography>
      {rows.map((row, index) => (
        <Stack key={index} direction={{ xs: 'column', md: 'row' }} spacing={1}>
          <TextField
            select
            label={`Операція ${index + 1}`}
            value={row.referenceId || ''}
            disabled={disabled}
            sx={{ minWidth: 220 }}
            onChange={(event) => change(index, { ...row, referenceId: Number(event.target.value) })}
          >
            <MenuItem value="">Оберіть</MenuItem>
            {row.referenceId > 0 && !choices.some((choice) => choice.id === row.referenceId) && (
              <MenuItem value={row.referenceId}>Збережена операція #{row.referenceId}</MenuItem>
            )}
            {choices.map((choice) => (
              <MenuItem key={choice.id} value={choice.id}>
                {choice.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            label={`Кількість операцій ${index + 1}`}
            value={row.quantity}
            disabled={disabled}
            onChange={(event) => change(index, { ...row, quantity: Number(event.target.value) })}
          />
          <TextField
            type="number"
            label={`Власна норма, хв ${index + 1}`}
            value={row.manualMinutes ?? ''}
            disabled={disabled}
            helperText="Порожньо — норма довідника"
            onChange={(event) =>
              change(index, {
                ...row,
                manualMinutes: event.target.value === '' ? null : Number(event.target.value),
              })
            }
          />
          <Button
            color="error"
            disabled={disabled}
            onClick={() => onChange(rows.filter((_, position) => position !== index))}
          >
            Видалити операцію {index + 1}
          </Button>
        </Stack>
      ))}
      <Button
        disabled={disabled || rows.length >= 100}
        onClick={() => onChange([...rows, { referenceId: 0, quantity: 1, manualMinutes: null }])}
      >
        Додати операцію
      </Button>
    </Stack>
  );
}
