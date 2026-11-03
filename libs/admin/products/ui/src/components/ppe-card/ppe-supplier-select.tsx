import { MenuItem, TextField } from '@mui/material';

export interface PpeSupplierOption {
  id: number;
  name: string;
  isActive: boolean;
}

interface Props {
  label: string;
  value: number | '';
  suppliers: readonly PpeSupplierOption[];
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: number | '') => void;
}

/** Supplier from «Контрагенти»; an inactive one is marked, so an old offer still shows it. */
export function PpeSupplierSelect(props: Props) {
  return (
    <TextField
      select
      label={props.label}
      value={props.value}
      onChange={(event) =>
        props.onChange(event.target.value === '' ? '' : Number(event.target.value))
      }
      error={Boolean(props.error)}
      helperText={props.error ?? props.helperText}
      required={props.required}
      disabled={props.disabled}
      fullWidth
    >
      <MenuItem value="">—</MenuItem>
      {props.suppliers.map((supplier) => (
        <MenuItem key={supplier.id} value={supplier.id}>
          {supplier.isActive ? supplier.name : `${supplier.name} (не використовується)`}
        </MenuItem>
      ))}
    </TextField>
  );
}
