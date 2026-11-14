import { Autocomplete, TextField } from '@mui/material';

interface Props {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}

/** A filter that picks one plain value, such as a client or a colour. */
export function TextFilterPicker({ label, value, options, onChange }: Props) {
  return (
    <Autocomplete
      size="small"
      options={options}
      value={value}
      onChange={(_event, next) => onChange(next)}
      renderInput={(params) => <TextField {...params} label={label} />}
      noOptionsText="Немає збігів"
    />
  );
}
