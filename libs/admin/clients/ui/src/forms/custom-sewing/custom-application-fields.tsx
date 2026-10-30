import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { CustomApplication } from '@admin/clients/model';

export function CustomApplicationFields({
  rows,
  disabled,
  onChange,
}: {
  rows: readonly CustomApplication[];
  disabled: boolean;
  onChange: (rows: readonly CustomApplication[]) => void;
}) {
  const change = (index: number, row: CustomApplication) =>
    onChange(rows.map((value, position) => (position === index ? row : value)));
  return (
    <Stack spacing={2}>
      <Typography component="h3" variant="subtitle1">
        Нанесення
      </Typography>
      {rows.map((row, index) => (
        <Stack key={index} spacing={1}>
          <TextField
            select
            label={`Тип нанесення ${index + 1}`}
            disabled={disabled}
            value={row.kind}
            onChange={(event) =>
              change(index, { ...row, kind: event.target.value as CustomApplication['kind'] })
            }
          >
            <MenuItem value="print">Друк</MenuItem>
            <MenuItem value="embroidery">Вишивка</MenuItem>
          </TextField>
          <TextField
            label={`Місце нанесення ${index + 1}`}
            disabled={disabled}
            value={row.location}
            onChange={(event) => change(index, { ...row, location: event.target.value })}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            {(['cost', 'saleAmount'] as const).map((field) => (
              <TextField
                key={field}
                type="number"
                label={`${field === 'cost' ? 'Внутрішня вартість' : 'Продажна сума'} нанесення ${index + 1}, грн`}
                disabled={disabled}
                value={row[field]}
                onChange={(event) =>
                  change(index, {
                    ...row,
                    [field]: Number(event.target.value),
                    ...(field === 'saleAmount' ? { saleApproved: false } : {}),
                  })
                }
              />
            ))}
          </Stack>
          <FormControlLabel
            label={`Продажну суму нанесення ${index + 1} погоджено`}
            control={
              <Checkbox
                disabled={disabled}
                checked={row.saleApproved}
                onChange={(_, saleApproved) => change(index, { ...row, saleApproved })}
              />
            }
          />
          <Button
            color="error"
            disabled={disabled}
            onClick={() => onChange(rows.filter((_, position) => position !== index))}
          >
            Видалити нанесення {index + 1}
          </Button>
        </Stack>
      ))}
      <Button
        disabled={disabled || rows.length >= 20}
        onClick={() =>
          onChange([
            ...rows,
            {
              kind: 'print',
              location: '',
              artworkFileId: null,
              cost: 0,
              saleAmount: 0,
              saleApproved: false,
            },
          ])
        }
      >
        Додати нанесення
      </Button>
    </Stack>
  );
}
