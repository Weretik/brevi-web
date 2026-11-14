import { Autocomplete, TextField } from '@mui/material';

import type { PayrollPersonOption } from './payroll-setup-form';

export function PayrollEmployeePicker({
  people,
  value,
  error,
  disabled,
  onChange,
}: {
  people: readonly PayrollPersonOption[];
  value: number | null;
  error?: string;
  disabled: boolean;
  onChange: (id: number | null) => void;
}) {
  return (
    <Autocomplete
      options={people}
      value={people.find((x) => x.employeeId === value) ?? null}
      disabled={disabled}
      getOptionLabel={(option) => `${option.name} · ${option.position}`}
      isOptionEqualToValue={(option, selected) => option.employeeId === selected.employeeId}
      onChange={(_event, selected) => onChange(selected?.employeeId ?? null)}
      renderInput={(params) => (
        <TextField {...params} label="Працівник" required error={!!error} helperText={error} />
      )}
    />
  );
}
