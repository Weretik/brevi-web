import { Autocomplete, TextField } from '@mui/material';

export interface PayrollPersonOption {
  employeeId: number;
  name: string;
  position: string;
}

/** A worker of the workshop picked by name, shown with the position. */
export function PersonPicker({
  label,
  people,
  value,
  helper,
  disabled,
  onChange,
}: {
  label: string;
  people: readonly PayrollPersonOption[];
  value: number | null;
  helper?: string;
  disabled: boolean;
  onChange: (id: number | null) => void;
}) {
  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: 240, flex: 1 }}
      options={people}
      value={people.find((x) => x.employeeId === value) ?? null}
      disabled={disabled}
      getOptionLabel={(option) => `${option.name} · ${option.position}`}
      isOptionEqualToValue={(option, selected) => option.employeeId === selected.employeeId}
      onChange={(_event, selected) => onChange(selected?.employeeId ?? null)}
      renderInput={(params) => <TextField {...params} label={label} helperText={helper} />}
    />
  );
}
