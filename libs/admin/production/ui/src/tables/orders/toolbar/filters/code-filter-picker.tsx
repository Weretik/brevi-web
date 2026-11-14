import { Autocomplete, TextField } from '@mui/material';

import type { ProductionFilterOption } from '@admin/production/model';

interface Props {
  label: string;
  value: string | null;
  options: ProductionFilterOption[];
  onChange: (value: string | null) => void;
}

/** A filter that picks a coded item, such as a model or a fabric, shown as «code · name». */
export function CodeFilterPicker({ label, value, options, onChange }: Props) {
  const selected = options.find((x) => x.code === value) ?? null;
  return (
    <Autocomplete
      size="small"
      options={options}
      value={selected}
      getOptionLabel={(option) => `${option.code} · ${option.name}`}
      isOptionEqualToValue={(option, current) => option.code === current.code}
      onChange={(_event, next) => onChange(next?.code ?? null)}
      renderInput={(params) => <TextField {...params} label={label} />}
      noOptionsText="Немає збігів"
    />
  );
}
