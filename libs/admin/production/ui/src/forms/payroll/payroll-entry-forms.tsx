import {
  PAYROLL_COMMENT_MAX_LENGTH,
  PAYROLL_REASON_MAX_LENGTH,
  payrollPaymentKindLabels,
  payrollPaymentKinds,
} from '@admin/production/model';
import {
  Autocomplete,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import type { PayrollPersonOption } from './payroll-setup-form';
import type {
  PayrollAdjustmentErrors,
  PayrollAdjustmentFormValues,
  PayrollPaymentErrors,
  PayrollPaymentFormValues,
  PayrollPaymentKind,
} from '@admin/production/model';

function EmployeePicker({
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

interface PaymentProps {
  values: PayrollPaymentFormValues;
  errors: PayrollPaymentErrors;
  people: readonly PayrollPersonOption[];
  today: string;
  disabled: boolean;
  onChange: (values: PayrollPaymentFormValues) => void;
}

/** «Виплата»: who, when, how and how much. */
export function PayrollPaymentForm({
  values,
  errors,
  people,
  today,
  disabled,
  onChange,
}: PaymentProps) {
  return (
    <Stack sx={{ gap: 2 }}>
      <EmployeePicker
        people={people}
        value={values.employeeId}
        error={errors.employeeId}
        disabled={disabled}
        onChange={(employeeId) => onChange({ ...values, employeeId })}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
        <TextField
          type="date"
          label="Дата виплати"
          required
          value={values.paidOn}
          disabled={disabled}
          error={!!errors.paidOn}
          helperText={errors.paidOn}
          onChange={(event) => onChange({ ...values, paidOn: event.target.value })}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
        />
        <TextField
          select
          label="Вид"
          value={values.kind}
          disabled={disabled}
          sx={{ minWidth: 160 }}
          onChange={(event) =>
            onChange({ ...values, kind: event.target.value as PayrollPaymentKind })
          }
        >
          {payrollPaymentKinds.map((kind) => (
            <MenuItem key={kind} value={kind}>
              {payrollPaymentKindLabels[kind]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <TextField
        label="Сума, грн"
        required
        value={values.amount}
        disabled={disabled}
        error={!!errors.amount}
        helperText={errors.amount}
        onChange={(event) => onChange({ ...values, amount: event.target.value })}
        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
      />
      <TextField
        label="Коментар"
        multiline
        minRows={2}
        value={values.comment}
        disabled={disabled}
        error={!!errors.comment}
        helperText={errors.comment}
        onChange={(event) => onChange({ ...values, comment: event.target.value })}
        slotProps={{ htmlInput: { maxLength: PAYROLL_COMMENT_MAX_LENGTH } }}
      />
    </Stack>
  );
}

interface AdjustmentProps {
  values: PayrollAdjustmentFormValues;
  errors: PayrollAdjustmentErrors;
  people: readonly PayrollPersonOption[];
  disabled: boolean;
  onChange: (values: PayrollAdjustmentFormValues) => void;
}

/** «Інше нарахування / утримання» with a reason. */
export function PayrollAdjustmentForm({
  values,
  errors,
  people,
  disabled,
  onChange,
}: AdjustmentProps) {
  return (
    <Stack sx={{ gap: 2 }}>
      <EmployeePicker
        people={people}
        value={values.employeeId}
        error={errors.employeeId}
        disabled={disabled}
        onChange={(employeeId) => onChange({ ...values, employeeId })}
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={values.sign}
        disabled={disabled}
        onChange={(_event, sign) => sign && onChange({ ...values, sign })}
      >
        <ToggleButton value="accrual">Нарахування</ToggleButton>
        <ToggleButton value="deduction">Утримання</ToggleButton>
      </ToggleButtonGroup>
      <TextField
        label="Сума, грн"
        required
        value={values.amount}
        disabled={disabled}
        error={!!errors.amount}
        helperText={errors.amount}
        onChange={(event) => onChange({ ...values, amount: event.target.value })}
        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
      />
      <TextField
        label="Причина"
        required
        multiline
        minRows={2}
        value={values.reason}
        disabled={disabled}
        error={!!errors.reason}
        helperText={errors.reason}
        onChange={(event) => onChange({ ...values, reason: event.target.value })}
        slotProps={{ htmlInput: { maxLength: PAYROLL_REASON_MAX_LENGTH } }}
      />
    </Stack>
  );
}
