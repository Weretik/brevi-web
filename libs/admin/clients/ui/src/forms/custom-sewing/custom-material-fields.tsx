import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';

import type { CustomMaterial } from '@admin/clients/model';

export function CustomMaterialFields({
  title,
  rows,
  choices,
  disabled,
  onChange,
}: {
  title: string;
  rows: readonly CustomMaterial[];
  choices: readonly { id: number; name: string }[];
  disabled: boolean;
  onChange: (rows: readonly CustomMaterial[]) => void;
}) {
  const change = (index: number, row: CustomMaterial) =>
    onChange(rows.map((value, position) => (position === index ? row : value)));
  return (
    <Stack spacing={2}>
      <Typography component="h3" variant="subtitle1">
        {title}
      </Typography>
      {rows.map((row, index) => (
        <Stack key={index} direction={{ xs: 'column', md: 'row' }} spacing={1}>
          <TextField
            select
            label={`${title}: позиція ${index + 1}`}
            value={row.referenceId || ''}
            disabled={disabled}
            onChange={(event) => change(index, { ...row, referenceId: Number(event.target.value) })}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">Оберіть</MenuItem>
            {row.referenceId > 0 && !choices.some((choice) => choice.id === row.referenceId) && (
              <MenuItem value={row.referenceId}>Збережена позиція #{row.referenceId}</MenuItem>
            )}
            {choices.map((choice) => (
              <MenuItem key={choice.id} value={choice.id}>
                {choice.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            label={`${title}: норма ${index + 1}`}
            value={row.quantity}
            disabled={disabled}
            onChange={(event) => change(index, { ...row, quantity: Number(event.target.value) })}
          />
          <TextField
            select
            label={`${title}: одиниця ${index + 1}`}
            value={row.unit}
            disabled={disabled}
            onChange={(event) => change(index, { ...row, unit: event.target.value })}
          >
            {!['Metre', 'Piece', 'Service', 'Kilogram'].includes(row.unit) && (
              <MenuItem value={row.unit}>Збережена одиниця: {row.unit}</MenuItem>
            )}
            {Object.entries({
              Metre: 'Метр',
              Piece: 'Штука',
              Service: 'Послуга',
              Kilogram: 'Кілограм',
            }).map(([unit, label]) => (
              <MenuItem key={unit} value={unit}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            color="error"
            disabled={disabled}
            onClick={() => onChange(rows.filter((_, position) => position !== index))}
          >
            Видалити {title.toLocaleLowerCase('uk-UA')} {index + 1}
          </Button>
        </Stack>
      ))}
      <Button
        disabled={disabled || rows.length >= (title === 'Тканини' ? 40 : 100)}
        onClick={() =>
          onChange([
            ...rows,
            { referenceId: 0, quantity: 1, unit: title === 'Тканини' ? 'Metre' : 'Piece' },
          ])
        }
      >
        Додати: {title.toLocaleLowerCase('uk-UA')}
      </Button>
    </Stack>
  );
}
