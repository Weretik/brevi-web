import {
  Alert,
  Button,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type {
  FabricField,
  FabricFieldErrors,
  FabricFormValues,
  Supplier,
} from '@admin/references/model';

interface Props {
  creating: boolean;
  values: FabricFormValues;
  errors: FabricFieldErrors;
  suppliers: Supplier[];
  suppliersLoading: boolean;
  supplierError: string | null;
  onChange: (field: FabricField, value: string) => void;
  onRetrySuppliers: () => void;
}

export function FabricForm({
  creating,
  values,
  errors,
  suppliers,
  suppliersLoading,
  supplierError,
  onChange,
  onRetrySuppliers,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
            Основні дані
          </Typography>
          <TextField
            label="ID"
            type="number"
            value={values.id}
            onChange={(event) => onChange('id', event.target.value)}
            disabled={!creating}
            error={Boolean(errors.id)}
            helperText={errors.id}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            fullWidth
          />
          <TextField
            label="Назва"
            value={values.name}
            onChange={(event) => onChange('name', event.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            autoFocus
            fullWidth
          />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
            Закупівля
          </Typography>
          {suppliersLoading && <Skeleton variant="rounded" height={56} />}
          {supplierError && (
            <Alert
              severity="error"
              action={
                <Button type="button" onClick={onRetrySuppliers}>
                  Повторити
                </Button>
              }
            >
              {supplierError}
            </Alert>
          )}
          {!suppliersLoading && !supplierError && (
            <TextField
              select
              label="Постачальник"
              value={values.providerName}
              onChange={(event) => onChange('providerName', event.target.value)}
              error={Boolean(errors.providerName)}
              helperText={errors.providerName}
              fullWidth
            >
              {values.providerName &&
                !suppliers.some((supplier) => supplier.name === values.providerName) && (
                  <MenuItem value={values.providerName}>{values.providerName}</MenuItem>
                )}
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            label="Ціна"
            type="number"
            value={values.price}
            onChange={(event) => onChange('price', event.target.value)}
            error={Boolean(errors.price)}
            helperText={errors.price}
            slotProps={{ htmlInput: { min: 0, max: 10000, step: '0.01' } }}
            fullWidth
          />
        </Stack>
      </Paper>
    </Stack>
  );
}
