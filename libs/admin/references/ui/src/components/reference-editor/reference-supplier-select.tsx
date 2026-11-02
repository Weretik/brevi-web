import { Alert, Button, MenuItem, Skeleton, TextField } from '@mui/material';

import type { Supplier } from '@admin/references/model';

interface Props {
  value: string;
  error?: string;
  suppliers: Supplier[];
  loading: boolean;
  loadError: string | null;
  onChange: (value: string) => void;
  onRetry: () => void;
}

/** Supplier picker by name; active suppliers first, the current value kept even if inactive. */
export function ReferenceSupplierSelect({
  value,
  error,
  suppliers,
  loading,
  loadError,
  onChange,
  onRetry,
}: Props) {
  if (loading) return <Skeleton variant="rounded" height={40} />;
  if (loadError)
    return (
      <Alert
        severity="error"
        action={
          <Button type="button" onClick={onRetry}>
            Повторити
          </Button>
        }
      >
        {loadError}
      </Alert>
    );
  const options = suppliers.filter((supplier) => supplier.isActive || supplier.name === value);
  return (
    <TextField
      select
      label="Постачальник"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={Boolean(error)}
      helperText={error}
      fullWidth
    >
      {value && !options.some((supplier) => supplier.name === value) && (
        <MenuItem value={value}>{value}</MenuItem>
      )}
      {options.map((supplier) => (
        <MenuItem key={supplier.id} value={supplier.name}>
          {supplier.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
