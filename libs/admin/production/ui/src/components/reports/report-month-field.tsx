import { TextField } from '@mui/material';

interface Props {
  label: string;
  /** yyyy-mm. */
  value: string;
  max: string;
  onChange: (value: string) => void;
}

/** A month picker of the report period. */
export function ReportMonthField({ label, value, max, onChange }: Props) {
  return (
    <TextField
      label={label}
      type="month"
      size="small"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ inputLabel: { shrink: true }, htmlInput: { max } }}
      sx={{ width: 170 }}
    />
  );
}
